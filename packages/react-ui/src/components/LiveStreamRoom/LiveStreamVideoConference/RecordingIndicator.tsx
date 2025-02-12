'use client';
import {useIsRecording} from '@livekit/components-react';
import {useEffect, useState} from 'react';

/**
 * RecordingIndicator
 * @alpha
 */
export default function RecordingIndicator() {
  const isRecording = useIsRecording();
  const [wasRecording, setWasRecording] = useState(false);

  useEffect(() => {
    if (isRecording !== wasRecording) {
      setWasRecording(isRecording);
      if (isRecording) {
        window.alert('This meeting is being recorded');
      }
    }
  }, [isRecording]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        boxShadow: isRecording ? 'red 0px 0px 0px 3px inset' : 'none',
        pointerEvents: 'none'
      }}></div>
  );
}
