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
  Stack,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  useThemeProps
} from '@mui/material';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {SCPreferences, SCPreferencesContextType, SCThemeType, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import {SCCategoryType, SCCourseType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import {SCCourseEventType, SCTopicType} from '../../constants/PubSub';
import Course, {CourseProps, CourseSkeletonProps} from '../Course';
import Skeleton, {CoursesSkeletonProps} from '../Courses/Skeleton';
import {PREFIX} from './constants';
import {SCCourseTemplateType} from '../../types/course';
import CategoryAutocomplete from '../CategoryAutocomplete';
import CoursePlaceholder from '../Course/Placeholder';

const classes = {
  root: `${PREFIX}-root`,
  category: `${PREFIX}-category`,
  courses: `${PREFIX}-courses`,
  emptyBox: `${PREFIX}-empty-box`,
  emptyIcon: `${PREFIX}-empty-icon`,
  emptyRotatedBox: `${PREFIX}-empty-rotated-box`,
  filters: `${PREFIX}-filters`,
  item: `${PREFIX}-item`,
  itemPlaceholder: `${PREFIX}-item-placeholder`,
  noResults: `${PREFIX}-no-results`,
  search: `${PREFIX}-search`,
  showMore: `${PREFIX}-show-more`,
  studentEmptyView: `${PREFIX}-student-empty-view`,
  teacherEmptyView: `${PREFIX}-teacher-empty-view`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export const CoursesChipRoot = styled(Chip, {
  name: PREFIX,
  slot: 'CoursesChipRoot',
  shouldForwardProp: (prop) => prop !== 'showForMe'
})(() => ({}));

export interface CoursesProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Feed API Query Params
   * @default [{'limit': 20, 'offset': 0}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * Props to spread to single course object
   * @default {}
   */
  CourseComponentProps?: CourseProps;

  /**
   * Props to spread to single course skeleton object
   * @default {}
   */
  CourseSkeletonComponentProps?: CourseSkeletonProps;

  /**
   * Props to spread to courses skeleton object
   * @default {}
   */
  CoursesSkeletonComponentProps?: CoursesSkeletonProps;

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
   * Show/Hide filters
   * @default true
   */
  showFilters?: boolean;

  /**
   * Filters component
   * @param props
   */
  filters?: JSX.Element;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Courses component. Learn about the available props and the CSS API.
 *
 *
 * The Courses component renders the list of all available courses.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Courses)

 #### Import
 ```jsx
 import {Courses} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCCourses` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCourses-root|Styles applied to the root element.|
 |category|.SCCourses-category|Styles applied to the category autocomplete element.|
 |courses|.SCCourses-courses|Styles applied to the courses section.|
 |emptyBox|.SCCourses-empty-box|Styles applied to the empty box element.|
 |emptyIcon|.SCCourses-empty-icon|Styles applied to the empty icon element.|
 |emptyRotatedBox|.SCCourses-empty-rotated-box|Styles applied to the rotated empty box element.|
 |filters|.SCCourses-filters|Styles applied to the filters section.|
 |item|.SCCourses-item|Styles applied to an individual item.|
 |itemPlaceholder|.SCCourses-item-placeholder|Styles applied to the placeholder for an item.|
 |noResults|.SCCourses-no-results|Styles applied when there are no results.|
 |search|.SCCourses-search|Styles applied to the search element.|
 |showMore|.SCCourses-show-more|Styles applied to the show more button or section.|
 |studentEmptyView|.SCCourses-student-empty-view|Styles applied to the student empty view.|
 |teacherEmptyView|.SCCourses-teacher-empty-view|Styles applied to the teacher empty view.|


 * @param inProps
 */
export default function Courses(inProps: CoursesProps): JSX.Element {
  // PROPS
  const props: CoursesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    endpointQueryParams = {limit: 8, offset: DEFAULT_PAGINATION_OFFSET},
    className,
    CourseComponentProps = {},
    CoursesSkeletonComponentProps = {},
    CourseSkeletonComponentProps = {template: SCCourseTemplateType.PREVIEW},
    GridContainerComponentProps = {},
    GridItemComponentProps = {},
    showFilters = true,
    filters,
    ...rest
  } = props;

  // STATE
  const [courses, setCourses] = useState<SCCourseType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(null);
  const [query, setQuery] = useState<string>('');
  const [_categories, setCategories] = useState<number[]>([]);
  const [showForMe, setShowForMe] = useState<boolean>(false);
  const [showMyCourses, setShowMyCourses] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const {preferences}: SCPreferencesContextType = useSCPreferences();
  // MEMO
  const contentAvailability =
    SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in preferences && preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;
  const onlyStaffEnabled = useMemo(() => preferences[SCPreferences.CONFIGURATIONS_COURSES_ONLY_STAFF_ENABLED]?.value, [preferences]);
  const canCreateCourse = useMemo(() => scUserContext?.user?.permission?.create_course, [scUserContext?.user?.permission]);
  const endpoint = useMemo(() => {
    if (showMyCourses) {
      return Endpoints.GetJoinedCourses;
    } else if (showForMe) {
      return Endpoints.CourseSuggestion;
    }
    return Endpoints.SearchCourses;
  }, [showMyCourses, showForMe]);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // REFS
  const updatesSubscription = useRef(null);

  // HANDLERS

  const handleChipClick = () => {
    setShowForMe(!showForMe);
  };

  const handleDeleteClick = () => {
    setShowForMe(false);
  };

  /**
   * Fetches courses list
   */
  const fetchCourses = () => {
    setLoading(true);
    return http
      .request({
        url: endpoint.url({}),
        method: endpoint.method,
        params: {
          ...endpointQueryParams,
          ...(_categories.length && {categories: JSON.stringify(_categories)}),
          ...(query && {search: query}),
          ...(showMyCourses && {created_by: authUserId})
        }
      })
      .then((res: HttpResponse<any>) => {
        setCourses(res.data.results);
        setNext(res.data.next);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  };

  /**
   * On mount, fetches courses list
   */
  useEffect(() => {
    if (!contentAvailability && !authUserId) {
      return;
    } else {
      fetchCourses();
    }
  }, [contentAvailability, authUserId, showForMe, showMyCourses, _categories]);

  /**
   * Subscriber for pubsub callback
   */
  const onDeleteCourseHandler = useCallback(
    (_msg: string, deleted: number) => {
      setCourses((prev) => {
        if (prev.some((e) => e.id === deleted)) {
          return prev.filter((e) => e.id !== deleted);
        }
        return prev;
      });
    },
    [courses]
  );

  /**
   * On mount, subscribe to receive course updates (only delete)
   */
  useEffect(() => {
    if (courses) {
      updatesSubscription.current = PubSub.subscribe(`${SCTopicType.COURSE}.${SCCourseEventType.DELETE}`, onDeleteCourseHandler);
    }
    return () => {
      updatesSubscription.current && PubSub.unsubscribe(updatesSubscription.current);
    };
  }, [courses]);

  const handleNext = useMemo(
    () => () => {
      if (!next) {
        return;
      }
      return http
        .request({
          url: next,
          method: showMyCourses ? Endpoints.GetJoinedCourses.method : Endpoints.SearchCourses.method
        })
        .then((res: HttpResponse<any>) => {
          setCourses([...courses, ...res.data.results]);
          setNext(res.data.next);
        })
        .catch((error) => console.log(error))
        .then(() => setLoading(false));
    },
    [next]
  );

  /**
   * Handle change filter name
   * @param course
   */
  const handleOnChangeFilterName = (course: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(course.target.value);
  };

  /**
   * Handle change category
   * @param categories
   */
  const handleOnChangeCategory = (categories: SCCategoryType[]) => {
    const categoriesIds = categories.map((item) => item.id);
    setCategories(categoriesIds);
  };

  /**
   * Renders courses list
   */
  const c = (
    <>
      {showFilters && (
        <Grid container className={classes.filters} gap={2}>
          {filters ? (
            filters
          ) : (
            <>
              <Grid item xs={12} md={3}>
                <TextField
                  className={classes.search}
                  size={'small'}
                  fullWidth
                  value={query}
                  label={<FormattedMessage id="ui.courses.filterByName" defaultMessage="ui.courses.filterByName" />}
                  variant="outlined"
                  onChange={handleOnChangeFilterName}
                  disabled={loading}
                  onKeyUp={(e) => {
                    e.preventDefault();
                    if (e.key === 'Enter') {
                      fetchCourses();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {isMobile ? (
                          <IconButton onClick={() => fetchCourses()} disabled={loading}>
                            <Icon>search</Icon>
                          </IconButton>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={() => fetchCourses()}
                            endIcon={<Icon>search</Icon>}
                            disabled={loading}
                          />
                        )}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              {((onlyStaffEnabled && canCreateCourse) || !onlyStaffEnabled) && (
                <Grid item>
                  <CoursesChipRoot
                    color={showMyCourses ? 'primary' : 'default'}
                    variant={showMyCourses ? 'filled' : 'outlined'}
                    label={<FormattedMessage id="ui.courses.filterByCreatedByMe" defaultMessage="ui.courses.filterByCreatedByMe" />}
                    onClick={() => setShowMyCourses(!showMyCourses)}
                    // @ts-expect-error this is needed to use showForMe into SCCourses
                    showForMe={showMyCourses}
                    deleteIcon={showMyCourses ? <Icon>close</Icon> : null}
                    onDelete={showMyCourses ? handleDeleteClick : null}
                    disabled={loading}
                  />
                </Grid>
              )}
              <Grid item xs={12} md="auto">
                <FormControl fullWidth>
                  <CategoryAutocomplete onChange={handleOnChangeCategory} className={classes.category} size="small" multiple={true} />
                </FormControl>
              </Grid>
              {authUserId && (
                <Grid item>
                  <CoursesChipRoot
                    color={showForMe ? 'primary' : 'default'}
                    variant={showForMe ? 'filled' : 'outlined'}
                    label={<FormattedMessage id="ui.courses.filterByCoursesForMe" defaultMessage="ui.courses.filterByCoursesForMe" />}
                    onClick={handleChipClick}
                    // @ts-expect-error this is needed to use showForMe into SCCourses
                    showForMe={showForMe}
                    deleteIcon={showForMe ? <Icon>close</Icon> : null}
                    onDelete={showForMe ? handleDeleteClick : null}
                    disabled={loading}
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      )}
      <>
        {loading ? (
          <Skeleton {...CoursesSkeletonComponentProps} CourseSkeletonProps={CourseSkeletonComponentProps} />
        ) : (
          <>
            {!courses.length ? (
              <Box className={classes.noResults}>
                {!canCreateCourse && onlyStaffEnabled ? (
                  <Stack className={classes.studentEmptyView}>
                    <Stack className={classes.emptyBox}>
                      <Stack className={classes.emptyRotatedBox}>
                        <Icon className={classes.emptyIcon} color="disabled" fontSize="large">
                          courses
                        </Icon>
                      </Stack>
                    </Stack>
                    <Typography variant="h5" textAlign="center">
                      <FormattedMessage id="ui.courses.empty.title" defaultMessage="ui.courses.empty.title" />
                    </Typography>
                    <Typography variant="body1" textAlign="center">
                      <FormattedMessage id="ui.courses.empty.info" defaultMessage="ui.courses.empty.info" />
                    </Typography>
                    <Skeleton
                      coursesNumber={4}
                      {...CoursesSkeletonComponentProps}
                      CourseSkeletonProps={CourseSkeletonComponentProps}
                      GridItemComponentProps={{md: 2}}
                    />
                  </Stack>
                ) : (
                  <Box className={classes.teacherEmptyView}>
                    <Skeleton
                      teacherView={(onlyStaffEnabled && canCreateCourse) || !onlyStaffEnabled}
                      coursesNumber={4}
                      {...CoursesSkeletonComponentProps}
                      CourseSkeletonProps={CourseSkeletonComponentProps}
                      GridItemComponentProps={{md: 2}}
                    />
                  </Box>
                )}
              </Box>
            ) : (
              <>
                <Grid container spacing={{xs: 2}} className={classes.courses} {...GridContainerComponentProps}>
                  <>
                    {courses.map((course: SCCourseType) => (
                      <Grid item xs={12} sm={12} md={6} lg={3} key={course.id} className={classes.item} {...GridItemComponentProps}>
                        <Course courseId={course.id} {...CourseComponentProps} />
                      </Grid>
                    ))}
                    {authUserId && courses.length % 2 !== 0 && (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={3}
                        key={'placeholder-item'}
                        className={classes.itemPlaceholder}
                        {...GridItemComponentProps}>
                        <CoursePlaceholder actionCreate={true} />
                      </Grid>
                    )}
                  </>
                </Grid>
                {Boolean(next) && (
                  <Button color="secondary" variant="text" onClick={handleNext} className={classes.showMore}>
                    <FormattedMessage id="ui.courses.button.seeMore" defaultMessage="ui.courses.button.seeMore" />
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
