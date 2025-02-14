import {Divider, Stack, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from './constants';
import {memo, useCallback, useState} from 'react';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {OptionsData} from './types';
import {useSnackbar} from 'notistack';
import SwitchForm from './Options/SwitchForm';
import useDeepCompareEffect from 'use-deep-compare-effect';
import OptionsSkeleton from './Options/Skeleton';
import {LoadingButton} from '@mui/lab';
import {SCCourseType} from '@selfcommunity/types';
import {CourseService} from '@selfcommunity/api-services';

const classes = {
  optionsWrapper: `${PREFIX}-options-wrapper`,
  optionsDivider: `${PREFIX}-options-divider`,
  optionsButtonWrapper: `${PREFIX}-options-button-wrapper`
};

const OPTIONS = {
  enforce_lessons_order: {
    title: 'ui.editCourse.tab.options',
    description: 'ui.editCourse.tab.options.description'
  },
  new_comment_notification_enabled: {
    title: 'ui.editCourse.tab.options.notifications',
    description: 'ui.editCourse.tab.options.notifications.description'
  },
  hide_member_count: {
    title: 'ui.editCourse.tab.options.permissions',
    description: 'ui.editCourse.tab.options.permissions.description'
  }
};

interface OptionsProps {
  course: SCCourseType | null;
  setSCCourse: (course: SCCourseType) => void;
}

function Options(props: OptionsProps) {
  // PROPS
  const {course, setSCCourse} = props;

  // STATES
  const [tempOptions, setTempOptions] = useState<OptionsData | null>(null);
  const [canSave, setCanSave] = useState(false);
  const [loading, setLoading] = useState(false);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // EFFECTS
  useDeepCompareEffect(() => {
    if (!course || !tempOptions) {
      return;
    }

    if (
      course.enforce_lessons_order !== tempOptions.enforce_lessons_order ||
      course.new_comment_notification_enabled !== tempOptions.new_comment_notification_enabled ||
      course.hide_member_count !== tempOptions.hide_member_count
    ) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  }, [course, tempOptions, setCanSave]);

  // HANDLERS
  const handleChange = useCallback(
    (key: string, value: boolean) => {
      setTempOptions((prevOptions) => {
        if (!prevOptions) {
          return {
            enforce_lessons_order: course.enforce_lessons_order,
            new_comment_notification_enabled: course.new_comment_notification_enabled,
            hide_member_count: course.hide_member_count,
            [key]: value
          };
        }

        return {
          ...prevOptions,
          [key]: value
        };
      });
    },
    [setTempOptions, course]
  );

  const handleSubmit = useCallback(() => {
    setLoading(true);

    CourseService.patchCourse(course.id, {id: course.id, ...tempOptions})
      .then((data) => {
        setSCCourse(data);
        setTempOptions(null);
        setCanSave(false);
        setLoading(false);

        enqueueSnackbar(<FormattedMessage id="ui.contributionActionMenu.actionSuccess" defaultMessage="ui.contributionActionMenu.actionSuccess" />, {
          variant: 'success',
          autoHideDuration: 3000
        });
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, [course, tempOptions, setCanSave, setLoading]);

  if (!course) {
    return <OptionsSkeleton />;
  }

  return (
    <>
      <Stack className={classes.optionsWrapper}>
        {Object.entries(OPTIONS).map(([key, value], i) => (
          <SwitchForm
            key={i}
            name={key}
            title={value.title}
            description={value.description}
            checked={course[key]}
            handleChangeOptions={handleChange}
          />
        ))}
      </Stack>

      <Divider className={classes.optionsDivider} />

      <Stack className={classes.optionsButtonWrapper}>
        <LoadingButton size="small" variant="contained" disabled={!canSave} onClick={handleSubmit} loading={loading}>
          <Typography variant="body1">
            <FormattedMessage id="ui.editCourse.tab.options.button.save" defaultMessage="ui.editCourse.tab.options.button.save" />
          </Typography>
        </LoadingButton>
      </Stack>
    </>
  );
}

export default memo(Options);
