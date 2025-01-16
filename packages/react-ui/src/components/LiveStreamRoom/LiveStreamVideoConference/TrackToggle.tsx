import type {CaptureOptionsBySource, ToggleSource} from '@livekit/components-core';
import * as React from 'react';
import {Track, TrackPublishOptions} from 'livekit-client';
import {
  useTrackToggle,
  CameraIcon,
  CameraDisabledIcon,
  MicDisabledIcon,
  MicIcon,
  ScreenShareIcon,
  ScreenShareStopIcon
} from '@livekit/components-react';

export function getSourceIcon(source: Track.Source, enabled: boolean) {
  switch (source) {
    case Track.Source.Microphone:
      return enabled ? <MicIcon /> : <MicDisabledIcon />;
    case Track.Source.Camera:
      return enabled ? <CameraIcon /> : <CameraDisabledIcon />;
    case Track.Source.ScreenShare:
      return enabled ? <ScreenShareStopIcon /> : <ScreenShareIcon />;
    default:
      return undefined;
  }
}

export interface TrackToggleProps<T extends ToggleSource> extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  source: T;
  showIcon?: boolean;
  initialState?: boolean;
  disabled?: boolean;
  /**
   * Function that is called when the enabled state of the toggle changes.
   * The second function argument `isUserInitiated` is `true` if the change was initiated by a user interaction, such as a click.
   */
  onChange?: (enabled: boolean, isUserInitiated: boolean) => void;
  captureOptions?: CaptureOptionsBySource<T>;
  publishOptions?: TrackPublishOptions;
  onDeviceError?: (error: Error) => void;
}

/**
 * With the `TrackToggle` component it is possible to mute and unmute your camera and microphone.
 * The component uses an html button element under the hood so you can treat it like a button.
 */
export const TrackToggle: <T extends ToggleSource>(props: TrackToggleProps<T> & React.RefAttributes<HTMLButtonElement>) => React.ReactNode =
  /* @__PURE__ */ React.forwardRef(function TrackToggle<T extends ToggleSource>(
    {showIcon, disabled, ...props}: TrackToggleProps<T>,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) {
    const {buttonProps, enabled} = useTrackToggle(props);
    return (
      <button ref={ref} {...buttonProps} disabled={disabled}>
        {(showIcon ?? true) && getSourceIcon(props.source, enabled && !disabled)}
        {props.children}
      </button>
    );
  });
