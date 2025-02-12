import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  GridProps,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  useThemeProps
} from '@mui/material';
import {Endpoints, EndpointType, http, HttpResponse} from '@selfcommunity/api-services';
import {
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContext,
  SCUserContextType,
  UserUtils
} from '@selfcommunity/react-core';
import {SCEventDateFilterType, SCEventLocationFilterType, SCEventSubscriptionStatusType, SCEventType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import CreateEventButton, {CreateEventButtonProps} from '../CreateEventButton';
import Event, {EventProps, EventSkeleton, EventSkeletonProps} from '../Event';
import Skeleton, {EventsSkeletonProps} from '../Events/Skeleton';
import {PREFIX} from './constants';
import LocationEventsFilter from './LocationEventsFilter';
import PastEventsFilter from './PastEventsFilter';

const classes = {
  root: `${PREFIX}-root`,
  filters: `${PREFIX}-filters`,
  events: `${PREFIX}-events`,
  item: `${PREFIX}-item`,
  itemSkeleton: `${PREFIX}-item-skeleton`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`,
  search: `${PREFIX}-search`
};

const options = [
  {value: SCEventDateFilterType.ANY, label: <FormattedMessage id="ui.events.select.any" defaultMessage="ui.events.select.any" />},
  {value: SCEventDateFilterType.TODAY, label: <FormattedMessage id="ui.events.select.today" defaultMessage="ui.events.select.today" />},
  {value: SCEventDateFilterType.TOMORROW, label: <FormattedMessage id="ui.events.select.tomorrow" defaultMessage="ui.events.select.tomorrow" />},
  {value: SCEventDateFilterType.THIS_WEEK, label: <FormattedMessage id="ui.events.select.thisWeek" defaultMessage="ui.events.select.thisWeek" />},
  {value: SCEventDateFilterType.NEXT_WEEK, label: <FormattedMessage id="ui.events.select.nextWeek" defaultMessage="ui.events.select.nextWeek" />},
  {value: SCEventDateFilterType.THIS_MONTH, label: <FormattedMessage id="ui.events.select.thisMonth" defaultMessage="ui.events.select.thisMonth" />}
];

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export const EventsChipRoot = styled(Chip, {
  name: PREFIX,
  slot: 'EventsChipRoot',
  shouldForwardProp: (prop) => prop !== 'showFollowed' && prop !== 'showPastEvents'
})(() => ({}));

export interface EventsProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Event API Endpoint
   * @default Endpoints.SearchEvents
   */
  endpoint: EndpointType;

  /**
   * Feed API Query Params
   * @default [{'limit': 20, 'offset': 0}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * Props to spread to single event object
   * @default {}
   */
  EventComponentProps?: EventProps;

  /**
   * Props to spread to events skeleton object
   * @default {}
   */
  EventsSkeletonComponentProps?: EventsSkeletonProps;

  /**
   * Props to spread to single event skeleton object
   * @default {}
   */
  EventSkeletonComponentProps?: EventSkeletonProps;

  /**
   * Props spread to grid container
   * @default {}
   */
  GridContainerComponentProps?: Pick<GridProps, Exclude<keyof GridProps, 'container' | 'component' | 'children' | 'item' | 'classes'>>;
  /**
   * Props spread to single grid item
   * @default {}
   */
  GridItemComponentProps?: Pick<GridProps, Exclude<keyof GridProps, 'container' | 'component' | 'children' | 'item' | 'classes'>>;

  /**
   * Props to spread to CreateEvent component
   * @default empty object
   */
  CreateEventButtonProps?: CreateEventButtonProps;

  /**
   * Show/Hide filters
   * @default true
   */
  showFilters?: boolean;

  /**
   * Filters component
   * @param props
   */
  filters?: JSX.Element;

  /** If true, it means that the endpoint fetches all events available
   * @default true
   */
  general?: boolean;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Events component. Learn about the available props and the CSS API.
 *
 *
 * The Events component renders the list of all available events.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Events)

 #### Import
 ```jsx
 import {Events} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCEvents` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEvents-root|Styles applied to the root element.|
 |filters|.SCEvents-filters|Styles applied to the title element.|
 |events|.SCEvents-events|Styles applied to the title element.|
 |item|.SCEvents-item|Styles applied to the title element.|
 |noResults|.SCEvents-no-results|Styles applied to no results section.|
 |showMore|.SCEvents-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function Events(inProps: EventsProps): JSX.Element {
  // PROPS
  const props: EventsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    endpoint = Endpoints.SearchEvents,
    endpointQueryParams = {limit: 8, offset: DEFAULT_PAGINATION_OFFSET},
    className,
    EventComponentProps = {elevation: 0, square: true},
    EventsSkeletonComponentProps = {},
    EventSkeletonComponentProps = {elevation: 0, square: true},
    GridContainerComponentProps = {},
    GridItemComponentProps = {},
    CreateEventButtonProps = {},
    showFilters = false,
    filters,
    general = true,
    ...rest
  } = props;

  // STATE
  const [events, setEvents] = useState<SCEventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(null);
  const [query, setQuery] = useState<string>('');
  const [dateSearch, setDateSearch] = useState(options[0].value);
  const [location, setLocation] = useState<SCEventLocationFilterType>(SCEventLocationFilterType.ANY);
  const [showFollowed, setShowFollowed] = useState<boolean>(false);
  const [showPastEvents, setShowPastEvents] = useState<boolean>(false);
  const [showMyEvents, setShowMyEvents] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const onlyStaffEnabled = useMemo(
    () => scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_EVENTS_ONLY_STAFF_ENABLED].value,
    [scPreferencesContext.preferences]
  );
  // MEMO
  const contentAvailability =
    SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // REFS
  const updatesSubscription = useRef(null);

  // HANDLERS

  const handleChipClick = () => {
    setShowFollowed(!showFollowed);
  };

  const handleDeleteClick = () => {
    setShowFollowed(false);
  };

  const handleChipPastClick = () => {
    setShowPastEvents(!showPastEvents);
  };

  const handleDeletePastClick = () => {
    setShowPastEvents(false);
  };

  /**
   * Fetches events list
   */
  const fetchEvents = () => {
    setLoading(true);
    return http
      .request({
        url: endpoint.url({}),
        method: endpoint.method,
        params: {
          ...endpointQueryParams,
          ...(general
            ? {
                ...(query && {search: query}),
                ...(dateSearch !== SCEventDateFilterType.ANY && {date_filter: dateSearch}),
                ...(location !== SCEventLocationFilterType.ANY && {location}),
                ...(showFollowed && {follows: showFollowed}),
                ...(showPastEvents && {date_filter: SCEventDateFilterType.PAST})
              }
            : {
                subscription_status: SCEventSubscriptionStatusType.GOING,
                ...(location !== SCEventLocationFilterType.ANY && {location}),
                ...(showPastEvents && {past: showPastEvents}),
                ...(showMyEvents && {created_by: authUserId})
              })
        }
      })
      .then((res: HttpResponse<any>) => {
        setEvents(res.data.results);
        setNext(res.data.next);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  };

  /**
   * On mount, fetches events list
   */
  useEffect(() => {
    if (!contentAvailability && !authUserId) {
      return;
    } else {
      fetchEvents();
    }
  }, [contentAvailability, authUserId, dateSearch, location, showFollowed, showPastEvents, showMyEvents]);

  /**
   * Subscriber for pubsub callback
   */
  const onDeleteEventHandler = useCallback(
    (_msg: string, deleted: number) => {
      setEvents((prev) => {
        if (prev.some((e) => e.id === deleted)) {
          return prev.filter((e) => e.id !== deleted);
        }
        return prev;
      });
    },
    [events]
  );

  /**
   * On mount, subscribe to receive event updates (only delete)
   */
  useEffect(() => {
    if (events) {
      updatesSubscription.current = PubSub.subscribe(`${SCTopicType.EVENT}.${SCGroupEventType.DELETE}`, onDeleteEventHandler);
    }
    return () => {
      updatesSubscription.current && PubSub.unsubscribe(updatesSubscription.current);
    };
  }, [events]);

  const handleNext = useMemo(
    () => () => {
      if (!next) {
        return;
      }
      return http
        .request({
          url: next,
          method: general ? Endpoints.SearchEvents.method : Endpoints.GetUserEvents.method
        })
        .then((res: HttpResponse<any>) => {
          setEvents([...events, ...res.data.results]);
          setNext(res.data.next);
        })
        .catch((error) => console.log(error))
        .then(() => setLoading(false));
    },
    [next]
  );

  /**
   * Handle change filter name
   * @param event
   */
  const handleOnChangeFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  /**
   * Handle change time frame
   * @param event
   */
  const handleOnChangeTimeFrame = (event) => {
    setDateSearch(event.target.value);
  };

  /**
   * Handle change location
   * @param event
   */
  const handleOnChangeLocation = (event) => {
    setLocation(event.target.value);
  };

  /**
   * Renders events list
   */
  const c = (
    <>
      {showFilters && (
        <Grid container className={classes.filters} gap={2}>
          {filters ? (
            filters
          ) : !general ? (
            <>
              <Grid item>
                <EventsChipRoot
                  color={showMyEvents ? 'secondary' : 'default'}
                  variant={showMyEvents ? 'filled' : 'outlined'}
                  label={<FormattedMessage id="ui.events.filterByCreatedByMe" defaultMessage="ui.events.filterByCreatedByMe" />}
                  onClick={() => setShowMyEvents(!showMyEvents)}
                  // @ts-expect-error this is needed to use showFollowed into SCEvents
                  showFollowed={showMyEvents}
                  deleteIcon={showMyEvents ? <Icon>close</Icon> : null}
                  onDelete={showMyEvents ? () => setShowMyEvents(false) : null}
                  disabled={loading}
                />
              </Grid>
              <Grid item>
                <PastEventsFilter
                  showPastEvents={showPastEvents}
                  handleClick={handleChipPastClick}
                  handleDeleteClick={handleDeletePastClick}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <LocationEventsFilter value={location} disabled={loading} handleOnChange={handleOnChangeLocation} />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={3}>
                <TextField
                  className={classes.search}
                  size={'small'}
                  fullWidth
                  value={query}
                  label={<FormattedMessage id="ui.events.filterByName" defaultMessage="ui.events.filterByName" />}
                  variant="outlined"
                  onChange={handleOnChangeFilterName}
                  disabled={loading}
                  onKeyUp={(e) => {
                    e.preventDefault();
                    if (e.key === 'Enter') {
                      fetchEvents();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {isMobile ? (
                          <IconButton onClick={() => fetchEvents()} disabled={loading}>
                            <Icon>search</Icon>
                          </IconButton>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={() => fetchEvents()}
                            endIcon={<Icon>search</Icon>}
                            disabled={loading}
                          />
                        )}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>
                    <FormattedMessage id="ui.events.filterByDate" defaultMessage="ui.events.filterByDate" />
                  </InputLabel>
                  <Select
                    disabled={showPastEvents || loading}
                    size={'small'}
                    label={<FormattedMessage id="ui.events.filterByDate" defaultMessage="ui.events.filterByDate" />}
                    value={dateSearch as any}
                    onChange={handleOnChangeTimeFrame}
                    renderValue={(selected) => options.find((option) => option.value === selected).label}>
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Radio
                          checked={dateSearch === option.value}
                          value={option.value}
                          name="radio-button-select"
                          inputProps={{'aria-label': option.label as any}}
                        />
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <LocationEventsFilter value={location} disabled={loading} handleOnChange={handleOnChangeLocation} />
              </Grid>
              {authUserId && (
                <Grid item>
                  <EventsChipRoot
                    color={showFollowed ? 'secondary' : 'default'}
                    variant={showFollowed ? 'filled' : 'outlined'}
                    label={<FormattedMessage id="ui.events.filterByFollowedInterest" defaultMessage="ui.events.filterByFollowedInterest" />}
                    onClick={handleChipClick}
                    // @ts-expect-error this is needed to use showFollowed into SCEvents
                    showFollowed={showFollowed}
                    deleteIcon={showFollowed ? <Icon>close</Icon> : null}
                    onDelete={showFollowed ? handleDeleteClick : null}
                    disabled={loading}
                  />
                </Grid>
              )}
              <Grid item>
                <PastEventsFilter
                  showPastEvents={showPastEvents}
                  handleClick={handleChipPastClick}
                  handleDeleteClick={handleDeletePastClick}
                  disabled={dateSearch !== SCEventDateFilterType.ANY || loading}
                />
              </Grid>
            </>
          )}
        </Grid>
      )}
      <>
        {loading ? (
          <Skeleton {...EventsSkeletonComponentProps} EventSkeletonProps={EventSkeletonComponentProps} />
        ) : (
          <>
            {!events.length ? (
              <Box className={classes.noResults}>
                {general ? (
                  <>
                    <EventSkeleton
                      {...EventSkeletonComponentProps}
                      skeletonsAnimation={false}
                      actions={
                        (onlyStaffEnabled && UserUtils.isStaff(scUserContext.user)) || !onlyStaffEnabled ? (
                          <CreateEventButton {...CreateEventButtonProps} />
                        ) : null
                      }
                    />
                    <Typography variant="body1">
                      <FormattedMessage id="ui.events.noEvents.title" defaultMessage="ui.events.noEvents.title" />
                    </Typography>
                  </>
                ) : (
                  <>
                    <EventSkeleton
                      {...EventSkeletonComponentProps}
                      skeletonsAnimation={false}
                      actions={
                        (onlyStaffEnabled && UserUtils.isStaff(scUserContext.user)) || !onlyStaffEnabled ? (
                          <CreateEventButton {...CreateEventButtonProps} />
                        ) : null
                      }
                    />
                    <Typography variant="body1">
                      <FormattedMessage id="ui.events.noEvents.title.personal" defaultMessage="ui.events.noEvents.title.personal" />
                    </Typography>
                  </>
                )}
              </Box>
            ) : (
              <>
                <Grid container spacing={{xs: 2}} className={classes.events} {...GridContainerComponentProps}>
                  <>
                    {events.map((event: SCEventType) => (
                      <Grid item xs={12} sm={12} md={6} key={event.id} className={classes.item} {...GridItemComponentProps}>
                        <Event event={event} eventId={event.id} {...EventComponentProps} />
                      </Grid>
                    ))}
                    {authUserId && events.length % 2 !== 0 && (
                      <Grid item xs={12} sm={12} md={6} key={'skeleton-item'} className={classes.itemSkeleton} {...GridItemComponentProps}>
                        <EventSkeleton
                          {...EventSkeletonComponentProps}
                          skeletonsAnimation={false}
                          actions={
                            <CreateEventButton variant="outlined" color="primary" size="small" {...CreateEventButtonProps}>
                              <FormattedMessage id="ui.events.skeleton.action.add" defaultMessage="ui.events.skeleton.action.add" />
                            </CreateEventButton>
                          }
                        />
                      </Grid>
                    )}
                  </>
                </Grid>
                {Boolean(next) && (
                  <Button color="secondary" variant="text" onClick={handleNext} className={classes.showMore}>
                    <FormattedMessage id="ui.events.button.seeMore" defaultMessage="ui.events.button.seeMore" />
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </>
    </>
  );

  /**
   * Renders root object (if content availability community option is false and user is anonymous, component is hidden)
   */
  if (!contentAvailability && !scUserContext.user) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {c}
    </Root>
  );
}
