import {createContext, useContext} from 'react';
import {SCLiveStreamType} from '@selfcommunity/types';

/**
 * Interface LiveStreamContextType
 */
export interface LiveStreamContextType {
  /**
   * Options
   */
  liveStream: SCLiveStreamType;
}

export const LiveStreamContext = createContext<LiveStreamContextType>({} as LiveStreamContextType);

/**
 * Let's only export the `useLiveStream` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useLiveStream(): LiveStreamContextType {
  return useContext(LiveStreamContext);
}
