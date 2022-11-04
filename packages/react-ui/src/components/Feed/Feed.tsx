// @ts-nocheck
import React, {forwardRef, ForwardRefRenderFunction, ReactNode, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {
  Link,
  SCCache,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useSCFetchFeed,
  usePreviousValue,
  useIsComponentMountedRef
} from '@selfcommunity/react-core';
import {styled, useTheme} from '@mui/material/styles';
import {CardContent, Grid, Hidden, Theme, useMediaQuery} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {GenericSkeleton} from '../Skeleton';
import {SCFeedWidgetType} from '../../types/feed';
import Sticky from 'react-stickynode';
import CustomAdv, {CustomAdvProps} from '../CustomAdv';
import {SCCustomAdvPosition, SCFeedUnitType, SCUserType} from '@selfcommunity/types';
import {EndpointType, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, getQueryStringParameter, updateQueryStringParameter} from '@selfcommunity/utils';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import {useThemeProps} from '@mui/system';
import Widget from '../Widget';
import InfiniteScroll from '../../shared/InfiniteScroll';
import VirtualizedScroller, {VirtualizedScrollerCommonProps, VirtualScrollChild} from '../../shared/VirtualizedScroller';
import {DEFAULT_WIDGETS_NUMBER, WIDGET_PREFIX_KEY} from '../../constants/Feed';
import {DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET, DEFAULT_PAGINATION_QUERY_PARAM_NAME} from '../../constants/Pagination';
import {widgetSort} from '../../utils/feed';
import Footer from '../Footer';
import FeedSkeleton from './Skeleton';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';

const PREFIX = 'SCFeed';

const classes = {
  root: `${PREFIX}-root`,
  left: `${PREFIX}-left`,
  right: `${PREFIX}-right`,
  end: `${PREFIX}-end`,
  refresh: `${PREFIX}-refresh`,
  paginationLink: `${PREFIX}-pagination-link`
};

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(-2),
  [`& .${classes.left}`]: {
    padding: '0 2px 0 2px',
    '& > div:first-child': {
      marginTop: 0
    },
    '& > div:last-child': {
      marginTop: 0
    },
    [theme.breakpoints.down('md')]: {
      '& > .SCWidget-root, & > .SCCustomAdv-root': {
        maxWidth: 850,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    }
  },
  [`& .${classes.end}, & .${classes.refresh}`]: {
    textAlign: 'center'
  },
  [`& .${classes.paginationLink}`]: {
    display: 'none'
  }
}));

export interface FeedSidebarProps {
  top: string | number;
  bottomBoundary: string | number;
}

export type FeedRef = {
  addFeedData: (obj: any, syncPagination?: boolean) => void;
  refresh: () => void;
};

export interface FeedProps {
  /**
   * Id of the feed object
   * @default 'feed'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Feed API Endpoint
   */
  endpoint: EndpointType;

  /**
   * Feed API Query Params
   * @default [{'limit': 5}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * End message, rendered when no more feed item can be displayed
   * @default `<FormattedMessage id="ui.feed.noOtherFeedObject" defaultMessage="ui.feed.noOtherFeedObject" />`
   */
  endMessage?: ReactNode;

  /**
   * Refresh message, rendered when no more feed item can be displayed
   * @default `<FormattedMessage id="ui.feed.refreshRelease" defaultMessage="ui.feed.refreshRelease" />`
   */
  refreshMessage?: ReactNode;

  /**
   * Component used as header. It will be displayed at the beginning of the feed
   @default null
   */
  HeaderComponent?: JSX.Element;

  /**
   * Component used as footer. It will be displayed after the end messages
   @default `<Footer>`
   */
  FooterComponent?: React.ElementType;

  /**
   * Props to spread to FooterComponent
   * @default empty object
   */
  FooterComponentProps?: any;

  /**
   * Widgets to insert into the feed
   * @default empty array
   */
  widgets?: SCFeedWidgetType[];

  /**
   * Component used to render single feed item retrieved by the endpoint
   */
  ItemComponent: React.ElementType;

  /**
   * Function used to convert the single result returned by the Endpoint into the props necessary to render the ItemComponent
   */
  itemPropsGenerator: (scUser: SCUserType, item) => any;

  /**
   * Function used to generate an id from the single result returned by the Endpoint
   */
  itemIdGenerator: (item) => any;

  /**
   * Props to spread to single feed item
   * @default empty object
   */
  ItemProps?: any;

  /**
   * Skeleton used to render loading effect during fetch
   */
  ItemSkeleton: React.ElementType;

  /**
   * Props to spread to single feed item skeleton
   * @default empty object
   */
  ItemSkeletonProps?: any;

  /**
   * Callback invoked whenever data is loaded during paging next
   */
  onNextData?: (data) => any;

  /**
   * Callback invoked whenever data is loaded during paging previous
   */
  onPreviousData?: (data) => any;

  /**
   * Authenticated or not
   */
  requireAuthentication?: boolean;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to single feed object
   * @default {top: 0, bottomBoundary: `#${id}`}
   */
  FeedSidebarProps?: FeedSidebarProps;

  /**
   * Props to spread to single custom adv element (this props can be used only if Custom Adv are enabled)
   * @default {}
   */
  CustomAdvProps?: CustomAdvProps;

  /**
   * Props to programmatically enable the custom adv position in the feed
   * @default [SCCustomAdvPosition.POSITION_FEED_SIDEBAR, SCCustomAdvPosition.POSITION_FEED]
   */
  enabledCustomAdvPositions?: SCCustomAdvPosition[];

  /**
   * Prefetch data. Useful for SSR.
   * Use this to init the component (in particular useSCFetchFeed)
   */
  prefetchedData?: SCPaginatedResponse<SCFeedUnitType>;

  /**
   * Props to spread to VirtualizedScroller object.
   * @default {}
   */
  VirtualizedScrollerProps?: VirtualizedScrollerCommonProps;

  /**
   * Add/remove pagination links on top/bottom of items
   * @default false
   */
  disablePaginationLinks?: boolean;

  /**
   * Show/hide pagination links
   * @default true
   */
  hidePaginationLinks?: boolean;

  /**
   * Page query parameter name
   * @default 'page'
   */
  paginationLinksPageQueryParam?: string;

  /**
   * Props to spread to the pagination Link component
   * @default {}
   */
  PaginationLinkProps?: Record<string, any>;

  /**
   * Show/hide adv banners
   * @default false
   */
  hideAdvs?: boolean;
}

const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];

/**
 * > API documentation for the Community-JS Feed component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {Feed} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFeed` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeed-root|Styles applied to the root element.|
 |left|.SCFeed-left|Styles applied to the left element.|
 |right|.SCFeed-right|Styles applied to the right element.|
 |end|.SCFeed-end|Styles applied to the end element.|
 |refresh|.SCFeed-refresh|Styles applied to the refresh section.|
 |paginationLink|.SCFeed-pagination-link|Styles applied to pagination links.|
 *
 * @param inProps
 */
const Feed: ForwardRefRenderFunction<FeedRef, FeedProps> = (inProps: FeedProps, ref): JSX.Element => {
  // PROPS
  const props: FeedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = 'feed',
    className,
    endpoint,
    endpointQueryParams = {limit: DEFAULT_PAGINATION_LIMIT, offset: DEFAULT_PAGINATION_OFFSET},
    endMessage = <FormattedMessage id="ui.feed.noOtherFeedObject" defaultMessage="ui.feed.noOtherFeedObject" />,
    refreshMessage = <FormattedMessage id="ui.feed.refreshRelease" defaultMessage="ui.feed.refreshRelease" />,
    HeaderComponent,
    FooterComponent = Footer,
    FooterComponentProps = {},
    widgets = [],
    ItemComponent,
    itemPropsGenerator,
    itemIdGenerator,
    ItemProps = {},
    ItemSkeleton,
    ItemSkeletonProps = {},
    onNextData,
    onPreviousData,
    FeedSidebarProps = {top: 0, bottomBoundary: `#${id}`},
    CustomAdvProps = {},
    enabledCustomAdvPositions = [SCCustomAdvPosition.POSITION_FEED_SIDEBAR, SCCustomAdvPosition.POSITION_FEED],
    requireAuthentication = false,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    prefetchedData,
    VirtualizedScrollerProps = {},
    disablePaginationLinks = false,
    hidePaginationLinks = true,
    paginationLinksPageQueryParam = DEFAULT_PAGINATION_QUERY_PARAM_NAME,
    PaginationLinkProps = {},
    hideAdvs = false
  } = props;

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const limit = useMemo(() => endpointQueryParams.limit || DEFAULT_PAGINATION_LIMIT, [endpointQueryParams]);
  const offset = useMemo(() => {
    if (prefetchedData) {
      const currentOffset = getQueryStringParameter(prefetchedData.previous, 'offset') || 0;
      return prefetchedData.previous ? parseInt(currentOffset) + limit : 0;
    }
    return endpointQueryParams.offset || 0;
  }, [endpointQueryParams, prefetchedData]);

  // REF
  const isMountRef = useIsComponentMountedRef();

  /**
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map(
      (p) => (_preferences[p] = scPreferences.preferences && p in scPreferences.preferences ? scPreferences.preferences[p].value : null)
    );
    return _preferences;
  }, [scPreferences.preferences]);

  // RENDER
  const theme: Theme = useTheme();
  const oneColLayout = useMediaQuery(theme.breakpoints.down('md'), {noSsr: typeof window !== 'undefined'});
  const advEnabled = useMemo(
    () =>
      preferences &&
      preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED] &&
      ((preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED] && scUserContext.user === null) ||
        !preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED]),
    [preferences]
  );
  const prevWidgets = usePreviousValue(widgets);

  /**
   * Callback onNextPage
   * @param page
   * @param offset
   * @param total
   * @param data
   */
  const onNextPage = (page, offset, total, data) => {
    setFeedDataLeft((prev) => prev.concat(_getFeedDataLeft(data, offset, total)));
    onNextData && onNextData(page, offset, total, data);
  };

  /**
   * Callback onPreviousPage
   * @param page
   * @param offset
   * @param total
   * @param data
   */
  const onPreviousPage = (page, offset, total, data) => {
    setFeedDataLeft((prev) => _getFeedDataLeft(data, offset, total).concat(prev));
    // Remove item duplicated from headData if the page data already contains
    removeHeadDuplicatedData(data.map((item) => itemIdGenerator(item)));
    onPreviousData && onPreviousData(page, offset, total, data);
  };

  // PAGINATION FEED
  const feedDataObject = useSCFetchFeed({
    id,
    endpoint,
    endpointQueryParams: {...endpointQueryParams, ...{offset, limit}},
    onNextPage: onNextPage,
    onPreviousPage: onPreviousPage,
    cacheStrategy,
    prefetchedData
  });

  /**
   * Compute Base Widgets
   */
  const _widgets: SCFeedWidgetType[] = useMemo(
    () =>
      [
        ...widgets,
        ...(advEnabled && enabledCustomAdvPositions.includes(SCCustomAdvPosition.POSITION_FEED_SIDEBAR)
          ? [
              {
                type: 'widget',
                component: CustomAdv,
                componentProps: {
                  position: SCCustomAdvPosition.POSITION_FEED_SIDEBAR,
                  ...CustomAdvProps
                },
                column: 'right',
                position: 0
              }
            ]
          : [])
      ]
        .map((w, i) => Object.assign({}, w, {position: w.position * (w.column === 'right' ? 5 : 1), id: `${w.column}_${i}`}))
        .sort(widgetSort),
    [widgets, advEnabled]
  );

  /**
   * Compute Widgets for the left column in a specific position
   */
  const _getLeftColumnWidgets: SCFeedWidgetType[] = (position = 1, total) => {
    const tw = {
      type: 'widget',
      component: CustomAdv,
      componentProps: {
        position: SCCustomAdvPosition.POSITION_FEED,
        ...CustomAdvProps
      },
      column: 'left',
      position,
      id: `left_${position}`
    };
    if (oneColLayout && !hideAdvs) {
      const remainingWidgets = position === total - 1 ? _widgets.filter((w) => w.position >= total) : [];
      return [
        ..._widgets.filter((w) => w.position === position),
        ...(advEnabled &&
        enabledCustomAdvPositions.includes(SCCustomAdvPosition.POSITION_FEED) &&
        position > 0 &&
        position % DEFAULT_WIDGETS_NUMBER === 0
          ? [tw]
          : []),
        ...remainingWidgets
      ];
    }
    const remainingWidgets = position === total - 1 ? _widgets.filter((w) => w.position >= total && w.column === 'left') : [];
    return [
      ..._widgets.filter((w) => w.position === position && w.column === 'left'),
      ...(advEnabled &&
      !hideAdvs &&
      enabledCustomAdvPositions.includes(SCCustomAdvPosition.POSITION_FEED) &&
      position > 0 &&
      position % DEFAULT_WIDGETS_NUMBER === 0
        ? [tw]
        : []),
      ...remainingWidgets
    ];
  };

  /**
   * Compute Widgets for the right column
   */
  const _getRightColumnWidgets: SCFeedWidgetType[] = () => {
    if (oneColLayout) {
      return [];
    }
    return _widgets.filter((w) => w.column === 'right');
  };

  /**
   * Get left column data
   * @param data
   */
  const _getFeedDataLeft = (data, currentOffset, total) => {
    let result = [];
    if (total === 0) {
      result = oneColLayout ? _widgets : _widgets.filter((w) => w.column === 'left');
    } else {
      data.forEach((e, i) => {
        result = result.concat([..._getLeftColumnWidgets(i + currentOffset, total), ...[e]]);
      });
    }
    return result;
  };

  /**
   * Get right column data
   */
  const _getFeedDataRight = () => {
    return _getRightColumnWidgets();
  };

  // STATE
  const [feedDataLeft, setFeedDataLeft] = useState(
    prefetchedData ? _getFeedDataLeft(feedDataObject.results, feedDataObject.initialOffset, feedDataObject.count) : []
  );
  const [feedDataRight, setFeedDataRight] = useState(prefetchedData ? _getFeedDataRight() : []);
  const [headData, setHeadData] = useState([]);

  // REFS
  const refreshSubscription = useRef(null);
  const virtualScrollerState = useRef(null);
  const virtualScrollerMountState = useRef(false);

  // VIRTUAL SCROLL HELPERS
  const getScrollItemId = useMemo(
    () =>
      (item: any): string =>
        item.type === 'widget' ? `${WIDGET_PREFIX_KEY}${item.id}` : `${item.type}_${itemIdGenerator(item)}`,
    []
  );

  /**
   * Callback on scroll mount
   */
  const onScrollerMount = useMemo(
    () => () => {
      virtualScrollerMountState.current = true;
    },
    []
  );

  /**
   * Callback on scroll mount
   */
  const onScrollerStateChange = useMemo(
    () => (state) => {
      virtualScrollerState.current = state;
    },
    []
  );

  /**
   * Callback on refresh
   */
  const refresh = () => {
    /**
     * Only if the feedDataObject is loaded reload data
     */
    if (feedDataObject.componentLoaded) {
      setHeadData([]);
      setFeedDataLeft([]);
      setFeedDataRight(_getFeedDataRight());
      feedDataObject.reload();
    }
  };

  /**
   * Callback subscribe events
   * @param msg
   * @param data
   */
  const subscriber = (msg, data) => {
    if (data.refresh) {
      refresh();
    }
  };

  /**
   * Render HeaderComponent
   */
  const renderHeaderComponent = () => {
    return (
      <>
        {!feedDataObject.previous && (
          <>
            {virtualScrollerMountState.current && HeaderComponent}
            {headData.map((item) => {
              const _itemId = `item_${itemIdGenerator(item)}`;
              return (
                <ItemComponent id={_itemId} key={_itemId} {...itemPropsGenerator(scUserContext.user, item)} {...ItemProps} sx={{width: '100%'}} />
              );
            })}
          </>
        )}
      </>
    );
  };

  /**
   * Infinite scroll getNextPage
   */
  const getNextPage = useMemo(
    () => () => {
      if (isMountRef.current && feedDataObject.componentLoaded && !feedDataObject.isLoadingNext) {
        feedDataObject.getNextPage();
      }
    },
    [isMountRef.current, feedDataObject.componentLoaded, feedDataObject.isLoadingNext]
  );

  /**
   * Infinite scroll getNextPage
   */
  const getPreviousPage = useMemo(
    () => () => {
      if (isMountRef.current && feedDataObject.componentLoaded && feedDataObject.isLoadingPrevious) {
        feedDataObject.getPreviousPage();
      }
    },
    [isMountRef.current, feedDataObject.componentLoaded, feedDataObject.isLoadingPrevious]
  );

  /**
   * Bootstrap initial data
   */
  const _initFeedData = useMemo(
    () => () => {
      if (cacheStrategy === CacheStrategies.CACHE_FIRST && feedDataObject.componentLoaded) {
        // Set current cached feed or prefetched data
        setFeedDataLeft(_getFeedDataLeft(feedDataObject.results, feedDataObject.initialOffset, feedDataObject.count));
        setFeedDataRight(_getFeedDataRight());
      } else if (!feedDataObject.componentLoaded) {
        // Load next page
        feedDataObject.getNextPage();
        setFeedDataRight(_getFeedDataRight());
      }
    },
    [cacheStrategy, feedDataObject.componentLoaded, endpointQueryParams]
  );

  // EFFECTS
  useEffect(() => {
    /**
     * Initialize feed
     * Init feed data when the user is authenticated/un-authenticated
     * Use setTimeout helper to delay the request and cancel the effect
     * (ex. in strict-mode) if need it
     */
    let _t;
    if ((requireAuthentication && authUserId !== null && !prefetchedData) || (!requireAuthentication && !prefetchedData)) {
      _t = setTimeout(_initFeedData);
    }
    return () => {
      _t && clearTimeout(_t);
    };
  }, [requireAuthentication, authUserId, prefetchedData]);

  /**
   * If widgets changed, refresh the feed (it must recalculate the correct positions of the objects)
   */
  useDeepCompareEffectNoCheck(() => {
    if (prevWidgets && widgets && prevWidgets !== widgets) {
      refresh();
    }
  }, [widgets]);

  /**
   * Subscribe/Unsubscribe for external events
   */
  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(id, subscriber);
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, []);

  /**
   * Remove duplicated data when load previous page and
   * previously some elements have been added in the head
   */
  const removeHeadDuplicatedData = (itemIds) => {
    setHeadData(headData.filter((item) => !itemIds.includes(itemIdGenerator(item))));
  };

  /**
   * Next page url
   * Useful for SSR and SEO
   */
  const NextPageLink = useMemo(() => {
    return (
      <>
        {!disablePaginationLinks && feedDataObject.nextPage && (
          <Link
            to={`?${paginationLinksPageQueryParam}=${feedDataObject.nextPage}`}
            className={classNames({[classes.paginationLink]: hidePaginationLinks})}
            {...PaginationLinkProps}>
            <FormattedMessage id="ui.common.nextPage" defaultMessage="ui.common.nextPage" />
          </Link>
        )}
      </>
    );
  }, [feedDataObject.nextPage, disablePaginationLinks, paginationLinksPageQueryParam, hidePaginationLinks]);

  /**
   * Previous page url
   * Useful for SSR and SEO
   */
  const PreviousPageLink = useMemo(() => {
    return (
      <>
        {!disablePaginationLinks && feedDataObject.previousPage && (
          <Link
            to={`?${paginationLinksPageQueryParam}=${feedDataObject.previousPage}`}
            className={classNames({[classes.paginationLink]: hidePaginationLinks})}
            {...PaginationLinkProps}>
            <FormattedMessage id="ui.common.previousPage" defaultMessage="ui.common.previousPage" />
          </Link>
        )}
      </>
    );
  }, [feedDataObject.previousPage, disablePaginationLinks, paginationLinksPageQueryParam, hidePaginationLinks]);

  // EXPOSED METHODS
  useImperativeHandle(ref, () => ({
    addFeedData: (data: any, syncPagination: boolean) => {
      // Use headData to save new items in the head of the feed list
      // In this way, the state of the feed (virtualScroller/cache) remains consistent
      setHeadData([...[data], ...headData]);
      if (syncPagination) {
        // Adding an element, re-sync next and previous of feedDataObject
        const nextOffset = parseInt(getQueryStringParameter(feedDataObject.next, 'offset') || feedDataObject.results.length - 1) + 1;
        const previousOffset = parseInt(getQueryStringParameter(feedDataObject.previous, 'offset') || offset) + 1;
        feedDataObject.updateState({
          previous: updateQueryStringParameter(feedDataObject.previous, 'offset', previousOffset),
          next: updateQueryStringParameter(feedDataObject.next, 'offset', nextOffset)
        });
      }
    },
    refresh: () => {
      refresh();
    }
  }));

  const InnerItem = useMemo(
    () =>
      ({state: savedState, onHeightChange, onStateChange, children: item}) => {
        const onItemHeightChange = () => {
          if (savedState && savedState.firstShownItemIndex !== undefined) {
            onHeightChange();
          }
        };
        const onItemStateChange = (state) => {
          onStateChange({...savedState, ...state});
        };
        return (
          <VirtualScrollChild onHeightChange={onItemHeightChange}>
            {item.type === 'widget' ? (
              <item.component
                id={`${WIDGET_PREFIX_KEY}${item.position}`}
                {...item.componentProps}
                {...(item.publishEvents && {publicationChannel: id})}
                {...savedState}
                onStateChange={onItemStateChange}
                onHeightChange={onItemHeightChange}
              />
            ) : (
              <ItemComponent
                id={`item_${itemIdGenerator(item)}`}
                {...itemPropsGenerator(scUserContext.user, item)}
                {...ItemProps}
                sx={{width: '100%'}}
                {...savedState}
                onStateChange={onItemStateChange}
                onHeightChange={onItemHeightChange}
              />
            )}
          </VirtualScrollChild>
        );
      },
    []
  );

  if (feedDataObject.isLoadingNext && !feedDataLeft.length) {
    return (
      <FeedSkeleton>
        {[...Array(3)].map((v, i) => (
          <ItemSkeleton key={i} {...ItemSkeletonProps} />
        ))}
      </FeedSkeleton>
    );
  }

  return (
    <Root container spacing={2} id={id} className={classNames(classes.root, className)}>
      {advEnabled && !hideAdvs && enabledCustomAdvPositions.includes(SCCustomAdvPosition.POSITION_BELOW_TOPBAR) ? (
        <Grid item xs={12}>
          <CustomAdv position={SCCustomAdvPosition.POSITION_BELOW_TOPBAR} {...CustomAdvProps} />
        </Grid>
      ) : null}
      <Grid item xs={12} md={7}>
        <div className={classes.left} style={{overflow: 'visible'}}>
          <InfiniteScroll
            className={classes.left}
            dataLength={feedDataLeft.length}
            next={getNextPage}
            previous={getPreviousPage}
            hasMoreNext={Boolean(feedDataObject.next)}
            hasMorePrevious={Boolean(feedDataObject.previous)}
            header={PreviousPageLink}
            footer={NextPageLink}
            loaderNext={<ItemSkeleton {...ItemSkeletonProps} />}
            loaderPrevious={<ItemSkeleton {...ItemSkeletonProps} />}
            scrollThreshold={1}
            endMessage={
              <>
                <Widget className={classes.end}>
                  <CardContent>{endMessage}</CardContent>
                </Widget>
                {advEnabled && !hideAdvs && enabledCustomAdvPositions.includes(SCCustomAdvPosition.POSITION_ABOVE_FOOTER_BAR) ? (
                  <CustomAdv position={SCCustomAdvPosition.POSITION_ABOVE_FOOTER_BAR} {...CustomAdvProps} />
                ) : null}
                {FooterComponent ? <FooterComponent {...FooterComponentProps} /> : null}
              </>
            }
            refreshFunction={refresh}
            pullDownToRefresh
            pullDownToRefreshThreshold={1000}
            pullDownToRefreshContent={null}
            releaseToRefreshContent={
              <Widget variant="outlined" className={classes.refresh}>
                <CardContent>{refreshMessage}</CardContent>
              </Widget>
            }
            style={{overflow: 'visible'}}>
            {renderHeaderComponent()}
            <VirtualizedScroller
              items={feedDataLeft}
              itemComponent={InnerItem}
              onMount={onScrollerMount}
              onScrollerStateChange={onScrollerStateChange}
              getItemId={getScrollItemId}
              preserveScrollPosition
              preserveScrollPositionOnPrependItems
              cacheScrollStateKey={SCCache.getVirtualizedScrollStateCacheKey(id)}
              cacheScrollerPositionKey={SCCache.getFeedSPCacheKey(id)}
              cacheStrategy={cacheStrategy}
              {...VirtualizedScrollerProps}
            />
          </InfiniteScroll>
        </div>
      </Grid>
      {feedDataRight.length > 0 && !hideAdvs && (
        <Hidden smDown>
          <Grid item xs={12} md={5}>
            <Sticky enabled className={classes.right} {...FeedSidebarProps}>
              <React.Suspense fallback={<GenericSkeleton />}>
                {feedDataRight.map((d, i) => (
                  <d.component key={i} {...d.componentProps}></d.component>
                ))}
              </React.Suspense>
            </Sticky>
          </Grid>
        </Hidden>
      )}
    </Root>
  );
};

export default forwardRef(Feed);
