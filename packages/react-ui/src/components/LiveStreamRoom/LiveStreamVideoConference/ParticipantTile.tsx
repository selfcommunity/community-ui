import * as React from 'react';
import type {Participant} from 'livekit-client';
import {Track} from 'livekit-client';
import type {ParticipantClickEvent, TrackReferenceOrPlaceholder} from '@livekit/components-core';
import {isTrackReference, isTrackReferencePinned} from '@livekit/components-core';
import {
  AudioTrack,
  ConnectionQualityIndicator,
  FocusToggle,
  LockLockedIcon,
  ParticipantContext,
  ParticipantName,
  ScreenShareIcon,
  TrackMutedIndicator,
  TrackRefContext,
  useEnsureTrackRef,
  useFeatureContext,
  useIsEncrypted,
  useMaybeLayoutContext,
  useMaybeParticipantContext,
  useMaybeTrackRefContext,
  useParticipantTile,
  VideoTrack
} from '@livekit/components-react';
import ParticipantTileAvatar from './ParticipantTileAvatar';
import ParticipantTileActions from './ParticipantTileActions';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {useLiveStream} from './LiveStreamProvider';

/**
 * The `ParticipantContextIfNeeded` component only creates a `ParticipantContext`
 * if there is no `ParticipantContext` already.
 */
export function ParticipantContextIfNeeded(
  props: React.PropsWithChildren<{
    participant?: Participant;
  }>
) {
  const hasContext = !!useMaybeParticipantContext();
  return props.participant && !hasContext ? (
    <ParticipantContext.Provider value={props.participant}>{props.children}</ParticipantContext.Provider>
  ) : (
    <>{props.children}</>
  );
}

/**
 * Only create a `TrackRefContext` if there is no `TrackRefContext` already.
 */
export function TrackRefContextIfNeeded(
  props: React.PropsWithChildren<{
    trackRef?: TrackReferenceOrPlaceholder;
  }>
) {
  const hasContext = !!useMaybeTrackRefContext();
  return props.trackRef && !hasContext ? (
    <TrackRefContext.Provider value={props.trackRef}>{props.children}</TrackRefContext.Provider>
  ) : (
    <>{props.children}</>
  );
}

export interface ParticipantTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The track reference to display. */
  trackRef?: TrackReferenceOrPlaceholder;
  disableSpeakingIndicator?: boolean;
  disableTileActions?: boolean;
  onParticipantClick?: (event: ParticipantClickEvent) => void;
}

/**
 * The `ParticipantTile` component is the base utility wrapper for displaying a visual representation of a participant.
 * This component can be used as a child of the `TrackLoop` component or by passing a track reference as property.
 */
export const ParticipantTile: (props: ParticipantTileProps & React.RefAttributes<HTMLDivElement>) => React.ReactNode =
  /* @__PURE__ */ React.forwardRef<HTMLDivElement, ParticipantTileProps>(function ParticipantTile(
    {trackRef, children, onParticipantClick, disableSpeakingIndicator, disableTileActions = false, ...htmlProps}: ParticipantTileProps,
    ref
  ) {
    const scUserContext: SCUserContextType = useSCUser();

    const trackReference = useEnsureTrackRef(trackRef);

    const {elementProps} = useParticipantTile<HTMLDivElement>({
      htmlProps,
      disableSpeakingIndicator,
      onParticipantClick,
      trackRef: trackReference
    });
    const isEncrypted = useIsEncrypted(trackReference.participant);
    const layoutContext = useMaybeLayoutContext();
    const autoManageSubscription = useFeatureContext()?.autoSubscription;

    const handleSubscribe = React.useCallback(
      (subscribed: boolean) => {
        if (
          trackReference.source &&
          !subscribed &&
          layoutContext &&
          layoutContext.pin.dispatch &&
          isTrackReferencePinned(trackReference, layoutContext.pin.state)
        ) {
          layoutContext.pin.dispatch({msg: 'clear_pin'});
        }
      },
      [trackReference, layoutContext]
    );

    return (
      <div ref={ref} style={{position: 'relative'}} {...elementProps}>
        <TrackRefContextIfNeeded trackRef={trackReference}>
          <ParticipantContextIfNeeded participant={trackReference.participant}>
            {children ?? (
              <>
                {isTrackReference(trackReference) &&
                (trackReference.publication?.kind === 'video' ||
                  trackReference.source === Track.Source.Camera ||
                  trackReference.source === Track.Source.ScreenShare) ? (
                  <>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    <VideoTrack trackRef={trackReference} onSubscriptionStatusChanged={handleSubscribe} manageSubscription={autoManageSubscription} />
                  </>
                ) : (
                  isTrackReference(trackReference) && (
                    <>
                      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                      {/* @ts-ignore */}
                      <AudioTrack trackRef={trackReference} onSubscriptionStatusChanged={handleSubscribe} />
                    </>
                  )
                )}
                <div className="lk-participant-placeholder">
                  <ParticipantTileAvatar participant={trackReference.participant} />
                </div>
                <div className="lk-participant-metadata">
                  <div className="lk-participant-metadata-item">
                    {trackReference.source === Track.Source.Camera ? (
                      <>
                        {isEncrypted && <LockLockedIcon style={{marginRight: '0.25rem'}} />}
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        <TrackMutedIndicator
                          trackRef={{
                            participant: trackReference.participant,
                            source: Track.Source.Microphone
                          }}
                          show={'muted'}></TrackMutedIndicator>
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        <ParticipantName>{!disableTileActions && <ParticipantTileActions />}</ParticipantName>
                      </>
                    ) : (
                      <>
                        <ScreenShareIcon style={{marginRight: '0.25rem'}} />
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        <ParticipantName>&apos;s screen</ParticipantName>
                      </>
                    )}
                  </div>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <ConnectionQualityIndicator className="lk-participant-metadata-item" />
                </div>
              </>
            )}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <FocusToggle trackRef={trackReference} />
          </ParticipantContextIfNeeded>
        </TrackRefContextIfNeeded>
      </div>
    );
  });
