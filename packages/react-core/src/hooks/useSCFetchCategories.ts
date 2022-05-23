import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCategoryType} from '@selfcommunity/types';
import {http, Endpoints} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {singletonHook} from 'react-singleton-hook';

const init = {categories: [], isLoading: true};

/**
 :::info
 This custom hook is used to fetch categories.

 :::tipContext can be consumed in this way:

 ```jsx
 const {categories, isLoading} = useSCFetchCategories();
 ```
 :::
 */
const useSCFetchCategories = singletonHook(init, () => {
  const [data, setData] = useState<{categories: SCCategoryType[]; isLoading: boolean}>(init);

  /**
   * Fetch categories
   */
  const fetchCategories = async (next: string = Endpoints.CategoryList.url()): Promise<[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.CategoryList.method,
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchCategories(data.next));
    }
    return data.results;
  };

  /**
   * Get categories
   */
  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setData({categories: data, isLoading: false});
      })
      .catch((error) => {
        console.log(error);
        Logger.error(SCOPE_SC_CORE, 'Unable to retrieve categories');
      });
  }, []);

  return data;
});

export default useSCFetchCategories;
