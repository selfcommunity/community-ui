import {LoadingButton} from '@mui/lab';
import {
  Alert,
  Box,
  BoxProps,
  FormControl,
  FormGroup,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {LocalizationProvider, MobileDatePicker, MobileTimePicker} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {EventService, formatHttpErrorCode} from '@selfcommunity/api-services';
import {SCContextType, SCPreferences, SCPreferencesContextType, useSCContext, useSCPreferences} from '@selfcommunity/react-core';
import {SCEventLocationType, SCEventPrivacyType, SCEventRecurrenceType, SCEventType, SCFeatureName} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import enLocale from 'date-fns/locale/en-US';
import itLocale from 'date-fns/locale/it';
import PubSub from 'pubsub-js';
import React, {ChangeEvent, useCallback, useMemo, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {EVENT_DESCRIPTION_MAX_LENGTH, EVENT_TITLE_MAX_LENGTH} from '../../constants/Event';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import {DAILY_LATER_DAYS, MONTHLY_LATER_DAYS, NEVER_LATER_DAYS, PREFIX, WEEKLY_LATER_DAYS} from './constants';
import EventAddress, {EventAddressProps} from './EventAddress';
import {FieldStateKeys, FieldStateValues, Geolocation, InitialFieldState} from './types';
import UploadEventCover from './UploadEventCover';
import {combineDateAndTime, getLaterDaysDate, getLaterHoursDate, getNewDate} from './utils';
import {LIVESTREAM_DEFAULT_SETTINGS} from '../LiveStreamForm/constants';
import CoverPlaceholder from '../../assets/deafultCover';

const messages = defineMessages({
  name: {
    id: 'ui.eventForm.name.placeholder',
    defaultMessage: 'ui.eventForm.name.placeholder'
  },
  description: {
    id: 'ui.eventForm.description.placeholder',
    defaultMessage: 'ui.eventForm.description.placeholder'
  },
  startDate: {
    id: 'ui.eventForm.date.placeholder',
    defaultMessage: 'ui.eventForm.date.placeholder'
  },
  startTime: {
    id: 'ui.eventForm.time.placeholder',
    defaultMessage: 'ui.eventForm.time.placeholder'
  },
  frequency: {
    id: 'ui.eventForm.frequency.label',
    defaultMessage: 'ui.eventForm.frequency.label'
  },
  frequencyPlaceholder: {
    id: 'ui.eventForm.frequency.none.placeholder',
    defaultMessage: 'ui.eventForm.frequency.none.placeholder'
  },
  endDate: {
    id: 'ui.eventForm.date.end.placeholder',
    defaultMessage: 'ui.eventForm.date.end.placeholder'
  },
  endTime: {
    id: 'ui.eventForm.time.end.placeholder',
    defaultMessage: 'ui.eventForm.time.end.placeholder'
  },
  pickerCancelAction: {
    id: 'ui.eventForm.time.picker.cancel.placeholder',
    defaultMessage: 'ui.eventForm.time.picker.cancel.placeholder'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  active: `${PREFIX}-active`,
  title: `${PREFIX}-title`,
  cover: `${PREFIX}-cover`,
  picker: `${PREFIX}-picker`,
  dateTime: `${PREFIX}-date-time`,
  frequency: `${PREFIX}-frequency`,
  form: `${PREFIX}-form`,
  switch: `${PREFIX}-switch`,
  switchLabel: `${PREFIX}-switch-label`,
  name: `${PREFIX}-name`,
  description: `${PREFIX}-description`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  privacySection: `${PREFIX}-privacy-section`,
  privacySectionInfo: `${PREFIX}-privacy-section-info`,
  error: `${PREFIX}-error`,
  genericError: `${PREFIX}-generic-error`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface EventFormProps extends BoxProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * Initial location
   * @default SCEventLocationType.PERSON
   */
  presetLocation?: SCEventLocationType;

  /**
   * On success callback function
   * @default null
   */
  onSuccess?: (data: SCEventType) => void;

  /**
   * On error callback function
   * @default null
   */
  onError?: (error: any) => void;

  /**
   * Props to spread to EventAddress component
   * @default empty object
   */
  EventAddressComponentProps?: Pick<EventAddressProps, 'locations'>;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS  Event Form component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {EventForm} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCEventForm` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventForm-root|Styles applied to the root element.|
 |active|.SCEventForm-active|Styles applied to the  active element.|
 |title|.SCEventForm-title|Styles applied to the title element.|
 |cover|.SCEventForm-cover|Styles applied to the cover field.|
 |form|.SCEventForm-form|Styles applied to the form element.|
 |switch|.SCEventForm-switch|Styles applied to the switch element.|
 |switchLabel|.SCEventForm-switch-label|Styles applied to the switchLabel element.|
 |name|.SCEventForm-name|Styles applied to the name field.|
 |description|.SCEventForm-description|Styles applied to the description field.|
 |content|.SCEventForm-content|Styles applied to the  element.|
 |privacySection|.SCEventForm-privacy-section|Styles applied to the privacy section.|
 |privacySectionInfo|.SCEventForm-privacy-section-info|Styles applied to the privacy info section.|
 |error|.SCEventForm-error|Styles applied to the error elements.|

 * @param inProps
 */
export default function EventForm(inProps: EventFormProps): JSX.Element {
  //PROPS
  const props: EventFormProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onSuccess, onError, event, presetLocation, EventAddressComponentProps = {}, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  // INTL
  const intl = useIntl();

  const startDateTime = useMemo(() => getNewDate(event?.start_date), [event]);
  const endDateTime = useMemo(() => getNewDate(event?.end_date), [event]);

  const initialFieldState: InitialFieldState = {
    name: event?.name || '',
    description: event ? event.description : '',
    imageOriginal: event?.image_bigger || '',
    imageOriginalFile: '',
    startDate: event ? startDateTime : getNewDate(),
    startTime: event ? startDateTime : getLaterHoursDate(1),
    endDate: event?.end_date ? endDateTime : getNewDate(),
    endTime: event?.end_date ? endDateTime : getLaterHoursDate(3),
    location: event?.location
      ? event.location === SCEventLocationType.ONLINE && event.live_stream
        ? SCEventLocationType.LIVESTREAM
        : SCEventLocationType.ONLINE
      : EventAddressComponentProps.locations?.length
      ? presetLocation in EventAddressComponentProps.locations
        ? presetLocation
        : EventAddressComponentProps.locations[0]
      : SCEventLocationType.PERSON,
    geolocation: event?.geolocation || '',
    lat: event?.geolocation_lat || null,
    lng: event?.geolocation_lng || null,
    link: event?.link || '',
    liveStreamSettings: event?.live_stream ? event?.live_stream.settings : null,
    recurring: event?.recurring || SCEventRecurrenceType.NEVER,
    isPublic: event?.privacy === SCEventPrivacyType.PUBLIC || true,
    isSubmitting: false
  };

  // STATE
  const [field, setField] = useState<InitialFieldState>(initialFieldState);
  const [error, setError] = useState<any>({});
  const [genericError, setGenericError] = useState<string | null>(null);

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const liveStreamEnabled = useMemo(
    () =>
      scPreferences.preferences &&
      scPreferences.features &&
      scPreferences.features.includes(SCFeatureName.LIVE_STREAM) &&
      SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED in scPreferences.preferences &&
      scPreferences.preferences[SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED].value,
    [scPreferences.preferences, scPreferences.features]
  );
  const privateEnabled = useMemo(
    () => scPreferences.preferences[SCPreferences.CONFIGURATIONS_EVENTS_PRIVATE_ENABLED].value,
    [scPreferences.preferences]
  );
  const visibilityEnabled = useMemo(
    () => scPreferences.preferences[SCPreferences.CONFIGURATIONS_EVENTS_VISIBILITY_ENABLED].value,
    [scPreferences.preferences]
  );
  const disablePastStartTime = useMemo(() => field.startDate.getDate() === getNewDate().getDate(), [field]);
  const disablePastEndTime = useMemo(() => field.endDate.getDate() === getNewDate().getDate(), [field]);

  const _backgroundCover = {
    ...(field.imageOriginal
      ? {background: `url('${field.imageOriginal}') center / cover`}
      : {background: `url('${CoverPlaceholder}') no-repeat 0 0 / 100% 100%`})
  };

  const handleChangeCover = useCallback(
    (cover: Blob) => {
      setField((prev) => ({...prev, ['imageOriginalFile']: cover}));
      const reader = new FileReader();

      reader.onloadend = () => {
        setField((prev) => ({...prev, ['imageOriginal']: reader.result}));
      };
      reader.readAsDataURL(cover);

      if (error.imageOriginalError) {
        delete error.imageOriginalError;

        setError(error);
      }
      setGenericError(null);
    },
    [error]
  );

  /**
   * Notify when a group info changed
   * @param data
   */
  const notifyChanges = useCallback(
    (data: SCEventType) => {
      if (event) {
        // Edit group
        PubSub.publish(`${SCTopicType.EVENT}.${SCGroupEventType.EDIT}`, data);
      } else {
        // Create group
        PubSub.publish(`${SCTopicType.EVENT}.${SCGroupEventType.CREATE}`, data);
      }
    },
    [event]
  );

  const handleGeoData = useCallback((data: Geolocation) => {
    setField((prev) => ({
      ...prev,
      ...data
    }));
    setGenericError(null);
  }, []);

  const handleLiveStreamSettingsData = useCallback((data: Geolocation) => {
    setField((prev) => ({
      ...prev,
      liveStreamSettings: {...prev.liveStreamSettings, ...data}
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    setField((prev) => ({...prev, ['isSubmitting']: true}));
    setGenericError(null);

    const formData = new FormData();

    if (field.imageOriginalFile) {
      formData.append('image_original', field.imageOriginalFile);
    }

    formData.append('name', field.name);
    formData.append('start_date', combineDateAndTime(field.startDate, field.startTime));
    formData.append('recurring', field.recurring);
    formData.append('end_date', combineDateAndTime(field.endDate, field.endTime));
    formData.append('location', field.location === SCEventLocationType.PERSON ? SCEventLocationType.PERSON : SCEventLocationType.ONLINE);

    if (field.location === SCEventLocationType.ONLINE) {
      formData.append('link', field.link);
      formData.append('live_stream_settings', null);
    } else if (field.location === SCEventLocationType.LIVESTREAM) {
      formData.append('link', '');
      formData.append('live_stream_settings', JSON.stringify({...LIVESTREAM_DEFAULT_SETTINGS, ...field.liveStreamSettings}));
    } else if (field.location === SCEventLocationType.PERSON) {
      formData.append('geolocation', field.geolocation);
      formData.append('geolocation_lat', field.lat.toString());
      formData.append('geolocation_lng', field.lng.toString());
      formData.append('link', '');
      formData.append('live_stream_settings', null);
    }

    if (privateEnabled) {
      formData.append('privacy', field.isPublic ? SCEventPrivacyType.PUBLIC : SCEventPrivacyType.PRIVATE);
    }

    if (visibilityEnabled) {
      formData.append('visible', 'true');
    }

    formData.append('description', field.description);

    let eventService: Promise<SCEventType>;
    if (event) {
      eventService = EventService.updateEvent(event.id, formData as unknown as SCEventType, {headers: {'Content-Type': 'multipart/form-data'}});
    } else {
      eventService = EventService.createEvent(formData, {headers: {'Content-Type': 'multipart/form-data'}});
    }

    eventService
      .then((data) => {
        notifyChanges(data);
        setField((prev) => ({...prev, ['isSubmitting']: false}));
        onSuccess?.(data);
      })
      .catch((e) => {
        const _error = formatHttpErrorCode(e);
        if (!Object.keys(_error).length) {
          setGenericError(
            intl.formatMessage({
              id: 'ui.eventForm.genericError',
              defaultMessage: 'ui.eventForm.genericError'
            })
          );
        } else if ('codeError' in _error) {
          setGenericError(
            intl.formatMessage({
              id: 'ui.eventForm.liveStream.error.monthlyMinuteLimitReached',
              defaultMessage: 'ui.eventForm.liveStream.error.monthlyMinuteLimitReached'
            })
          );
        } else {
          setGenericError(null);
        }

        let __errors = {};
        if ('coverError' in _error) {
          __errors = {
            ...__errors,
            ['coverError']: <FormattedMessage id="ui.ui.eventForm.cover.error" defaultMessage="ui.ui.eventForm.cover.error" />
          };
        }
        if ('nameError' in _error || ('nonFieldErrorsError' in _error && _error['nonFieldErrorsError'].error === 'unique')) {
          __errors = {
            ...__errors,
            ['nameError']: <FormattedMessage id="ui.eventForm.name.error.unique" defaultMessage="ui.eventForm.name.error.unique" />
          };
        }
        setError(__errors);
        setField((prev) => ({...prev, ['isSubmitting']: false}));
        Logger.error(SCOPE_SC_UI, e);
        onError?.(e);
      });
  }, [field, privateEnabled, visibilityEnabled, onSuccess, onError, notifyChanges]);

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
    [error, setField, setGenericError]
  );

  const handleChangeDateTime = useCallback(
    (value: FieldStateValues, name: FieldStateKeys) => {
      setField((prev) => ({...prev, [name]: value}));

      if (error[`${name}Error`]) {
        delete error[`${name}Error`];
        setError(error);
      } else if (error['endDateError']) {
        delete error['endDateError'];
        setError(error);
      }
      setGenericError(null);
    },
    [error, setField, setGenericError]
  );

  const shouldDisableDate = useCallback(
    (date: Date) => {
      let disabled = false;

      switch (field.recurring) {
        case SCEventRecurrenceType.DAILY:
          disabled = date.getTime() > getLaterDaysDate(DAILY_LATER_DAYS, field.startDate).getTime();
          break;
        case SCEventRecurrenceType.WEEKLY:
          disabled = date.getTime() > getLaterDaysDate(WEEKLY_LATER_DAYS, field.startDate).getTime();
          break;
        case SCEventRecurrenceType.MONTHLY:
          disabled = date.getTime() > getLaterDaysDate(MONTHLY_LATER_DAYS, field.startDate).getTime();
          break;
        case SCEventRecurrenceType.NEVER:
        default:
          disabled = date.getTime() > getLaterDaysDate(NEVER_LATER_DAYS, field.startDate).getTime();
      }

      return disabled;
    },
    [field]
  );

  const shouldDisableTime = useCallback((date: Date) => field.startTime.getTime() > date.getTime(), [field]);

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Paper style={_backgroundCover} classes={{root: classes.cover}}>
        <UploadEventCover isCreationMode={true} onChange={handleChangeCover} />
      </Paper>
      {Boolean(error['coverError']) && <Typography color="error">{error['coverError']}</Typography>}
      <FormGroup className={classes.form}>
        <TextField
          required
          className={classes.name}
          placeholder={`${intl.formatMessage(messages.name)}`}
          margin="normal"
          value={field.name}
          name="name"
          onChange={handleChange}
          InputProps={{
            endAdornment: <Typography variant="body2">{EVENT_TITLE_MAX_LENGTH - field.name.length}</Typography>
          }}
          error={Boolean(field.name.length > EVENT_TITLE_MAX_LENGTH) || Boolean(error['nameError'])}
          helperText={
            field.name.length > EVENT_TITLE_MAX_LENGTH ? (
              <FormattedMessage id="ui.eventForm.name.error.maxLength" defaultMessage="ui.eventForm.name.error.maxLength" />
            ) : error['nameError'] ? (
              error['nameError']
            ) : null
          }
        />
        <Box className={classes.dateTime}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={scContext.settings.locale.default === 'it' ? itLocale : enLocale}
            localeText={{
              cancelButtonLabel: `${intl.formatMessage(messages.pickerCancelAction)}`
            }}>
            <MobileDatePicker
              className={classes.picker}
              disablePast
              label={field.startDate && <FormattedMessage id="ui.eventForm.date.placeholder" defaultMessage="ui.eventForm.date.placeholder" />}
              value={field.startDate}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      placeholder: `${intl.formatMessage(messages.startDate)}`,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton>
                            <Icon>CalendarIcon</Icon>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )
              }}
              slotProps={{
                toolbar: {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  toolbarTitle: <FormattedMessage id="ui.eventForm.date.title" defaultMessage="ui.eventForm.date.title" />
                }
              }}
              onChange={(value) => handleChangeDateTime(value, 'startDate')}
            />
            <MobileTimePicker
              className={classes.picker}
              disablePast={disablePastStartTime}
              label={field.startTime && <FormattedMessage id="ui.eventForm.time.placeholder" defaultMessage="ui.eventForm.time.placeholder" />}
              value={field.startTime}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      placeholder: `${intl.formatMessage(messages.startTime)}`,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton>
                            <Icon>access_time</Icon>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )
              }}
              slotProps={{
                toolbar: {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  toolbarTitle: <FormattedMessage id="ui.eventForm.time.title" defaultMessage="ui.eventForm.time.title" />
                }
              }}
              onChange={(value) => handleChangeDateTime(value, 'startTime')}
            />
          </LocalizationProvider>
        </Box>
        <FormControl className={classes.frequency}>
          {field.recurring !== SCEventRecurrenceType.NEVER && <InputLabel id="recurring">{`${intl.formatMessage(messages.frequency)}`}</InputLabel>}
          <Select
            name="recurring"
            label={field.recurring !== SCEventRecurrenceType.NEVER && `${intl.formatMessage(messages.frequency)}`}
            labelId="recurring"
            value={field.recurring}
            onChange={handleChange}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <em>{`${intl.formatMessage(messages.frequencyPlaceholder)}`}</em>;
              }

              return (
                <FormattedMessage
                  id={`ui.eventForm.frequency.${selected}.placeholder`}
                  defaultMessage={`ui.eventForm.frequency.${selected}.placeholder`}
                />
              );
            }}
            startAdornment={
              <InputAdornment position="start">
                <IconButton>
                  <Icon>frequency</Icon>
                </IconButton>
              </InputAdornment>
            }>
            {Object.values(SCEventRecurrenceType).map((f) => (
              <MenuItem value={f} key={f}>
                <FormattedMessage id={`ui.eventForm.frequency.${f}.placeholder`} defaultMessage={`ui.eventForm.frequency.${f}.placeholder`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box className={classes.dateTime}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={scContext.settings.locale.default === 'it' ? itLocale : enLocale}
            localeText={{
              cancelButtonLabel: `${intl.formatMessage(messages.pickerCancelAction)}`
            }}>
            <MobileDatePicker
              className={classes.picker}
              minDate={field.startDate}
              label={<FormattedMessage id="ui.eventForm.date.end.placeholder" defaultMessage="ui.eventForm.date.end.placeholder" />}
              value={field.endDate}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      placeholder: `${intl.formatMessage(messages.endDate)}`,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton>
                            <Icon>calendar_off</Icon>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )
              }}
              slotProps={{
                toolbar: {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  toolbarTitle: <FormattedMessage id="ui.eventForm.date.title" defaultMessage="ui.eventForm.date.title" />
                }
              }}
              onChange={(value) => handleChangeDateTime(value, 'endDate')}
              shouldDisableDate={shouldDisableDate}
            />
            <MobileTimePicker
              className={classes.picker}
              disablePast={disablePastEndTime}
              label={field.endTime && <FormattedMessage id="ui.eventForm.time.end.placeholder" defaultMessage="ui.eventForm.time.end.placeholder" />}
              value={field.endTime}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      placeholder: `${intl.formatMessage(messages.endTime)}`,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton>
                            <Icon>access_time</Icon>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(error['endDateError'])}
                    helperText={
                      error['endDateError']?.error ? (
                        <FormattedMessage id="ui.eventForm.time.end.error.invalid" defaultMessage="ui.eventForm.time.end.error.invalid" />
                      ) : null
                    }
                  />
                )
              }}
              slotProps={{
                toolbar: {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  toolbarTitle: <FormattedMessage id="ui.eventForm.time.title" defaultMessage="ui.eventForm.time.title" />
                }
              }}
              onChange={(value) => handleChangeDateTime(value, 'endTime')}
              shouldDisableTime={shouldDisableTime}
            />
          </LocalizationProvider>
        </Box>
        <EventAddress
          forwardGeolocationData={handleGeoData}
          forwardLivestreamSettingsData={handleLiveStreamSettingsData}
          event={
            {
              ...event,
              ...{
                name: field.name,
                start_date: field.startDate,
                location: field.location,
                geolocation: field.geolocation,
                live_stream: {
                  title: field.name || `${intl.formatMessage(messages.name)}`,
                  ...(event && event.live_stream?.created_at && {created_at: field.startDate}),
                  settings: field.liveStreamSettings
                }
              }
            } as unknown as SCEventType
          }
          {...EventAddressComponentProps}
        />
        {privateEnabled && (
          <Box className={classes.privacySection}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <Typography className={classNames(classes.switchLabel, {[classes.active]: !field.isPublic})}>
                <Icon>private</Icon>
                <FormattedMessage id="ui.eventForm.privacy.private" defaultMessage="ui.eventForm.privacy.private" />
              </Typography>
              <Switch
                className={classes.switch}
                checked={field.isPublic}
                onChange={() => setField((prev) => ({...prev, ['isPublic']: !field.isPublic}))}
                disabled={event && !field.isPublic}
              />
              <Typography className={classNames(classes.switchLabel, {[classes.active]: field.isPublic})}>
                <Icon>public</Icon>
                <FormattedMessage id="ui.eventForm.privacy.public" defaultMessage="ui.eventForm.privacy.public" />
              </Typography>
            </Stack>
            <Typography variant="body2" textAlign="center" className={classes.privacySectionInfo}>
              {field.isPublic ? (
                <FormattedMessage
                  id="ui.eventForm.privacy.public.info"
                  defaultMessage="ui.eventForm.privacy.public.info"
                  values={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
                    // @ts-ignores
                    b: (chunks) => <strong>{chunks}</strong>
                  }}
                />
              ) : (
                <FormattedMessage
                  id="ui.eventForm.privacy.private.info"
                  defaultMessage="ui.eventForm.private.public.info"
                  values={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    b: (chunks) => <strong>{chunks}</strong>
                  }}
                />
              )}
            </Typography>
          </Box>
        )}
        <TextField
          multiline
          className={classes.description}
          placeholder={`${intl.formatMessage(messages.description)}`}
          margin="normal"
          value={field.description}
          name="description"
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <Typography variant="body2">
                {field.description?.length ? EVENT_DESCRIPTION_MAX_LENGTH - field.description.length : EVENT_DESCRIPTION_MAX_LENGTH}
              </Typography>
            )
          }}
          error={Boolean(field.description?.length > EVENT_DESCRIPTION_MAX_LENGTH)}
          helperText={
            field.description?.length > EVENT_DESCRIPTION_MAX_LENGTH ? (
              <FormattedMessage id="ui.eventForm.description.error.maxLength" defaultMessage="ui.eventForm.description.error.maxLength" />
            ) : null
          }
        />
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
              !field.name ||
              !field.startDate ||
              !field.startTime ||
              !field.endDate ||
              !field.endTime ||
              Boolean(genericError) ||
              (field.location === SCEventLocationType.ONLINE && !field.link) ||
              (field.location === SCEventLocationType.PERSON && !field.geolocation) ||
              (field.recurring !== SCEventRecurrenceType.NEVER && !field.endDate && !field.endTime) ||
              field.isSubmitting ||
              field.name.length > EVENT_TITLE_MAX_LENGTH ||
              field.description.length > EVENT_DESCRIPTION_MAX_LENGTH ||
              (field.location === SCEventLocationType.LIVESTREAM && !liveStreamEnabled)
            }
            variant="contained"
            onClick={handleSubmit}
            color="secondary">
            {event ? (
              <FormattedMessage id="ui.eventForm.button.edit" defaultMessage="ui.eventForm.button.edit" />
            ) : (
              <FormattedMessage id="ui.eventForm.button.create" defaultMessage="ui.eventForm.button.create" />
            )}
          </LoadingButton>
        </Box>
      </FormGroup>
    </Root>
  );
}
