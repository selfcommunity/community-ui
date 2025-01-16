import {SCUserType} from '@selfcommunity/types';

export enum CreateLiveStreamStep {
  SELECT_TYPE = '_select_type',
  CREATE_LIVE = '_create_live'
}

export enum LiveStreamType {
	EVENT_LIVE = '_event_live',
	DIRECT_LIVE = '_direct_live'
}
