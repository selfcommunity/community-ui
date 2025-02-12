import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography, Button, Paper, Container, Radio, Theme, Alert} from '@mui/material';
import Icon from '@mui/material/Icon';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {LiveStreamType} from '../types';
import {useSnackbar} from 'notistack';
import {FormattedMessage, useIntl} from 'react-intl';
import EventImage from '../../../assets/liveStream/event';
import LiveImage from '../../../assets/liveStream/live';
import {LiveStreamApiClient} from '@selfcommunity/api-services';
import {WARNING_THRESHOLD_EXPIRING_SOON} from '../../LiveStreamRoom/constants';
import {Link, SCContextType, SCPreferences, SCPreferencesContextType, useSCContext, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {SCCommunitySubscriptionTier} from '@selfcommunity/types';
import {SELFCOMMUNITY_PRICING} from '../../PlatformWidget/constants';

export const PREFIX = 'SCLiveStreamSelector';

const classes = {
  root: `${PREFIX}-root`,
  warning: `${PREFIX}-warning`,
  options: `${PREFIX}-options`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Container, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({}));

// Styled components
const OptionCard = styled(Paper, {
  name: PREFIX,
  slot: 'optionCardRoot',
  shouldForwardProp: (prop) => prop !== 'selected'
})<{theme?: Theme; selected: boolean}>(({theme, selected}) => ({
  '& h6': {
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
}));

const FeatureItem = styled(Box, {
  name: PREFIX,
  slot: 'featureItemRoot'
})(({theme}) => ({}));

export interface LiveStreamSelectorProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Option selected
   */
  liveSelected?: LiveStreamType;
  /**
   * Callback on selected option
   * @param LiveStreamType
   */
  onLiveSelected?: (live: LiveStreamType) => void;
  /**
   * On success callback function
   * @default null
   */
  onNext?: (live: LiveStreamType) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS LiveStreamSelector component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {LiveStreamSelector} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCLiveStreamSelector` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCreateLivestreamDialog-root|Styles applied to the root element.|

 * @param inProps
 */
export default function LiveStreamSelector(inProps: LiveStreamSelectorProps): JSX.Element {
  //PROPS
  const props: LiveStreamSelectorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, liveSelected, onLiveSelected, onNext} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext = useSCUser();
  const {enqueueSnackbar} = useSnackbar();

  // STATE
  const [selectedOption, setSelectedOption] = useState<LiveStreamType | null>(liveSelected);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // HOOKS
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

  const options = [
    {
      title: intl.formatMessage({id: 'ui.liveStreamForm.selector.scheduleLiveEvent', defaultMessage: 'ui.liveStreamForm.selector.scheduleLiveEvent'}),
      image: EventImage,
      type: LiveStreamType.EVENT_LIVE,
      features: [
        intl.formatMessage({
          id: 'ui.liveStreamForm.selector.scheduleLiveEventItem1',
          defaultMessage: 'ui.liveStreamForm.selector.scheduleLiveEventItem1'
        }),
        intl.formatMessage({
          id: 'ui.liveStreamForm.selector.scheduleLiveEventItem2',
          defaultMessage: 'ui.liveStreamForm.selector.scheduleLiveEventItem2'
        }),
        intl.formatMessage({
          id: 'ui.liveStreamForm.selector.scheduleLiveEventItem3',
          defaultMessage: 'ui.liveStreamForm.selector.scheduleLiveEventItem3'
        })
      ]
    },
    {
      title: intl.formatMessage({
        id: 'ui.liveStreamForm.selector.scheduleLiveStream',
        defaultMessage: 'ui.liveStreamForm.selector.scheduleLiveStream'
      }),
      image: LiveImage,
      type: LiveStreamType.DIRECT_LIVE,
      features: [
        intl.formatMessage({
          id: 'ui.liveStreamForm.selector.scheduleLiveStreamItem1',
          defaultMessage: 'ui.liveStreamForm.selector.scheduleLiveStreamItem1'
        }),
        intl.formatMessage({
          id: 'ui.liveStreamForm.selector.scheduleLiveStreamItem2',
          defaultMessage: 'ui.liveStreamForm.selector.scheduleLiveStreamItem2'
        }),
        intl.formatMessage({
          id: 'ui.liveStreamForm.selector.scheduleLiveStreamItem3',
          defaultMessage: 'ui.liveStreamForm.selector.scheduleLiveStreamItem3'
        })
      ]
    }
  ];

  const handleOptionSelect = (type) => {
    setSelectedOption(type);
    onLiveSelected(type);
  };

  const handleNext = () => {
    if (!selectedOption) {
      enqueueSnackbar(<FormattedMessage id="ui.common.error" defaultMessage="ui.common.error" />, {
        variant: 'error',
        autoHideDuration: 3000
      });
    } else {
      onNext && onNext(selectedOption);
    }
  };

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
  }, [timeRemaining, isFreeTrialTier]);

  return (
    <Root className={classNames(classes.root, className)} maxWidth="lg" sx={{py: 4}}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{mb: 4, fontWeight: 500}}>
        <FormattedMessage id="ui.liveStreamForm.selector.title" defaultMessage="ui.liveStreamForm.selector.title" />
      </Typography>
      {warning}
      <Box className={classes.options}>
        {options.map((option, index) => (
          <OptionCard
            key={index}
            selected={selectedOption === option.type}
            onClick={() => handleOptionSelect(option.type)}
            elevation={0}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleOptionSelect(index);
                e.preventDefault();
              }
            }}>
            <Box>
              <Typography variant="h6">{option.title}</Typography>
              <Radio checked={selectedOption === option.type} />
            </Box>
            <img src={option.image} alt="option-image" />
            <Box component="ul">
              {option.features.map((feature, featureIndex) => {
                return (
                  <FeatureItem component="li" key={featureIndex}>
                    <Typography variant="body2" color="text.secondary" sx={{flex: 1}}>
                      {feature}
                    </Typography>
                  </FeatureItem>
                );
              })}
            </Box>
          </OptionCard>
        ))}
      </Box>
      <Box className={classes.actions}>
        <Button disabled={!selectedOption || !timeRemaining || isFreeTrialTier} variant="contained" onClick={handleNext} color="secondary">
          <FormattedMessage id="ui.liveStreamForm.selector.next" defaultMessage="ui.liveStreamForm.selector.next" />
        </Button>
      </Box>
    </Root>
  );
}
