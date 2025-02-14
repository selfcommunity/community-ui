import {
  Avatar,
  Box,
  Icon,
  InputAdornment,
  LinearProgress,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useThemeProps
} from '@mui/material';
import {ChangeEvent, Dispatch, useCallback, useEffect, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import RowSkeleton from './RowSkeleton';
import {LoadingButton} from '@mui/lab';
import {SCCourseJoinStatusType, SCCourseType, SCUserType} from '@selfcommunity/types';
import {PREFIX} from './constants';
import EmptyStatus from '../EmptyStatus';
import ActionButton from './ActionButton';
import CourseUsersTableSkeleton from './Skeleton';
import {actionWidgetTypes} from '../../utils/widget';
import {http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {AxiosResponse} from 'axios';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import ChangeUserStatus from './ChangeUsersStatus';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';

const classes = {
  search: `${PREFIX}-search`,
  avatarWrapper: `${PREFIX}-avatar-wrapper`,
  progressWrapper: `${PREFIX}-progress-wrapper`,
  progress: `${PREFIX}-progress`,
  loadingButton: `${PREFIX}-loading-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

type HeaderCellsType = {
  id?: string;
};

export interface CourseUsersTableProps {
  state: any;
  dispatch: Dispatch<any>;
  course?: SCCourseType | null;
  headerCells: HeaderCellsType[];
  editMode?: boolean;
}

function filteredUsers(users: SCUserType[], value: string): SCUserType[] {
  return users.filter((user) => (user.username || user.real_name).includes(value));
}

export default function CourseUsersTable(inProps: CourseUsersTableProps) {
  // PROPS
  const props: CourseUsersTableProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {course, state, dispatch, headerCells, editMode = false} = props;

  // STATES
  const [users, setUsers] = useState<SCUserType[] | null>(null);
  const [tempUsers, setTempUsers] = useState<SCUserType[] | null>(null);
  const [value, setValue] = useState('');

  // CONTEXTS
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const intl = useIntl();

  // EFFECTS
  useEffect(() => {
    setUsers(state.results);
  }, [state.results]);

  // HANDLERS
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const _value = e.target.value;

      if (_value.length > 0) {
        if (!tempUsers) {
          setTempUsers(users);
          setUsers((prevUsers) => filteredUsers(prevUsers, _value));
        } else {
          setUsers(filteredUsers(tempUsers, _value));
        }
      } else {
        setUsers(tempUsers);
        setTempUsers(null);
      }

      setValue(_value);
    },
    [users, tempUsers, setValue]
  );

  const handleNext = useCallback(() => {
    dispatch({type: actionWidgetTypes.LOADING_NEXT});

    http
      .request({
        url: state.next,
        method: 'GET'
      })
      .then((res: AxiosResponse<SCPaginatedResponse<SCUserType>>) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }, [state.next, dispatch]);

  if (!course || !users) {
    return <CourseUsersTableSkeleton />;
  }

  return (
    <Root>
      <TextField
        placeholder={intl.formatMessage({
          id: 'ui.editCourse.tab.users.searchBar.placeholder',
          defaultMessage: 'ui.editCourse.tab.users.searchBar.placeholder'
        })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon>search</Icon>
            </InputAdornment>
          )
        }}
        value={value}
        onChange={handleChange}
        disabled={users.length === 0 && value.length === 0}
        fullWidth
        className={classes.search}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headerCells.map((cell, i, array) => {
                if (!editMode && i === array.length - 1) {
                  return <TableCell width="14%" key={i} />;
                }

                return (
                  <TableCell width={editMode ? '25%' : '20%'} key={i}>
                    <Typography variant="body2">
                      <FormattedMessage id={cell.id} defaultMessage={cell.id} />
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 && <RowSkeleton animation={false} editMode={editMode} />}
            {users.length > 0 &&
              users.map((user, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Stack className={classes.avatarWrapper}>
                      <Avatar alt={user.username} src={user.avatar} />
                      <Typography variant="body2">{user.username}</Typography>
                    </Stack>
                  </TableCell>
                  {editMode ? (
                    <TableCell>
                      {user.join_status !== SCCourseJoinStatusType.CREATOR && scUserContext.user.id !== user.id ? (
                        <ChangeUserStatus course={course} user={user} />
                      ) : (
                        <Typography variant="body2">
                          <FormattedMessage
                            id={`ui.editCourse.tab.users.table.select.${user.join_status}`}
                            defaultMessage={`ui.editCourse.tab.users.table.select.${user.join_status}`}
                          />
                        </Typography>
                      )}
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Stack className={classes.progressWrapper}>
                        <LinearProgress className={classes.progress} variant="determinate" value={user.user_completion_rate} />

                        <Typography variant="body1">{`${Math.round(user.user_completion_rate)}%`}</Typography>
                      </Stack>
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="body2">{new Date(user.joined_at).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{new Date(user.last_active_at).toLocaleDateString()}</Typography>
                  </TableCell>
                  {!editMode && (
                    <TableCell>
                      <ActionButton course={course} user={user} />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            {state.isLoadingNext && <RowSkeleton editMode={editMode} />}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length > 0 && (
        <LoadingButton
          size="small"
          variant="outlined"
          color="inherit"
          loading={state.isLoadingNext}
          disabled={!state.next}
          className={classes.loadingButton}
          onClick={handleNext}>
          <Typography variant="body2">
            <FormattedMessage id="ui.courseUsersTable.btn.label" defaultMessage="ui.courseUsersTable.btn.label" />
          </Typography>
        </LoadingButton>
      )}

      {users.length === 0 && value.length === 0 && (
        <EmptyStatus icon="face" title="ui.courseUsersTable.empty.title" description="ui.courseUsersTable.empty.description" />
      )}
    </Root>
  );
}
