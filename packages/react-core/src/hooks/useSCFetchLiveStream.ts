import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {SCLiveStreamType} from '@selfcommunity/types';
import {CacheStrategies, Logger, LRUCache, objectWithoutProperties} from '@selfcommunity/utils';
import {useEffect, useMemo, useState} from 'react';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {useSCUser} from '../components/provider/SCUserProvider';
import {getLiveStreamObjectCacheKey} from '../constants/Cache';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserContextType} from '../types/context';

/**
 :::info
 This custom hook is used to fetch an liveStream object.
 :::
 * @param object
 * @param object.id
 * @param object.liveStream
 * @param object.cacheStrategy
 */
export default function useSCFetchLiveStream({
  id = null,
  liveStream = null,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number | string;
  liveStream?: SCLiveStreamType;
  cacheStrategy?: CacheStrategies;
}) {
  const __eventId = liveStream ? liveStream.id : id;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // CACHE
  const __liveStreamCacheKey = getLiveStreamObjectCacheKey(__eventId);
  const __liveStream = authUserId ? liveStream : objectWithoutProperties<SCLiveStreamType>(liveStream, ['subscription_status']);

  const [scLiveStream, setScLiveStream] = useState<SCLiveStreamType>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__liveStreamCacheKey, __liveStream) : null
  );
  const [error, setError] = useState<string>(null);

  /**
   * Memoized setSCLiveStream (auto-subscription if need it)
   */
  const setSCLiveStream = useMemo(
    () => (e: SCLiveStreamType) => {
      setScLiveStream(e);
      LRUCache.set(__liveStreamCacheKey, e);
    },
    [authUserId, setScLiveStream]
  );

  /**
   * Memoized fetchTag
   */
  const fetchLiveStream = useMemo(
    () => (id: string | number) => {
      return http
        .request({
          url: Endpoints.GetLiveStreamInfo.url({id}),
          method: Endpoints.GetLiveStreamInfo.method,
        })
        .then((res: HttpResponse<SCLiveStreamType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    []
  );

  /**
   * If id attempt to get the liveStream by id
   */
  useEffect(() => {
    if (id !== null && id !== undefined && !liveStream) {
      fetchLiveStream(id)
        .then((e: SCLiveStreamType) => {
          setSCLiveStream(e);
        })
        .catch((err) => {
          LRUCache.delete(__liveStreamCacheKey);
          setError(`LiveStream with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `LiveStream with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id, liveStream, authUserId]);

  useDeepCompareEffectNoCheck(() => {
    if (liveStream) {
      setSCLiveStream(liveStream);
    }
  }, [liveStream, authUserId]);

  return {scLiveStream, setSCLiveStream, error};
}
