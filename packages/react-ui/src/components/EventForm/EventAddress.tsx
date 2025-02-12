import {Autocomplete, Box, InputAdornment, Tab, Tabs, TextField} from '@mui/material';
import Icon from '@mui/material/Icon';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCPreferences, SCPreferencesContextType, SCUserContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {SCCommunitySubscriptionTier, SCEventLocationType, SCEventType, SCFeatureName, SCLiveStreamType} from '@selfcommunity/types';
import axios from 'axios';
import classNames from 'classnames';
import {ChangeEvent, SyntheticEvent, useEffect, useMemo, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import UrlTextField from '../../shared/UrlTextField';
import {PREFIX} from './constants';
import {Geolocation, Place} from './types';
import LiveStream from '../LiveStream';
import LiveStreamFormSettings from '../LiveStreamForm/LiveStreamFormSettings';
import {SCLiveStreamTemplateType} from '../../types/liveStream';
import {LIVESTREAM_DEFAULT_SETTINGS} from '../LiveStreamForm/constants';
import {getNewDate} from './utils';
import {useSCGoogleApiLoader} from '@selfcommunity/react-core';

const messages = defineMessages({
  virtualPlaceholder: {
    id: 'ui.eventForm.address.online.placeholder',
    defaultMessage: 'ui.eventForm.address.online.placeholder'
  },
  name: {
    id: 'ui.eventForm.name.placeholder',
    defaultMessage: 'ui.eventForm.name.placeholder'
  }
});

const classes = {
  root: `${PREFIX}-event-address-root`,
  tabs: `${PREFIX}-event-address-tabs`,
  tab: `${PREFIX}-event-address-tab`,
  tabContent: `${PREFIX}-event-address-tab-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'EventAddressRoot'
})(() => ({}));

export interface EventAddressProps {
  locations?: SCEventLocationType[];
  event?: SCEventType | Partial<SCEventType>;
  forwardGeolocationData: (data: Geolocation) => void;
  forwardLivestreamSettingsData: (settings) => void;
  className?: string;
}

export default function EventAddress(inProps: EventAddressProps): JSX.Element {
  //PROPS
  const props: EventAddressProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // INTL
  const intl = useIntl();
  // PROPS
  const {
    className,
    locations = [SCEventLocationType.PERSON, SCEventLocationType.ONLINE, SCEventLocationType.LIVESTREAM],
    event,
    forwardGeolocationData,
    forwardLivestreamSettingsData
  } = props;

  // STATE
  const [location, setLocation] = useState<SCEventLocationType>(event?.location || locations[0]);
  const [geolocation, setGeoLocation] = useState<Place | null>(event ? {description: event.geolocation} : null);
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const liveStream: SCLiveStreamType = useMemo(() => {
    return (
      event.live_stream ||
      ({
        title: event?.name || `${intl.formatMessage(messages.name)}`,
        created_at: event?.start_date || getNewDate(),
        settings: LIVESTREAM_DEFAULT_SETTINGS
      } as SCLiveStreamType)
    );
  }, [event]);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();
  const isFreeTrialTier = useMemo(
    () =>
      preferences &&
      SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value === SCCommunitySubscriptionTier.FREE_TRIAL,
    [preferences]
  );
  const liveStreamEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.LIVE_STREAM) &&
      SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED].value,
    [preferences, features]
  );
  const isInPersonTabActive = useMemo(
    () => locations.includes(SCEventLocationType.PERSON) || event.location === SCEventLocationType.PERSON,
    [locations, event]
  );
  const isOnlineTabActive = useMemo(
    () => locations.includes(SCEventLocationType.ONLINE) || event.location === SCEventLocationType.ONLINE,
    [locations, event]
  );
  const isLiveTabActive = useMemo(
    () =>
      (liveStreamEnabled &&
        locations.includes(SCEventLocationType.LIVESTREAM) &&
        !isFreeTrialTier /* || (isFreeTrialTier && scUserContext?.user && scUserContext?.user.id === 1)*/ &&
        scUserContext?.user?.permission?.create_live_stream) ||
      (event.live_stream && event.live_stream.created_at),
    [liveStreamEnabled, scUserContext?.user?.permission, event]
  );

  // HOOKS
  const {isLoaded, geocodingApiKey} = useSCGoogleApiLoader();

  // HANDLERS
  const handleChange = (_event: SyntheticEvent, newValue: SCEventLocationType) => {
    setLocation(newValue);
    forwardGeolocationData({location: newValue});
  };

  const handleSelection = async (_event: SyntheticEvent, newValue: Place) => {
    if (newValue) {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            place_id: newValue.id,
            key: geocodingApiKey
          }
        });

        const place = response.data.results[0];
        setGeoLocation(newValue);
        forwardGeolocationData({
          location,
          geolocation: newValue.description.split(',')[0] + '. ' + place.formatted_address,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        });
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    }
  };

  const handleLocationChange = (_event: SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  const handleLinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    forwardGeolocationData({location, link: event.target.value});
  };

  const handleLiveStreamSettingsChange = (settings) => {
    forwardLivestreamSettingsData(settings);
  };

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (inputValue === '') {
      setSuggestions([]);
      return;
    }

    if (inputValue.length >= 3) {
      const newTimeoutId = setTimeout(() => {
        const autocompleteService = new window.google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions({input: inputValue}, (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(
              predictions.map((prediction) => ({
                description: prediction.description,
                id: prediction.place_id
              }))
            );
          }
        });
      }, 300);

      setTimeoutId(newTimeoutId);
    }
  }, [inputValue]);

  if (!geocodingApiKey && !isLoaded) {
    return null;
  }
  if (!isInPersonTabActive && !isOnlineTabActive && !isLiveTabActive) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)}>
      <Tabs className={classes.tabs} value={location} onChange={handleChange} indicatorColor="secondary" textColor="secondary" variant="fullWidth">
        {isInPersonTabActive && (
          <Tab
            value={SCEventLocationType.PERSON}
            classes={{root: classes.tab}}
            icon={<Icon>add_location_alt</Icon>}
            iconPosition="start"
            label={<FormattedMessage id="ui.eventForm.address.live.label" defaultMessage="ui.eventForm.address.live.label" />}
          />
        )}
        {isOnlineTabActive && (
          <Tab
            value={SCEventLocationType.ONLINE}
            classes={{root: classes.tab}}
            icon={<Icon>play_circle_outline</Icon>}
            iconPosition="start"
            label={<FormattedMessage id="ui.eventForm.address.online.label" defaultMessage="ui.eventForm.address.online.label" />}
          />
        )}
        {isLiveTabActive && (
          <Tab
            value={SCEventLocationType.LIVESTREAM}
            classes={{root: classes.tab}}
            icon={<Icon>photo_camera</Icon>}
            iconPosition="start"
            label={<FormattedMessage id="ui.eventForm.address.liveStream.label" defaultMessage="ui.eventForm.address.liveStream.label" />}
          />
        )}
      </Tabs>
      <Box className={classes.tabContent}>
        {isInPersonTabActive && location === SCEventLocationType.PERSON && (
          <Autocomplete
            disabled={!geocodingApiKey}
            size="small"
            value={geolocation}
            onChange={handleSelection}
            inputValue={inputValue}
            onInputChange={handleLocationChange}
            options={suggestions}
            getOptionLabel={(option) => option.description || geolocation.description}
            noOptionsText={<FormattedMessage id="ui.eventForm.address.live.noResults" defaultMessage="ui.eventForm.address.live.noResults" />}
            isOptionEqualToValue={(option: Place, value: Place) => option.description === value.description}
            renderInput={(params) => (
              <TextField
                {...params}
                label={<FormattedMessage id="ui.eventForm.address.live.placeholder" defaultMessage="ui.eventForm.address.live.placeholder" />}
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Icon>add_location_alt</Icon>
                      </InputAdornment>
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />
        )}
        {isOnlineTabActive && location === SCEventLocationType.ONLINE && (
          <UrlTextField
            size="small"
            fullWidth
            type="url"
            placeholder={`${intl.formatMessage(messages.virtualPlaceholder)}`}
            helperText={<FormattedMessage id="ui.eventForm.address.online.help" defaultMessage="ui.eventForm.address.online.help" />}
            InputProps={{
              endAdornment: <Icon>play_circle_outline</Icon>
            }}
            onChange={handleLinkChange}
          />
        )}
        {isLiveTabActive && location === SCEventLocationType.LIVESTREAM && (
          <>
            <LiveStream template={SCLiveStreamTemplateType.SNIPPET} liveStream={liveStream} actions={<></>} />
            <LiveStreamFormSettings settings={liveStream.settings || LIVESTREAM_DEFAULT_SETTINGS} onChange={handleLiveStreamSettingsChange} />
          </>
        )}
      </Box>
    </Root>
  );
}
