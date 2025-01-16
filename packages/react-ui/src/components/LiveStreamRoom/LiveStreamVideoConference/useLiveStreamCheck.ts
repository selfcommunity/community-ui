import {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {LiveStreamApiClient} from '@selfcommunity/api-services';
import {useDisconnectButton, useParticipants} from '@livekit/components-react';
import {useLiveStream} from './LiveStreamProvider';
import {useSnackbar} from 'notistack';
import {useIntl} from 'react-intl';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {
  LIVE_CHECKING_INITIAL_DELAY_GUEST,
  LIVE_CHECKING_INITIAL_DELAY_HOST,
  LIVE_CHECKING_INTERVAL,
  WARNING_THRESHOLD_EXPIRING_SOON
} from '../constants';
import {RoomEvent} from 'livekit-client';

const _INITIAL_STATE = {
  checkStarted: false,
  timeRemaining: 60,
  isExpiringSoonAloneInRoom: false,
  isExpiringSoonMissingHost: false,
  isExpiringSoonFewMinutesRemaining: false,
  isExpiredSoonAloneInRoom: false,
  isExpiredSoonMissingHost: false,
  isExpiredSoonFewMinutesRemaining: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'startChecking':
      return {..._INITIAL_STATE, checkStarted: true};
    case 'stopChecking':
      return {..._INITIAL_STATE, checkStarted: false};
    case 'reset':
      return {..._INITIAL_STATE};
    case 'isExpiringSoonAloneInRoom':
      return {...state, isExpiringSoonAloneInRoom: action.value};
    case 'isExpiringSoonMissingHost':
      return {...state, isExpiringSoonMissingHost: action.value};
    case 'isExpiringSoonFewMinutesRemaining':
      return {...state, isExpiringSoonFewMinutesRemaining: action.value};
    case 'isExpiredAloneInRoom':
      return {...state, isExpiredAloneInRoom: action.value};
    case 'isExpiredSoonMissingHost':
      return {...state, isExpiredSoonMissingHost: action.value};
    case 'isExpiredSoonFewMinutesRemaining':
      return {...state, isExpiredSoonFewMinutesRemaining: action.value};
    case 'timeRemaining':
      return {...state, timeRemaining: action.value};
    default:
      return {...state, [action.type]: action.value};
  }
};

/**
 * Custom hook for monitoring livestream.
 * @param {number} warningThreshold
 * @param showWarnings
 * @param performDisconnect
 */
export function useLivestreamCheck(warningThreshold: number = WARNING_THRESHOLD_EXPIRING_SOON, showWarnings = true, performDisconnect = true) {
  // STATE
  const [state, dispatch] = useReducer(reducer, _INITIAL_STATE);
  const intervalRef = useRef(null);

  // HOOKS
  const scUserContext: SCUserContextType = useSCUser();
  const participants = useParticipants({
    updateOnlyOn: [
      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
      RoomEvent.ConnectionStateChanged,
      RoomEvent.Connected,
      RoomEvent.Disconnected,
      RoomEvent.TrackSubscribed,
      RoomEvent.TrackUnsubscribed
    ]
  });
  const {liveStream} = useLiveStream();
  const {buttonProps} = useDisconnectButton({});
  const {enqueueSnackbar} = useSnackbar();
  const __DEBUG = useRef(true);

  // INTL
  const intl = useIntl();

  /**
   * fetchLivestreamStatus
   */
  const fetchLivestreamStatus = () => {
    LiveStreamApiClient.getMonthlyDuration()
      .then((r) => {
        dispatch({type: 'timeRemaining', value: r.remaining_minutes});
        if (r.remaining_minutes > 0 && r.remaining_minutes <= warningThreshold) {
          if (
            !state.isExpiringSoonFewMinutesRemaining &&
            !state.isExpiredSoonFewMinutesRemaining &&
            liveStream.host.id === scUserContext.user.id &&
            showWarnings
          ) {
            __DEBUG && console.log('Warning: ');
            enqueueSnackbar(
              intl.formatMessage({id: 'ui.liveStreamRoom.check.fewMinutesRemaining', defaultMessage: 'ui.liveStreamRoom.check.fewMinutesRemaining'}),
              {
                variant: 'warning',
                autoHideDuration: 30000
              }
            );
            dispatch({type: 'isExpiringSoonFewMinutesRemaining', value: true});
          }
        } else if (r.remaining_minutes <= 0) {
          __DEBUG && console.log('Livestream expired');
          dispatch({type: 'isExpiredFewMinutesRemaining', value: true});
        } else if (state.isExpiredFewMinutesRemaining) {
          dispatch({type: 'isExpiringSoonFewMinutesRemaining', value: false});
        }
      })
      .catch((error) => {
        console.error('Error fetching live status:', error);
      });
  };

  /**
   * Check live
   */
  const check = useCallback(() => {
    if (__DEBUG) {
      console.log('Checking live status');
      console.log('Status: ', state);
      console.log('Checking participants...', participants.length);
      console.log(participants);
    }
    if (participants.length <= 1) {
      if (!state.isExpiringSoonAloneInRoom && !state.isExpiredAloneInRoom && showWarnings) {
        __DEBUG && console.log('Set expire soon: you are alone in the room');
        enqueueSnackbar(
          intl.formatMessage({id: 'ui.liveStreamRoom.check.youAreAloneInTheRoom', defaultMessage: 'ui.liveStreamRoom.check.youAreAloneInTheRoom'}),
          {variant: 'warning', autoHideDuration: 10000}
        );
        state.isExpiringSoonAloneInRoom
          ? dispatch({type: 'isExpiredAloneInRoom', value: true})
          : dispatch({type: 'isExpiringSoonAloneInRoom', value: true});
      } else if (performDisconnect && (state.isExpiringSoonAloneInRoom || state.isExpiredAloneInRoom)) {
        // Leave the room
        __DEBUG && console.log('Leave the room: no participants');
        buttonProps.onClick();
      }
      return;
    } else if (state.isExpiringSoonAloneInRoom) {
      __DEBUG && console.log('Reset expire soon');
      dispatch({type: 'isExpiringSoonAloneInRoom', value: false});
    }
    __DEBUG && console.log('Checking live speaker...');
    const speaker = participants.find((pt) => {
      return pt.name === liveStream.host.username;
    });
    if (!speaker) {
      if (!state.isExpiredSoonMissingHost && !state.isExpiringSoonMissingHost && liveStream.host.id !== scUserContext.user.id && showWarnings) {
        enqueueSnackbar(intl.formatMessage({id: 'ui.liveStreamRoom.check.hostMissing', defaultMessage: 'ui.liveStreamRoom.check.hostMissing'}), {
          variant: 'warning',
          autoHideDuration: 10000
        });
        state.isExpiringSoonMissingHost
          ? dispatch({type: 'isExpiredSoonMissingHost', value: true})
          : dispatch({type: 'isExpiringSoonMissingHost', value: true});
      } else if (performDisconnect && (state.isExpiredSoonMissingHost || state.isExpiringSoonMissingHost)) {
        // Leave the room
        __DEBUG && console.log('Leave the room: no host');
        buttonProps.onClick();
      }
    } else if (state.isExpiringSoonMissingHost) {
      dispatch({type: 'isExpiringSoonMissingHost', value: false});
    }
    __DEBUG && console.log('Checking live status resources...');
    fetchLivestreamStatus();
  }, [state, buttonProps, participants]);

  /**
   * Check live status
   */
  useEffect(() => {
    if (state.checkStarted) {
      intervalRef.current = setInterval(check, LIVE_CHECKING_INTERVAL * 60000);
    }
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [state, participants]);

  /**
   * Start the checking after a delay
   */
  useEffect(() => {
    let _timeout: NodeJS.Timeout;
    if (liveStream) {
      _timeout = setTimeout(() => {
        // Start the checking after 5 minutes
        dispatch({type: 'startChecking'});
        __DEBUG && console.log('Start checking');
      }, (liveStream.host.id === scUserContext.user.id ? LIVE_CHECKING_INITIAL_DELAY_HOST : LIVE_CHECKING_INITIAL_DELAY_GUEST) * 60000);
    }
    return () => {
      _timeout && clearTimeout(_timeout);
      dispatch({type: 'stopChecking'});
    };
  }, [liveStream]);

  return state;
}
