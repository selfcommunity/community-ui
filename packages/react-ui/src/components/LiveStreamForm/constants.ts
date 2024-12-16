import {SCLiveStreamViewType} from '@selfcommunity/types';

export const PREFIX = 'SCLiveStreamForm';

/**
 * Default live stream settings
 */
export const LIVESTREAM_DEFAULT_SETTINGS = {
  muteParticipants: true,
  hideParticipantsList: false,
  automaticallyNotifyFollowers: false,
  disableVideo: true,
  disableChat: false,
  disableShareScreen: true,
  showInProfile: true,
  view: SCLiveStreamViewType.SPEAKER
};
