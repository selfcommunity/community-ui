import {BaseSearchParams} from './baseParams';

/**
 * LiveStreamCreateParams interface
 */
export interface LiveStreamCreateParams {
  /**
   * A unique name for the live
   */
  name: string;
  /**
   * The livestream description
   */
  description?: string;
  /**
   * The users to invite to the group
   */
  invite_users?: number[];
  /**
   * The liveStream image
   */
  cover?: File;
  /**
   * The liveStream slug
   */
  slug?: string;
  /**
   * The livestream settings
   */
  settings?: Record<string, any>;
}

export interface LiveStreamSearchParams extends BaseSearchParams {
  /**
   * Id
   */
  id?: string | number;
  /**
   * 	Room name
   */
  room_name?: string;
  /**
   * Slug
   */
  slug?: string;
}

export interface LiveStreamRemoveParticipantParams {
  /**
   * Participant Id
   */
  participant_id?: string | number;
  /**
   * Ban participant
   */
  ban?: boolean;
}
