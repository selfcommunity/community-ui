import React, {useContext, useEffect, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCCache, SCUserContext, SCUserContextType, useIsComponentMountedRef} from '@selfcommunity/react-core';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';
import Category from '../Category';
import {SCCategoryType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {CategoriesListProps} from '../CategoriesSuggestion';
import Skeleton from './Skeleton';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const messages = defineMessages({
  title: {
    id: 'ui.categoriesFollowed.title',
    defaultMessage: 'ui.categoriesFollowed.title'
  },
  noCategories: {
    id: 'ui.categoriesFollowed.subtitle.noResults',
    defaultMessage: 'ui.categoriesFollowed.subtitle.noResults'
  }
});

const PREFIX = 'SCCategoriesFollowed';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2)
}));
/**
 > API documentation for the Community-JS Categories Followed component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CategoriesFollowed} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCCategoriesFollowed` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryFollowed-root|Styles applied to the root element.|
 |title|.SCCategoryFollowed-title|Styles applied to the title element.|
 |noResults|.SCCategoryFollowed-no-results|Styles applied to no results section.|
 |showMore|.SCCategoryFollowed-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function CategoriesFollowed(inProps: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // INTL
  const intl = useIntl();

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // PROPS
  const props: CategoriesListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {userId, autoHide, className, CategoryProps = {}, cacheStrategy = CacheStrategies.NETWORK_ONLY, onHeightChange, onStateChange} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // STATE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.FollowedCategories.url({id: userId})}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.CATEGORIES_FOLLOWED_TOOLS_STATE_CACHE_PREFIX_KEY, userId),
      cacheStrategy
    },
    stateToolsInitializer
  );

  const [openCategoriesFollowedDialog, setOpenCategoriesFollowedDialog] = useState<boolean>(false);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  /**
   * Handles list change on category follow
   */
  function handleOnFollowCategory(category) {
    if (scUserContext.user['id'] === userId) {
      dispatch({
        type: actionToolsTypes.SET_RESULTS,
        payload: {results: state.results.filter((c) => c.id !== category.id), count: state.count - 1}
      });
    } else {
      const newCategories = [...state.results];
      const index = newCategories.findIndex((u) => u.id === category.id);
      if (index !== -1) {
        if (category.followed) {
          newCategories[index].followers_counter = category.followers_counter - 1;
          newCategories[index].followed = !category.followed;
        } else {
          newCategories[index].followers_counter = category.followers_counter + 1;
          newCategories[index].followed = !category.followed;
        }
        dispatch({
          type: actionToolsTypes.SET_RESULTS,
          payload: {results: newCategories}
        });
      }
    }
  }

  /**
   * fetches Categories Followed
   */
  function fetchCategoriesFollowed() {
    if (state.next) {
      dispatch({type: actionToolsTypes.LOADING_NEXT});
      http
        .request({
          url: state.next,
          method: Endpoints.FollowedCategories.method
        })
        .then((res: HttpResponse<any>) => {
          if (isMountedRef.current) {
            const data = res.data;
            dispatch({
              type: actionToolsTypes.LOAD_NEXT_SUCCESS,
              payload: {
                results: data,
                count: data.length
              }
            });
          }
        })
        .catch((error) => {
          dispatch({type: actionToolsTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * On mount, fetches the list of categories followed
   */
  useEffect(() => {
    if (!userId) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      fetchCategoriesFollowed();
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [authUserId]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results.length]);

  /**
   * Renders the list of categories followed
   */
  if (state.isLoadingNext) {
    return <Skeleton />;
  }
  const c = (
    <CardContent>
      <Typography className={classes.title} variant="h5">{`${intl.formatMessage(messages.title, {
        total: state.count
      })}`}</Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">{`${intl.formatMessage(messages.noCategories)}`}</Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, limit).map((category: SCCategoryType) => (
              <ListItem key={category.id}>
                <Category elevation={0} category={category} followCategoryButtonProps={{onFollow: handleOnFollowCategory}} {...CategoryProps} />
              </ListItem>
            ))}
          </List>
          {limit < state.count && (
            <Button size="small" className={classes.showMore} onClick={() => setOpenCategoriesFollowedDialog(true)}>
              <FormattedMessage id="ui.categoriesFollowed.button.showAll" defaultMessage="ui.categoriesFollowed.button.showAll" />
            </Button>
          )}
          {openCategoriesFollowedDialog && (
            <BaseDialog
              title={
                isMobile ? (
                  <FormattedMessage id="ui.categoriesFollowed.modal.title" defaultMessage="ui.categoriesFollowed.modal.title" />
                ) : (
                  `${intl.formatMessage(messages.title, {total: state.count})}`
                )
              }
              onClose={() => setOpenCategoriesFollowedDialog(false)}
              open={openCategoriesFollowedDialog}>
              {state.isLoadingNext ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={state.results.length}
                  next={fetchCategoriesFollowed}
                  hasMoreNext={Boolean(state.next)}
                  loaderNext={<CentralProgress size={30} />}
                  height={isMobile ? '100vh' : 400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage id="ui.categoriesFollowed.noMoreResults" defaultMessage="ui.categoriesFollowed.noMoreResults" />
                      </b>
                    </p>
                  }>
                  <List>
                    {state.results.map((c) => (
                      <ListItem key={c.id}>
                        <Category
                          elevation={0}
                          category={c}
                          sx={{m: 0}}
                          followCategoryButtonProps={{onFollow: handleOnFollowCategory}}
                          {...CategoryProps}
                        />
                      </ListItem>
                    ))}
                  </List>
                </InfiniteScroll>
              )}
            </BaseDialog>
          )}
        </React.Fragment>
      )}
    </CardContent>
  );

  /**
   * Renders root object (if results and if user is logged, otherwise component is hidden)
   */
  if (autoHide && !state.count) {
    return <HiddenPlaceholder />;
  }
  /**
   * If there's no userId, component is hidden.
   */
  if (!userId) {
    return <HiddenPlaceholder />;
  }
  return <Root className={classNames(classes.root, className)}>{c}</Root>;
}
