import * as React from 'react';
import type {TrackReferenceOrPlaceholder} from '@livekit/components-core';
import type {ParticipantClickEvent} from '@livekit/components-core';
import {ParticipantTile} from './ParticipantTile';
import {mergeProps} from './utils';

export type FocusLayoutContainerProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * The `FocusLayoutContainer` is a layout component that expects two children:
 * A small side component: In a video conference, this is usually a carousel of participants
 * who are not in focus. And a larger main component to display the focused participant.
 * For example, with the `FocusLayout` component.
 */
export function FocusLayoutContainer(props: FocusLayoutContainerProps) {
  const elementProps = mergeProps(props, {className: 'lk-focus-layout'});
  return <div {...elementProps}>{props.children}</div>;
}

export function FocusLayoutContainerNoParticipants(props: FocusLayoutContainerProps) {
  const elementProps = mergeProps(props, {className: 'lk-focus-layout'});
  return (
    <div {...elementProps} style={{gridTemplateColumns: 'none'}}>
      {props.children}
    </div>
  );
}

export interface FocusLayoutProps extends React.HTMLAttributes<HTMLElement> {
  /** The track to display in the focus layout. */
  trackRef?: TrackReferenceOrPlaceholder;
  onParticipantClick?: (evt: ParticipantClickEvent) => void;
}

/**
 * The `FocusLayout` component is just a light wrapper around the `ParticipantTile` to display a single participant.
 */
export function FocusLayout({trackRef, ...htmlProps}: FocusLayoutProps) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <ParticipantTile trackRef={trackRef} {...htmlProps} />;
}
