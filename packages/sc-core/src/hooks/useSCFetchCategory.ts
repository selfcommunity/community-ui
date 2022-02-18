import {useEffect, useMemo, useState} from 'react';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCategoryType, SCTagType} from '../types';
import http from '../utils/http';
import {Logger} from '../utils/logger';
import Endpoints from '../constants/Endpoints';

/**
 :::info
 This custom hook is used to fetch a category object.
 :::

 * @param id
 * @param category
 */
export default function useSCFetchCategory({id = null, category = null}: {id?: number; category?: SCCategoryType}) {
  const [scCategory, setSCCategory] = useState<SCCategoryType>(category);

  /**
   * Memoized fetchTag
   */
  const fetchCategory = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.Category.url({id: id}),
          method: Endpoints.Category.method,
        })
        .then((res: AxiosResponse<SCTagType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [id]
  );

  /**
   * If id attempt to get the category by id
   */
  useEffect(() => {
    if (id) {
      fetchCategory()
        .then((obj: SCCategoryType) => {
          setSCCategory(obj);
        })
        .catch((err) => {
          Logger.error(SCOPE_SC_CORE, `Category with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id]);

  return {scCategory, setSCCategory};
}
