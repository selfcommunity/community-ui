import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCTagType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '../utils/logger';
import {SCFeatures, SCPreferences, useSCPreferences, useSCUser} from '@selfcommunity/react-core';

/**
 :::info
 This custom hook is used to fetch the addressing tag list for the session user
 :::
*  @param object
 * @param object.fetch
 */
export default function useSCFetchAddressingTagList({fetch = false}: {fetch?: boolean}) {
  const [scAddressingTags, setSCAddressingTags] = useState<SCTagType[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  // HOOKS
  const scUserContext = useSCUser();
  const scPreferences = useSCPreferences();

  /**
   * Memoized fetchTag
   */
  const fetchAddressingTags = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.ComposerAddressingTagList.url(),
          method: Endpoints.ComposerAddressingTagList.method,
        })
        .then((res: HttpResponse<SCTagType[]>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    []
  );

  // load addressing tags
  useEffect(() => {
    if (!loaded && fetch && scUserContext.user && scPreferences.features.includes(SCFeatures.USER_TAGGING)) {
      fetchAddressingTags().then((obj: SCTagType[]) => {
        setLoaded(true);
        setSCAddressingTags(obj);
      });
    }
  }, [loaded, fetch, scUserContext.user, scPreferences.features]);

  return {scAddressingTags};
}
