import {SCUserType} from './user';
import {SCEventType} from './event';

export interface SCLiveStreamType {
  id?: number;
  title: string;
  description?: string;
  created_at?: Date | string;
  last_started_at?: Date | string;
  last_finished_at?: Date | string;
  closed_at_by_host?: Date | string;
  slug?: string;
  roomName?: string;
  settings?: Record<string, any>;
  host?: SCUserType;
  cover?: string;
  event?: SCEventType;
}

export enum SCLiveStreamViewType {
  GALLERY = 'gallery',
  SPEAKER = 'speaker'
}

export interface SCLiveStreamConnectionDetailsType {
  serverUrl: string;
  roomName: string;
  participantToken: string;
}

export enum SCLiveStreamConnectionDetailsErrorType {
  LIVE_STREAM_IS_CLOSED = 'LIVE_STREAM_IS_CLOSED',
  MONTHLY_MINUTE_LIMIT_REACHED = 'MONTHLY_MINUTE_LIMIT_REACHED',
  WAITING_HOST_TO_START_LIVE_STREAM = 'WAITING_HOST_TO_START_LIVE_STREAM',
  PARTICIPANTS_LIMIT_REACHED = 'PARTICIPANTS_LIMIT_REACHED',
  PARTICIPATE_THE_EVENT_TO_JOIN_LIVE_STREAM = 'PARTICIPATE_THE_EVENT_TO_JOIN_LIVE_STREAM',
  USER_BANNED_FOR_THIS_LIVE_STREAM = 'USER_BANNED_FOR_THIS_LIVE_STREAM'
}

export interface SCLiveStreamConnectionDetailsResponseErrorType {
  errors: [{code: SCLiveStreamConnectionDetailsErrorType}];
}

export interface SCLiveStreamSettingsType {
  muteParticipants?: boolean;
  disableVideo?: boolean;
  disableChat?: boolean;
  disableShareScreen?: boolean;
  hideParticipantsList?: boolean;
  automaticallyNotifyFollowers?: boolean;
  showInProfile?: boolean;
  view?: SCLiveStreamViewType;
}

export interface SCLiveStreamMonthlyDurationType {
  duration_total_minutes: number;
  max_minutes: number;
  remaining_minutes: number;
  minutes_exausted: boolean;
}
