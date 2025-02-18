import {LoadingButton} from '@mui/lab';
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
  Avatar,
  Button,
  ButtonProps,
  Chip,
  Stack,
  styled,
  TextField,
  Typography,
  useThemeProps
} from '@mui/material';
import {Fragment, memo, SyntheticEvent, useCallback, useEffect, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCCourseType, SCUserType} from '@selfcommunity/types';
import BaseDialog from '../BaseDialog';
import {Endpoints, EndpointType, http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import {AxiosResponse} from 'axios';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';

const PREFIX = 'SCAddUsersButton';

const classes = {
  root: `${PREFIX}-root`,
  dialogRoot: `${PREFIX}-dialog-root`,
  dialogAutocompleteWrapper: `${PREFIX}-dialog-autocomplete-wrapper`,
  dialogChipWrapper: `${PREFIX}-dialog-chip-wrapper`
};

const messages = defineMessages({
  placeholder: {
    id: 'ui.addUserButton.dialog.searchBar.placeholder',
    defaultMessage: 'ui.addUserButton.dialog.searchBar.placeholder'
  }
});

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot',
  overridesResolver: (_props, styles) => styles.dialogRoot
})(() => ({}));

export interface AddUsersButtonProps extends ButtonProps {
  course: SCCourseType | null;
  label: string;

  /**
   * Handles component update
   * @default false
   */
  isUpdating?: boolean;

  /**
   * Event API Endpoint
   * @default Endpoints.GetCourseSuggestedUsers
   */
  endpoint: EndpointType;

  /**
   * Feed API Query Params
   * @default [{'limit': 10, 'offset': 0, 'search': ''}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * Handles dialog confirm
   * @default null
   */
  onConfirm?: (users: SCUserType[]) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

function AddUsersButton(inProps: AddUsersButtonProps) {
  // PROPS
  const props: AddUsersButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    course,
    label,
    variant = 'outlined',
    color = 'inherit',
    size = 'small',
    isUpdating = false,
    endpoint = Endpoints.GetCourseSuggestedUsers,
    endpointQueryParams = {limit: DEFAULT_PAGINATION_LIMIT, offset: DEFAULT_PAGINATION_OFFSET, search: ''},
    onConfirm,
    ...rest
  } = props;

  // STATES
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [invited, setInvited] = useState<SCUserType[]>([]);
  const [suggested, setSuggested] = useState<SCUserType[]>([]);
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // HOOKS
  const intl = useIntl();
  const {enqueueSnackbar} = useSnackbar();

  // CALLBACKS
  const fetchUsers = useCallback(
    (newValue: string) => {
      setLoading(true);

      http
        .request({
          url: endpoint.url(),
          method: endpoint.method,
          params: {
            ...endpointQueryParams,
            search: newValue
          }
        })
        .then((response: AxiosResponse<SCPaginatedResponse<SCUserType>>) => {
          setSuggested(response.data.results);
          setLoading(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);

          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    },
    [setLoading, course, endpoint, endpointQueryParams, setSuggested]
  );

  // EFFECTS
  useEffect(() => {
    if (openDialog) {
      fetchUsers(value);
    }
  }, [openDialog, value]);

  // HANDLERS DIALOG
  /**
   * Handles dialog closing
   * @param reason
   */
  const handleToggleDialogOpen = useCallback(() => {
    if (!isUpdating) {
      setOpenDialog((prev) => !prev);
    }
  }, [isUpdating, setOpenDialog]);

  /**
   * Handles action confirm
   */
  const handleConfirm = useCallback(() => {
    onConfirm?.(invited);
    setInvited([]);
  }, [invited]);

  // HANDLERS AUTOCOMPLETE
  const handleInputChange = useCallback(
    (_: SyntheticEvent, newValue: string, reason: AutocompleteInputChangeReason) => {
      switch (reason) {
        case 'input':
          setValue(newValue);
          !newValue && setSuggested([]);

          break;
        case 'reset':
          setValue(newValue);

          break;
      }
    },
    [setValue, setSuggested]
  );

  const filterOptions = useCallback((options: SCUserType[], state: {inputValue: string}) => {
    return options.filter((option) => {
      const usernameMatch = option.username.toLowerCase().includes(state.inputValue.toLowerCase());
      const nameMatch = option.real_name.toLowerCase().includes(state.inputValue.toLowerCase());

      return usernameMatch || nameMatch;
    });
  }, []);

  const handleChange = useCallback(
    (e: SyntheticEvent, value: SCUserType[], reason: AutocompleteChangeReason) => {
      e.preventDefault();
      e.stopPropagation();

      switch (reason) {
        case 'selectOption':
        case 'removeOption':
          setInvited(value);

          break;
      }
    },
    [setInvited]
  );

  const handleDelete = useCallback(
    (userToDelete: SCUserType) => {
      setInvited((prev) => prev.filter((user) => user.id !== userToDelete.id));
    },
    [setInvited]
  );

  return (
    <Fragment>
      <Root onClick={handleToggleDialogOpen} variant={variant} color={color} size={size} className={classes.root} {...rest}>
        <FormattedMessage id={label} defaultMessage={label} />
      </Root>

      {openDialog && (
        <DialogRoot
          DialogContentProps={{dividers: false}}
          open
          onClose={handleToggleDialogOpen}
          title={
            <Typography variant="h5">
              <FormattedMessage id="ui.addUserButton.dialog.title" defaultMessage="ui.addUserButton.dialog.title" />
            </Typography>
          }
          actions={
            <LoadingButton onClick={handleConfirm} size="medium" variant="contained" autoFocus disabled={!invited.length} loading={isUpdating}>
              <Typography variant="body1">
                <FormattedMessage id="ui.addUserButton.dialog.confirm" defaultMessage="ui.addUserButton.dialog.confirm" />
              </Typography>
            </LoadingButton>
          }
          className={classes.dialogRoot}>
          <Stack className={classes.dialogAutocompleteWrapper}>
            <Autocomplete
              loading={loading}
              size="small"
              multiple
              options={suggested}
              onChange={handleChange}
              onInputChange={handleInputChange}
              inputValue={value}
              filterOptions={filterOptions}
              value={invited}
              getOptionLabel={(option) => option?.username || '...'}
              isOptionEqualToValue={(option, value) => option?.id === value.id}
              loadingText={<FormattedMessage id="ui.addUserButton.autocomplete.loading" defaultMessage="ui.addUserButton.autocomplete.loading" />}
              noOptionsText={
                <FormattedMessage id="ui.addUserButton.autocomplete.noResults" defaultMessage="ui.addUserButton.autocomplete.noResults" />
              }
              renderTags={() => null}
              popupIcon={null}
              disableClearable
              renderOption={(props, option) => (
                <Stack
                  component="li"
                  sx={{
                    flexDirection: 'row',
                    gap: '5px'
                  }}
                  {...props}>
                  <Avatar alt={option.username} src={option.avatar} />
                  <Typography>{option.username}</Typography>
                </Stack>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder={`${intl.formatMessage(messages.placeholder)}`}
                  InputProps={{
                    ...params.InputProps
                  }}
                />
              )}
            />
            <Stack className={classes.dialogChipWrapper}>
              {invited.map((option, index) => (
                <Chip
                  key={index}
                  avatar={<Avatar alt={option.username} src={option.avatar} />}
                  label={option.username}
                  onDelete={() => {
                    handleDelete(option);
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </DialogRoot>
      )}
    </Fragment>
  );
}

export default memo(AddUsersButton);
