/**
 * Interface SCGroupEventType.
 * Event Schema.
 */
import {SCUserType} from './user';
import {SCLiveStreamType} from './liveStream';

/**
 * SCEventPrivacyType enum
 */
export enum SCEventPrivacyType {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

/**
 * SCGroupSubscriptionStatusType enum
 */
export enum SCEventSubscriptionStatusType {
  SUBSCRIBED = 'subscribed',
  REQUESTED = 'requested',
  INVITED = 'invited',
  GOING = 'going',
  NOT_GOING = 'not_going'
}

/**
 * SCEventLocationType enum
 */
export enum SCEventLocationType {
  PERSON = 'in person',
  ONLINE = 'virtual',
  LIVESTREAM = 'live_stream'
}

/**
 * SCEventLocationFilterType enum
 */
export enum SCEventLocationFilterType {
  ANY = 'any',
  PERSON = 'in person',
  ONLINE = 'virtual'
}

/**
 * SCEventRecurrenceType enum
 */
export enum SCEventRecurrenceType {
  NEVER = 'never',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

/**
 * SCEventRecurrenceType enum
 */
export enum SCEventDateFilterType {
  ANY = 'any',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEK = 'this_week',
  NEXT_WEEK = 'next_week',
  THIS_MONTH = 'this_month',
  PAST = 'past'
}

export interface SCEventType {
  /**
   * The ID of the event.
   */
  id: number;

  /**
   * The name of the event.
   */
  name: string;

  /**
   * The description of the event.
   */
  description: string;

  /**
   * The slug for the event.
   */
  slug: string;

  /**
   * The color of the event.
   */
  color: string;

  /**
   * The event privacy.
   */
  privacy: SCEventPrivacyType;

  /**
   * The event visibility.
   */
  visible: boolean;

  /**
   * The event active status.
   */
  active: boolean;

  /**
   * If the event is showed in the feed.
   */
  show_on_feed: boolean;

  /**
   * The event subscription status.
   */
  subscription_status: SCEventSubscriptionStatusType;

  /**
   * The event image, bigger format.
   */
  image_bigger: string;

  /**
   * The event image, big format.
   */
  image_big: string;

  /**
   * The event image, medium format.
   */
  image_medium: string;

  /**
   * The event image, small format.
   */
  image_small: string;

  /**
   * The number of event members
   */
  subscribers_counter: number;

  /**
   * The number of participating members
   */
  goings_counter: number;

  /**
   * The event start date.
   */
  start_date: string;

  /**
   * The event end date.
   */
  end_date: string | null;

  /**
   * If the event is currently running
   */
  running: boolean;

  /**
   *  The start date and time when the event running period began.
   */
  running_start_date: string;

  /**
   * The expected or actual end date and time for the event running period.
   */
  running_end_date: string;

  /**
   *  The start date  when the next event running period is scheduled to begin (for recurrent events).
   */
  next_start_date: string;

  /**
   * The end date for the next event running period (for recurrent events).
   */
  next_end_date: string;

  /**
   * The event recurrence
   */
  recurring: SCEventRecurrenceType;

  /**
   * The event location (in person, online)
   */
  location: SCEventLocationType;

  /**
   * The event live stream if exist
   */
  live_stream?: SCLiveStreamType;

  /**
   * The event place
   */
  geolocation: string | null;

  /**
   * The event latitude
   */
  geolocation_lat: number | null;

  /**
   * The event longitude
   */
  geolocation_lng: number | null;

  /**
   * The event link(if virtual)
   */

  link: string | null;

  /**
   * The event creation date.
   */
  created_at: string;

  /**
   * The event creator.
   */
  created_by: SCUserType;

  /**
   * The event admin.
   */
  managed_by: SCUserType;
}
