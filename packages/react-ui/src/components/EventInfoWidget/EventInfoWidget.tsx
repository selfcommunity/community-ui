import {Box, Button, CardContent, Icon, Stack, styled, Typography, useThemeProps} from '@mui/material';
import {useSCFetchEvent} from '@selfcommunity/react-core';
import {SCEventPrivacyType, SCEventSubscriptionStatusType, SCEventType} from '@selfcommunity/types';
import PubSub from 'pubsub-js';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import EventInfoDetails from '../../shared/EventInfoDetails';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import Skeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  titleWrapper: `${PREFIX}-title-wrapper`,
  textWrapper: `${PREFIX}-text-wrapper`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface EventInfoWidgetProps extends WidgetProps {
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * Id of event object
   * @default null
   */
  eventId?: number;

  /**
   * True if summary must be already expanded
   * @default false
   */
  summaryExpanded?: boolean;
  /**
   * Other props
   */
  [p: string]: any;
}

function isTextLongerThanLimit(text: string, limit = 125) {
  return text.length > limit;
}

function getTruncatedText(text?: string, limit = 125) {
  if (!text) {
    return '';
  }

  return isTextLongerThanLimit(text, limit) ? text.substring(0, limit).concat('...') : text;
}

export default function EventInfoWidget(inProps: EventInfoWidgetProps) {
  // PROPS
  const props: EventInfoWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {event, eventId, summaryExpanded = false, ...rest} = props;

  // STATE
  const [expanded, setExpanded] = useState(summaryExpanded);
  const [showButton, setShowButton] = useState(!summaryExpanded);
  const [loading, setLoading] = useState(true);

  // HOOKS
  const {scEvent, setSCEvent} = useSCFetchEvent({id: eventId, event});

  // REFS
  const updatesSubscription = useRef(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!scEvent) {
      return;
    }

    const _showButton = isTextLongerThanLimit(scEvent.description, 220);

    if (_showButton !== !summaryExpanded) {
      setShowButton(_showButton);
    }
  }, [scEvent]);

  /**
   * Handle toggle summary
   */
  const handleToggleSummary = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const hasGeolocationOrLink = useMemo(() => Boolean(scEvent?.geolocation || scEvent?.link || scEvent?.live_stream), [scEvent]);

  const showInfo = useMemo(
    () =>
      (scEvent?.privacy === SCEventPrivacyType.PUBLIC && hasGeolocationOrLink) ||
      ([SCEventSubscriptionStatusType.SUBSCRIBED, SCEventSubscriptionStatusType.GOING, SCEventSubscriptionStatusType.NOT_GOING].indexOf(
        scEvent?.subscription_status
      ) > -1 &&
        hasGeolocationOrLink),
    [scEvent]
  );

  const description = useMemo(() => (expanded ? scEvent?.description : getTruncatedText(scEvent?.description, 220)), [expanded, scEvent]);

  /**
   * Subscriber for pubsub callback
   */
  const onChangeGroupHandler = useCallback(
    (_msg: string, data: SCEventType) => {
      if (data && scEvent.id === data.id) {
        setSCEvent(data);
      }
    },
    [scEvent, setSCEvent]
  );

  /**
   * On mount, subscribe to receive groups updates (only edit)
   */
  useEffect(() => {
    if (scEvent) {
      updatesSubscription.current = PubSub.subscribe(`${SCTopicType.EVENT}.${SCGroupEventType.EDIT}`, onChangeGroupHandler);
    }
    return () => {
      updatesSubscription.current && PubSub.unsubscribe(updatesSubscription.current);
    };
  }, [scEvent]);

  // RENDER
  if (!scEvent && loading) {
    return <Skeleton />;
  }

  if (!scEvent) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classes.root} {...rest}>
      <CardContent className={classes.content}>
        <Stack className={classes.titleWrapper}>
          <Icon fontSize="small">info</Icon>
          <Typography variant="h5">
            <FormattedMessage id="ui.infoEventWidget.title" defaultMessage="ui.infoEventWidget.title" />
          </Typography>
        </Stack>
        <Box className={classes.textWrapper}>
          <Typography component="span" variant="body1">
            {description}
            {showButton && !expanded && (
              <Button size="small" variant="text" className={classes.showMore} onClick={handleToggleSummary}>
                <FormattedMessage id="ui.infoEventWidget.showMore" defaultMessage="ui.infoEventWidget.showMore" />
              </Button>
            )}
          </Typography>
        </Box>
        <EventInfoDetails event={scEvent} hasRecurringInfo hasCreatedInfo hasLocationInfo={showInfo} />
      </CardContent>
    </Root>
  );
}
