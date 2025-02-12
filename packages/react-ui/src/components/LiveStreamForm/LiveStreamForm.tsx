import {LoadingButton} from '@mui/lab';
import {Alert, Box, BoxProps, FormGroup, Paper, TextField, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCCommunitySubscriptionTier, SCLiveStreamType} from '@selfcommunity/types';
import classNames from 'classnames';
import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {LIVE_STREAM_DESCRIPTION_MAX_LENGTH, LIVE_STREAM_TITLE_MAX_LENGTH, LIVE_STREAM_SLUG_MAX_LENGTH} from '../../constants/LiveStream';
import {LIVESTREAM_DEFAULT_SETTINGS, PREFIX} from './constants';
import {InitialFieldState} from './types';
import UploadEventCover from '../EventForm/UploadEventCover';
import LiveStreamSettingsForm from './LiveStreamFormSettings';
import {formatHttpErrorCode, LiveStreamApiClient, LiveStreamService} from '@selfcommunity/api-services';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import CoverPlaceholder from '../../assets/deafultCover';
import {Link, SCContextType, SCPreferences, SCPreferencesContextType, useSCContext, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {SELFCOMMUNITY_PRICING} from '../PlatformWidget/constants';
import {WARNING_THRESHOLD_EXPIRING_SOON} from '../LiveStreamRoom/constants';

const classes = {
  root: `${PREFIX}-root`,
  warning: `${PREFIX}-warning`,
  form: `${PREFIX}-form`,
  title: `${PREFIX}-title`,
  cover: `${PREFIX}-cover`,
  slug: `${PREFIX}-slug`,
  description: `${PREFIX}-description`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  error: `${PREFIX}-error`,
  genericError: `${PREFIX}-generic-error`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({}));

export interface LiveStreamFormProps extends BoxProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Event Object
   * @default null
   */
  liveStream?: SCLiveStreamType;

  /**
   * On success callback function
   * @default null
   */
  onSuccess?: (data: SCLiveStreamType) => void;

  /**
   * On error callback function
   * @default null
   */
  onError?: (error: any) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

const messages = defineMessages({
  title: {
    id: 'ui.liveStreamForm.title.placeholder',
    defaultMessage: 'ui.liveStreamForm.title.placeholder'
  },
  slug: {
    id: 'ui.liveStreamForm.slug.placeholder',
    defaultMessage: 'ui.liveStreamForm.slug.placeholder'
  },
  description: {
    id: 'ui.liveStreamForm.description.placeholder',
    defaultMessage: 'ui.liveStreamForm.description.placeholder'
  }
});

/**
 *> API documentation for the Community-JS LiveStreamForm component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {LiveStreamForm} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `LiveStreamForm` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLiveStreamForm-root|Styles applied to the root element.|
 |title|.SCLiveStreamForm-title|Styles applied to the title element.|
 |cover|.SCLiveStreamForm-cover|Styles applied to the cover field.|
 |form|.SCLiveStreamForm-form|Styles applied to the form element.|
 |name|.SCLiveStreamForm-name|Styles applied to the name field.|
 |description|.SCLiveStreamForm-description|Styles applied to the description field.|
 |content|.SCLiveStreamForm-content|Styles applied to the  element.|
 |error|.SCLiveStreamForm-error|Styles applied to the error elements.|

 * @param inProps
 */
export default function LiveStreamForm(inProps: LiveStreamFormProps): JSX.Element {
  //PROPS
  const props: LiveStreamFormProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onSuccess, onError, liveStream = null, ...rest} = props;

  // HOOKS
  const scContext: SCContextType = useSCContext();
  const scUserContext = useSCUser();
  const {preferences}: SCPreferencesContextType = useSCPreferences();
  const isCommunityOwner = useMemo(() => scUserContext?.user?.id === 1, [scUserContext.user]);
  const isFreeTrialTier = useMemo(
    () =>
      preferences &&
      SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value === SCCommunitySubscriptionTier.FREE_TRIAL,
    [preferences]
  );
  const intl = useIntl();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const initialFieldState: InitialFieldState = {
    title: liveStream?.title || '',
    description: liveStream?.description || '',
    slug: liveStream?.slug || '',
    settings: liveStream?.settings || LIVESTREAM_DEFAULT_SETTINGS,
    cover: liveStream?.cover || '',
    coverFile: liveStream?.cover || '',
    isSubmitting: false
  };

  // STATE
  const [field, setField] = useState<InitialFieldState>(initialFieldState);
  const [error, setError] = useState<any>({});
  const [genericError, setGenericError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const _backgroundCover = {
    ...(field.cover ? {background: `url('${field.cover}') center / cover`} : {background: `url('${CoverPlaceholder}') no-repeat 0 0 / 100% 100%`})
  };

  const handleChangeCover = useCallback(
    (cover: Blob) => {
      setField((prev) => ({...prev, ['coverFile']: cover}));
      const reader = new FileReader();
      reader.onloadend = () => {
        setField((prev) => ({...prev, ['cover']: reader.result}));
      };
      reader.readAsDataURL(cover);
      if (error.coverError) {
        delete error.coverError;
        setError(error);
      }
    },
    [error]
  );

  const handleSubmit = useCallback(() => {
    setField((prev) => ({...prev, ['isSubmitting']: true}));
    setGenericError(null);
    const formData = new FormData();
    if (field.coverFile) {
      formData.append('cover', field.coverFile);
    }
    formData.append('title', field.title);
    formData.append('description', field.description);
    formData.append('slug', field.slug);
    formData.append('settings', JSON.stringify(field.settings));

    let liveStreamService: Promise<SCLiveStreamType>;
    if (liveStream) {
      liveStreamService = LiveStreamService.update(liveStream.id, formData as unknown as SCLiveStreamType, {
        headers: {'Content-Type': 'multipart/form-data'}
      });
    } else {
      liveStreamService = LiveStreamService.create(formData, {headers: {'Content-Type': 'multipart/form-data'}});
    }
    liveStreamService
      .then((data: SCLiveStreamType) => {
        setField((prev) => ({...prev, ['isSubmitting']: false}));
        onSuccess?.(data);
      })
      .catch((e) => {
        const _error = formatHttpErrorCode(e);
        if ('errorsError' in _error || !Object.keys(_error).length) {
          setGenericError(
            intl.formatMessage({
              id: 'ui.liveStreamForm.error.monthlyMinuteLimitReached',
              defaultMessage: 'ui.liveStreamForm.error.monthlyMinuteLimitReached'
            })
          );
        } else {
          setGenericError(null);
        }
        let __errors = {};
        if ('coverError' in _error) {
          __errors = {
            ...__errors,
            ['coverError']: <FormattedMessage id="ui.liveStreamForm.cover.error.invalid" defaultMessage="ui.liveStreamForm.cover.error.invalid" />
          };
        }
        if ('titleError' in _error) {
          __errors = {
            ...__errors,
            ['titleError']: <FormattedMessage id="ui.liveStreamForm.title.error.invalid" defaultMessage="ui.liveStreamForm.title.error.invalid" />
          };
        }
        if ('slugError' in _error) {
          __errors = {
            ...__errors,
            ['slugError']: <FormattedMessage id="ui.liveStreamForm.slug.error.invalid" defaultMessage="ui.liveStreamForm.slug.error.invalid" />
          };
        }
        setError(__errors);
        setField((prev) => ({...prev, ['isSubmitting']: false}));
        Logger.error(SCOPE_SC_UI, e);
        onError?.(e);
      });
  }, [field, onSuccess, onError]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = event.target;
      setField((prev) => ({...prev, [name]: value}));
      if (error[`${name}Error`]) {
        delete error[`${name}Error`];
        setError(error);
      }
      setGenericError(null);
    },
    [error, setGenericError]
  );

  const handleChangeSettings = useCallback(
    (data) => {
      setField((prev) => ({...prev, ...{settings: data}}));
    },
    [setField]
  );

  const warning = useMemo(() => {
    let _message;
    if (isFreeTrialTier && isCommunityOwner) {
      _message = (
        <FormattedMessage
          id="ui.liveStreamForm.selector.warningSubscriptionRequired"
          defaultMessage="ui.liveStreamForm.selector.warningSubscriptionRequired"
          values={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            link: (...chunks) => <Link to={SELFCOMMUNITY_PRICING[scContext.settings.locale.default]}>{chunks}</Link>
          }}
        />
      );
    } else if (timeRemaining !== null && timeRemaining <= WARNING_THRESHOLD_EXPIRING_SOON) {
      if (timeRemaining <= 1) {
        _message = (
          <FormattedMessage
            id="ui.liveStreamForm.selector.warningMinutesExausted"
            defaultMessage="ui.liveStreamForm.selector.warningMinutesExausted"
          />
        );
      } else if (timeRemaining <= WARNING_THRESHOLD_EXPIRING_SOON) {
        _message = (
          <FormattedMessage
            id="ui.liveStreamForm.selector.warningRemainingMinutes"
            defaultMessage="ui.liveStreamForm.selector.warningRemainingMinutes"
            values={{minutes: timeRemaining}}
          />
        );
      }
    }
    if (_message) {
      return (
        <Box className={classes.warning}>
          <Alert variant="filled" severity="warning">
            {_message}
          </Alert>
        </Box>
      );
    }
    return null;
  }, [isFreeTrialTier, isCommunityOwner, timeRemaining]);

  const fetchLivestreamStatus = () => {
    LiveStreamApiClient.getMonthlyDuration()
      .then((r) => {
        setTimeRemaining(r.remaining_minutes);
      })
      .catch((error) => {
        console.error('Error fetching live status:', error);
      });
  };

  useEffect(() => {
    fetchLivestreamStatus();
  }, []);

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {warning}
      <Paper style={_backgroundCover} classes={{root: classes.cover}}>
        <UploadEventCover isCreationMode={true} onChange={handleChangeCover} />
      </Paper>
      {Boolean(error['coverError']) && <Typography color="error">{error['coverError']}</Typography>}
      <FormGroup className={classes.form}>
        <TextField
          required
          className={classes.title}
          placeholder={`${intl.formatMessage(messages.title)}`}
          margin="normal"
          value={field.title}
          name="title"
          onChange={handleChange}
          InputProps={{
            endAdornment: <Typography variant="body2">{LIVE_STREAM_TITLE_MAX_LENGTH - field.title.length}</Typography>
          }}
          error={Boolean(field.title.length > LIVE_STREAM_TITLE_MAX_LENGTH) || Boolean(error['titleError'])}
          helperText={
            field.title.length > LIVE_STREAM_TITLE_MAX_LENGTH ? (
              <FormattedMessage id="ui.liveStreamForm.title.error.maxLength" defaultMessage="ui.liveStreamForm.title.error.maxLength" />
            ) : error['titleError'] ? (
              error['titleError']
            ) : null
          }
        />
        <TextField
          required
          className={classes.slug}
          placeholder={`${intl.formatMessage(messages.slug)}`}
          margin="normal"
          value={field.slug}
          name="slug"
          onChange={handleChange}
          InputProps={{
            endAdornment: <Typography variant="body2">{LIVE_STREAM_SLUG_MAX_LENGTH - field.slug.length}</Typography>
          }}
          error={Boolean(field.slug.length > LIVE_STREAM_SLUG_MAX_LENGTH) || Boolean(error['slugError'])}
          helperText={
            field.title.length > LIVE_STREAM_SLUG_MAX_LENGTH ? (
              <FormattedMessage id="ui.liveStreamForm.slug.error.maxLength" defaultMessage="ui.liveStreamForm.slug.error.maxLength" />
            ) : error['slugError'] ? (
              error['slugError']
            ) : null
          }
        />
        <TextField
          multiline
          rows={4}
          className={classes.description}
          placeholder={`${intl.formatMessage(messages.description)}`}
          margin="normal"
          value={field.description}
          name="description"
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <Typography variant="body2">
                {field.description?.length ? LIVE_STREAM_DESCRIPTION_MAX_LENGTH - field.description.length : LIVE_STREAM_DESCRIPTION_MAX_LENGTH}
              </Typography>
            )
          }}
          error={Boolean(field.description?.length > LIVE_STREAM_DESCRIPTION_MAX_LENGTH)}
          helperText={
            field.description?.length > LIVE_STREAM_DESCRIPTION_MAX_LENGTH ? (
              <FormattedMessage id="ui.liveStreamForm.description.error.maxLength" defaultMessage="ui.liveStreamForm.description.error.maxLength" />
            ) : null
          }
        />
        <LiveStreamSettingsForm settings={field.settings} onChange={handleChangeSettings} />
        {genericError && (
          <Box className={classes.genericError}>
            <Alert variant="filled" severity="error">
              {genericError}
            </Alert>
          </Box>
        )}
        <Box className={classes.actions}>
          <LoadingButton
            loading={field.isSubmitting}
            disabled={
              !field.title ||
              field.isSubmitting ||
              field.title.length > LIVE_STREAM_TITLE_MAX_LENGTH ||
              field.description.length > LIVE_STREAM_DESCRIPTION_MAX_LENGTH ||
              isFreeTrialTier ||
              timeRemaining <= WARNING_THRESHOLD_EXPIRING_SOON
            }
            variant="contained"
            onClick={handleSubmit}
            color="secondary">
            {liveStream ? (
              <FormattedMessage id="ui.liveStreamForm.button.edit" defaultMessage="ui.liveStreamForm.button.edit" />
            ) : (
              <FormattedMessage id="ui.liveStreamForm.button.create" defaultMessage="ui.liveStreamForm.button.create" />
            )}
          </LoadingButton>
        </Box>
      </FormGroup>
    </Root>
  );
}
