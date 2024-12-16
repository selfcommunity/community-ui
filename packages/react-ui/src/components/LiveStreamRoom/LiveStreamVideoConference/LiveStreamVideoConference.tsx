import {Box, BoxProps, Button, CircularProgress, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {SCLiveStreamViewType} from '@selfcommunity/types';
import classNames from 'classnames';
import {PREFIX} from './constants';
import {
  ConnectionState,
  formatChatMessageLinks,
  LayoutContextProvider,
  LiveKitRoom,
  LiveKitRoomProps,
  LocalUserChoices,
  VideoConferenceProps
} from '@livekit/components-react';
import {VideoCodec, RoomConnectOptions} from 'livekit-client';
import React, {useCallback, useMemo, useState} from 'react';
import {ConnectionDetails} from '../types';
import {defaultUserChoices} from '@livekit/components-core';
import {defaultVideoOptions} from '../constants';
import {FormattedMessage} from 'react-intl';
import {VideoConference} from './VideoConference';
import {useLiveStream} from './LiveStreamProvider';
import DialogContent from '@mui/material/DialogContent';
import BaseDialog from '../../../shared/BaseDialog';
import {closeSnackbar} from 'notistack';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  endConferenceWrap: `${PREFIX}-end-conference-wrap`,
  btnBackHome: `${PREFIX}-btn-back-home`,
  actions: `${PREFIX}-actions`,
  error: `${PREFIX}-error`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(({theme}) => ({}));

export interface LiveStreamVideoConferenceProps extends BoxProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * User choices
   */
  userChoices?: LocalUserChoices;

  /**
   * Connection details, include
   *       serverUrl: serverUrl,
   *       roomName: roomName,
   *       participantToken: participantToken,
   *       participantName: participantName
   */
  connectionDetails?: ConnectionDetails;

  /**
   * Override video options
   */
  options?: {
    hq: boolean;
    codec: VideoCodec;
  };

  /**
   * onLeave room callback
   */
  handleOnLeaveRoom?: () => void;

  /**
   * Props to spread to LiveKitRoomComponent
   * @default {}
   */
  LiveKitRoomComponentProps?: LiveKitRoomProps;

  /**
   * Props to spread to VideoConferenceComponent
   * @default {}
   */
  VideoConferenceComponentProps?: VideoConferenceProps;

  /**
   * Element to be inserted before end conference content
   */
  startConferenceEndContent?: React.ReactNode | null;

  /**
   * Element to be inserted after end conference content
   */
  endConferenceEndContent?: React.ReactNode | null;

  /**
   * Any other properties
   */
  [p: string]: any;
}

const PREFERENCES = [SCPreferences.LOGO_NAVBAR_LOGO];

/**
 *> API documentation for the Community-JS LiveStreamVideoConference component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {LiveStreamVideoConference} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `LiveStreamVideoConference` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLiveStreamForm-root|Styles applied to the root element.|

 * @param inProps
 */
export default function LiveStreamVideoConference(inProps: LiveStreamVideoConferenceProps): JSX.Element {
  //PROPS
  const props: LiveStreamVideoConferenceProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className,
    handleOnLeaveRoom,
    userChoices = defaultUserChoices,
    connectionDetails = {},
    LiveKitRoomComponentProps = {
      /* simulateParticipants: true */
    },
    VideoConferenceComponentProps = {},
    startConferenceEndContent,
    endConferenceEndContent,
    options = defaultVideoOptions,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const {liveStream} = useLiveStream();

  // STATE
  const [liveActive, setLiveActive] = useState(true);
  const [error, setError] = useState(null);

  // PREFERENCES
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  // PERMISSIONS
  const canUseAudio = useMemo(
    () =>
      scUserContext.user && liveStream && (liveStream.host.id === scUserContext.user.id || (liveStream && !liveStream?.settings?.muteParticipants)),
    [scUserContext, liveStream]
  );
  const canUseVideo = useMemo(
    () => scUserContext.user && liveStream && (liveStream.host.id === scUserContext.user.id || (liveStream && !liveStream?.settings?.disableVideo)),
    [scUserContext, liveStream]
  );
  const canUseChat = useMemo(() => scUserContext.user && liveStream && liveStream && !liveStream?.settings?.disableChat, [scUserContext, liveStream]);
  const canUseShareScreen = useMemo(
    () =>
      scUserContext.user && liveStream && (liveStream.host.id === scUserContext.user.id || (liveStream && !liveStream?.settings?.disableShareScreen)),
    [scUserContext, liveStream]
  );
  const speakerFocused = useMemo(
    () => (scUserContext.user && liveStream && liveStream.settings.view === SCLiveStreamViewType.SPEAKER ? liveStream.host : null),
    [scUserContext, liveStream]
  );
  const hideParticipantsList = useMemo(
    () => scUserContext.user && liveStream && liveStream?.settings?.hideParticipantsList && liveStream.host.id !== scUserContext.user.id,
    [scUserContext, liveStream]
  );

  // CONNECT OPTIONS
  const connectOptions = useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true
    };
  }, []);

  // HANDLERS
  /**
   * Handle on leave
   */
  const handleOnLeave = useCallback(() => {
    setLiveActive(false);
    handleOnLeaveRoom?.();
  }, [handleOnLeaveRoom]);

  /**
   * Handle on error
   */
  const handleError = useCallback((error: Error) => {
    console.error(error);
    if (error.message !== 'Client initiated disconnect') {
      setError(`Encountered an unexpected error, check the console logs for details: ${error.message}`);
    }
    setLiveActive(false);
  }, []);

  /**
   * Handle encryption error
   */
  const handleEncryptionError = useCallback((error: Error) => {
    console.error(error);
    setError(`Encountered an unexpected encryption error, check the console logs for details: ${error.message}`);
    setLiveActive(false);
  }, []);

  const handleBackHome = useCallback(() => {
    closeSnackbar();
  }, [closeSnackbar]);

  /**
   * User must be authenticated
   */
  if (!scUserContext.user || !connectionDetails) {
    return <CircularProgress />;
  }

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {liveActive && !error ? (
        <>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <LiveKitRoom
            connect={Boolean(liveActive)}
            token={connectionDetails['participantToken']}
            serverUrl={connectionDetails['serverUrl']}
            connectOptions={connectOptions}
            video={userChoices.videoEnabled}
            audio={userChoices.audioEnabled}
            onDisconnected={handleOnLeave}
            onEncryptionError={handleEncryptionError}
            onError={handleError}
            {...LiveKitRoomComponentProps}>
            <LayoutContextProvider>
              <VideoConference
                chatMessageFormatter={formatChatMessageLinks}
                {...(speakerFocused && {speakerFocused: liveStream.host})}
                {...VideoConferenceComponentProps}
                disableMicrophone={!canUseAudio}
                disableCamera={!canUseVideo}
                disableChat={!canUseChat}
                disableShareScreen={!canUseShareScreen}
                hideParticipantsList={hideParticipantsList}
              />
              {/* <RecordingIndicator /> */}
              {/* <EventInviteButton eventId={129} /> */}
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <ConnectionState />
            </LayoutContextProvider>
          </LiveKitRoom>
        </>
      ) : (
        <>
          {error ? (
            <DialogRoot open maxWidth={'md'} fullWidth>
              <DialogContent>
                <Box className={classes.endConferenceWrap}>
                  <Link to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})} className={classes.logo}>
                    <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO]} alt="logo"></img>
                  </Link>
                  {startConferenceEndContent}
                  {error}
                  <Button variant="contained" color="secondary" component={Link} to={'/'} className={classes.btnBackHome}>
                    <FormattedMessage id="ui.liveStreamRoom.button.backHome" defaultMessage="ui.liveStreamRoom.button.backHome" />
                  </Button>
                  {endConferenceEndContent}
                </Box>
              </DialogContent>
            </DialogRoot>
          ) : liveActive === false ? (
            <DialogRoot open maxWidth={'md'} fullWidth>
              <DialogContent>
                <Box className={classes.endConferenceWrap}>
                  <Link to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})} className={classes.logo}>
                    <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO]} alt="logo"></img>
                  </Link>
                  {startConferenceEndContent}
                  <Typography variant="h5">
                    <FormattedMessage id="ui.liveStreamRoom.conference.end" defaultMessage="ui.liveStreamRoom.conference.end" />
                  </Typography>
                  <Button variant="contained" color="secondary" component={Link} to={'/'} onClick={handleBackHome} className={classes.btnBackHome}>
                    <FormattedMessage id="ui.liveStreamRoom.button.backHome" defaultMessage="ui.liveStreamRoom.button.backHome" />
                  </Button>
                  {endConferenceEndContent}
                </Box>
              </DialogContent>
            </DialogRoot>
          ) : (
            <CircularProgress />
          )}
        </>
      )}
    </Root>
  );
}
