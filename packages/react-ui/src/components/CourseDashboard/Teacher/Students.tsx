import {SCCourseType, SCUserType} from '@selfcommunity/types';
import {memo, useCallback, useEffect, useReducer} from 'react';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import CourseUsersTable from '../../../shared/CourseUsersTable';
import {CourseService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCCache, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../../utils/widget';
import {DEFAULT_PAGINATION_OFFSET} from '../../../constants/Pagination';

const headerCells = [
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.name'
  },
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.progress'
  },
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.registration'
  },
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.latestActivity'
  },
  {}
];

interface StudentsProps {
  course: SCCourseType | null;
  endpointQueryParams?: Record<string, string | number>;
}

function Students(props: StudentsProps) {
  // PROPS
  const {course, endpointQueryParams = {limit: 6, offset: DEFAULT_PAGINATION_OFFSET}} = props;

  // STATES
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_PARTECIPANTS_COURSES_STATE_CACHE_PREFIX_KEY, course?.id),
      cacheStrategy: CacheStrategies.CACHE_FIRST,
      visibleItems: endpointQueryParams.limit
    },
    stateWidgetInitializer
  );

  // HOOKS
  const scUserContext: SCUserContextType = useSCUser();

  // CALLBACKS
  const _init = useCallback(() => {
    if (!state.initialized && !state.isLoadingNext) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});

      CourseService.getCourseDashboardUsers(course.id, {...endpointQueryParams})
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [state.isLoadingNext, state.initialized, course, dispatch]);

  // EFFECTS
  useEffect(() => {
    let _t: NodeJS.Timeout;

    if (scUserContext.user && course) {
      _t = setTimeout(_init);

      return () => {
        clearTimeout(_t);
      };
    }
  }, [scUserContext.user, course, _init]);

  return <CourseUsersTable course={course} state={state} dispatch={dispatch} headerCells={headerCells} />;
}

export default memo(Students);
