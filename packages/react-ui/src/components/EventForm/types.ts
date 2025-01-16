import {SCEventLocationType, SCEventRecurrenceType, SCLiveStreamType, SCLiveStreamSettingsType} from '@selfcommunity/types';

export type Place = {
  description: string;
  id?: string;
};

export type Geolocation = {
  location: SCEventLocationType;
  geolocation?: string;
  lat?: number;
  lng?: number;
  link?: string;
  liveStreamSettings?: SCLiveStreamSettingsType;
};

export type InitialFieldState = Geolocation & {
  imageOriginal: string | ArrayBuffer;
  imageOriginalFile: string | Blob;
  startDate: Date | null;
  startTime: Date | null;
  endDate: Date | null;
  endTime: Date | null;
  recurring: SCEventRecurrenceType;
  name: string;
  description: string;
  isPublic: boolean;
  isSubmitting: boolean;
};

export type FieldStateKeys = keyof InitialFieldState;

export type FieldStateValues = InitialFieldState[FieldStateKeys];
