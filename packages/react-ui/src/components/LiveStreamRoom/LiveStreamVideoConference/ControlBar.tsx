import {Track, VideoPresets} from 'livekit-client';
import * as React from 'react';
import {supportsScreenSharing} from '@livekit/components-core';
import {
  ChatIcon,
  ChatToggle,
  GearIcon,
  LeaveIcon,
  MediaDeviceMenu,
  StartMediaButton,
  useLocalParticipantPermissions,
  useMaybeLayoutContext,
  usePersistentUserChoices
} from '@livekit/components-react';
import {TrackToggle} from './TrackToggle';
import {useMediaQuery} from '@mui/material';
import {SettingsMenuToggle} from './SettingsMenuToggle';
import {DisconnectButton} from './DisconnectButton';
import {mergeProps} from './utils';

/** @public */
export type ControlBarControls = {
  microphone?: boolean;
  camera?: boolean;
  chat?: boolean;
  screenShare?: boolean;
  leave?: boolean;
  settings?: boolean;
};

export interface ControlBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onDeviceError?: (error: {source: Track.Source; error: Error}) => void;
  variation?: 'minimal' | 'verbose' | 'textOnly';
  controls?: ControlBarControls;
  /**
   * If `true`, the user's device choices will be persisted.
   * This will enable the user to have the same device choices when they rejoin the room.
   */
  saveUserChoices?: boolean;
}

/**
 * The `ControlBar` prefab gives the user the basic user interface to control their
 * media devices (camera, microphone and screen share), open the `Chat` and leave the room.
 */
export function ControlBar({variation, controls, saveUserChoices = true, onDeviceError, ...props}: ControlBarProps) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const layoutContext = useMaybeLayoutContext();
  React.useEffect(() => {
    if (layoutContext?.widget.state?.showChat !== undefined) {
      setIsChatOpen(layoutContext?.widget.state?.showChat);
    }
  }, [layoutContext?.widget.state?.showChat]);
  const isTooLittleSpace = useMediaQuery(`(max-width: ${isChatOpen ? 1000 : 760}px)`);

  const defaultVariation = isTooLittleSpace ? 'minimal' : 'verbose';
  variation ??= defaultVariation;

  const visibleControls = {leave: true, ...controls};

  const localPermissions = useLocalParticipantPermissions();

  if (!localPermissions) {
    visibleControls.camera = false;
    visibleControls.chat = false;
    visibleControls.microphone = false;
    visibleControls.screenShare = false;
  } else {
    visibleControls.camera ??= localPermissions.canPublish;
    visibleControls.microphone ??= localPermissions.canPublish;
    visibleControls.screenShare ??= localPermissions.canPublish;
    visibleControls.chat ??= localPermissions.canPublishData && controls?.chat;
  }

  const showIcon = React.useMemo(() => variation === 'minimal' || variation === 'verbose', [variation]);
  const showText = React.useMemo(() => variation === 'textOnly' || variation === 'verbose', [variation]);

  const browserSupportsScreenSharing = supportsScreenSharing();

  const [isScreenShareEnabled, setIsScreenShareEnabled] = React.useState(false);

  const onScreenShareChange = React.useCallback(
    (enabled: boolean) => {
      setIsScreenShareEnabled(enabled);
    },
    [setIsScreenShareEnabled]
  );

  const htmlProps = mergeProps({className: 'lk-control-bar'}, props);

  const {saveAudioInputEnabled, saveVideoInputEnabled, saveAudioInputDeviceId, saveVideoInputDeviceId} = usePersistentUserChoices({
    preventSave: !saveUserChoices
  });

  const microphoneOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) => (isUserInitiated ? saveAudioInputEnabled(enabled) : null),
    [saveAudioInputEnabled]
  );

  const cameraOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) => (isUserInitiated ? saveVideoInputEnabled(enabled) : null),
    [saveVideoInputEnabled]
  );

  return (
    <div {...htmlProps}>
      {visibleControls.microphone && (
        <div className="lk-button-group">
          <>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <TrackToggle
              source={Track.Source.Microphone}
              showIcon={showIcon}
              onChange={microphoneOnChange}
              onDeviceError={(error) => onDeviceError?.({source: Track.Source.Microphone, error})}>
              {showText && 'Microphone'}
            </TrackToggle>
          </>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu kind="audioinput" onActiveDeviceChange={(_kind, deviceId) => saveAudioInputDeviceId(deviceId ?? '')} />
          </div>
        </div>
      )}
      {visibleControls.camera && (
        <div className="lk-button-group">
          <>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <TrackToggle
              source={Track.Source.Camera}
              showIcon={showIcon}
              onChange={cameraOnChange}
              onDeviceError={(error) => onDeviceError?.({source: Track.Source.Camera, error})}>
              {showText && 'Camera'}
            </TrackToggle>
          </>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu kind="videoinput" onActiveDeviceChange={(_kind, deviceId) => saveVideoInputDeviceId(deviceId ?? '')} />
          </div>
        </div>
      )}
      {visibleControls.screenShare && browserSupportsScreenSharing && (
        <>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <TrackToggle
            source={Track.Source.ScreenShare}
            captureOptions={{audio: true, selfBrowserSurface: 'include', surfaceSwitching: 'exclude'}}
            showIcon={showIcon}
            onChange={onScreenShareChange}
            onDeviceError={(error) => onDeviceError?.({source: Track.Source.ScreenShare, error})}>
            {showText && (isScreenShareEnabled ? 'Stop screen share' : 'Share screen')}
          </TrackToggle>
        </>
      )}

      {visibleControls.chat && (
        <>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <ChatToggle>
            {showIcon && <ChatIcon />}
            {showText && 'Chat'}
          </ChatToggle>
        </>
      )}
      {visibleControls.settings && (
        <>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <SettingsMenuToggle>
            {showIcon && <GearIcon />}
            {showText && 'Settings'}
          </SettingsMenuToggle>
        </>
      )}
      {visibleControls.leave && (
        <>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <DisconnectButton>
            {showIcon && <LeaveIcon />}
            {showText && 'Leave'}
          </DisconnectButton>
        </>
      )}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <StartMediaButton />
    </div>
  );
}
