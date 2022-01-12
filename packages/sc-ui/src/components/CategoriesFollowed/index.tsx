import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, Logger} from '@selfcommunity/core';
import CategoriesSuggestionSkeleton from '../Skeleton/CategoriesSuggestionSkeleton';
import Category from '../Category';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {defineMessages, useIntl, FormattedMessage} from 'react-intl';
import {CategoriesListProps} from '../CategoriesSuggestion';

const messages = defineMessages({
  categoriesFollowed: {
    id: 'ui.categoriesFollowed.categoriesFollowed',
    defaultMessage: 'ui.categoriesFollowed.categoriesFollowed'
  },
  noCategories: {
    id: 'ui.categoriesFollowed.subtitle.noResults',
    defaultMessage: 'ui.categoriesFollowed.subtitle.noResults'
  }
});

const PREFIX = 'SCCategoriesFollowed';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function CategoriesFollowed(props: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const {autoHide, className, CategoryProps = {}} = props;

  // STATE
  const [categories, setCategories] = useState<any[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openCategoriesFollowedDialog, setOpenCategoriesFollowedDialog] = useState<boolean>(false);
  const intl = useIntl();

  /**
   * Handles list change on category follow
   */
  function handleClick(clickedId) {
    setCategories(categories.filter((c) => c.id !== clickedId));
    setTotal((prev) => prev - 1);
    if (visibleCategories < limit) {
      setVisibleCategories((prev) => prev + 1);
    }
  }

  /**
   * fetches Categories Followed
   */
  const fetchCategoriesFollower = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.CategoriesFollowed.url(),
          method: Endpoints.CategoriesFollowed.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    []
  );

  /**
   * Loads more categories on "see more" button click
   */
  function loadCategories() {
    const newIndex = visibleCategories + limit;
    const newHasMore = newIndex < categories.length - 1;
    setVisibleCategories(newIndex);
    setHasMore(newHasMore);
  }

  /**
   * On mount, fetches the list of categories followed
   */
  useEffect(() => {
    fetchCategoriesFollower()
      .then((data: AxiosResponse<any>) => {
        setCategories(data['results']);
        setTotal(data['count']);
        setHasMore(data['count'] > visibleCategories);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }, []);

  /**
   * Renders the list of categories followed
   */
  const c = (
    <React.Fragment>
      {loading ? (
        <CategoriesSuggestionSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography variant="body1">{`${intl.formatMessage(messages.categoriesFollowed, {total: total})}`}</Typography>
          {!total ? (
            <Typography variant="body2">{`${intl.formatMessage(messages.noCategories)}`}</Typography>
          ) : (
            <React.Fragment>
              <List>
                {categories.slice(0, visibleCategories).map((category: SCCategoryType, index) => (
                  <div key={index}>
                    <Category elevation={0} category={category} key={category.id} {...CategoryProps} onClick={() => handleClick(category.id)} />
                    {index < visibleCategories - 1 ? <Divider /> : null}
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => loadCategories()}>
                  <FormattedMessage id="ui.categoriesFollowed.button.showMore" defaultMessage="ui.categoriesFollowed.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openCategoriesFollowedDialog && <></>}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return <Root className={className}>{c}</Root>;
  }
  return null;
}
