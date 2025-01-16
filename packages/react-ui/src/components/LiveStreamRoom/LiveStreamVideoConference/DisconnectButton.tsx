import * as React from 'react';
import {useDisconnectButton} from '@livekit/components-react';
import {useCallback, useMemo, useState} from 'react';
import {LiveStreamApiClient} from '@selfcommunity/api-services';
import {useLiveStream} from './LiveStreamProvider';
import {FormattedMessage} from 'react-intl';
import {Checkbox, FormControlLabel, FormGroup} from '@mui/material';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import ConfirmDialog from '../../../shared/ConfirmDialog/ConfirmDialog';

/** @public */
export interface DisconnectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  stopTracks?: boolean;
}

/**
 * The `DisconnectButton` is a basic html button with the added ability to disconnect from a LiveKit room.
 * Normally this is the big red button that allows end users to leave the video or audio call.
 */
export const DisconnectButton: (props: DisconnectButtonProps & React.RefAttributes<HTMLButtonElement>) => React.ReactNode =
  /* @__PURE__ */ React.forwardRef<HTMLButtonElement, DisconnectButtonProps>(function DisconnectButton(props: DisconnectButtonProps, ref) {
    // CONTEXT
    const {liveStream} = useLiveStream();
    const scUserContext: SCUserContextType = useSCUser();

    // STATE
    const [closeLive, setCloseLive] = useState<boolean>(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const {buttonProps} = useDisconnectButton(props);
    const {onClick, ...rest} = buttonProps;

    /**
     * Intercept fist leave action
     */
    const handleOnLeave = useCallback(() => {
      if (liveStream && scUserContext.user.id === liveStream.host.id) {
        setOpenConfirmDialog(true);
      } else {
        onClick?.();
      }
    }, [setOpenConfirmDialog, liveStream, scUserContext.user]);

    /**
     * Control close live
     */
    const handleChangeCloseLive = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setCloseLive(event.target.checked);
      },
      [closeLive]
    );

    /**
     * Perform set liveStream as closed
     */
    const performCloseLiveStream = useMemo(
      () => async () => {
        const res = await LiveStreamApiClient.close(liveStream.id);
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        return await Promise.resolve(res.data);
      },
      [liveStream]
    );

    /**
     * Perform patch liveStream before leave the live
     */
    const handleLeaveAction = () => {
      if (!isUpdating && liveStream && scUserContext.user.id === liveStream.host.id && closeLive) {
        setIsUpdating(true);
        performCloseLiveStream()
          .then(() => {
            onClick?.();
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        onClick?.();
      }
    };

    return (
      <>
        <button ref={ref} {...rest} onClick={handleOnLeave}>
          {props.children}
        </button>
        {openConfirmDialog && (
          <ConfirmDialog
            open={openConfirmDialog}
            title={<></>}
            content={
              <>
                <FormattedMessage id="ui.liveStreamRoom.live.terminate" defaultMessage="ui.liveStreamRoom.live.terminate" />
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={closeLive} onChange={handleChangeCloseLive} inputProps={{'aria-label': 'controlled'}} />}
                    label={
                      <FormattedMessage
                        id="ui.liveStreamRoom.live.terminatePermanently"
                        defaultMessage="ui.liveStreamRoom.live.terminatePermanently"
                      />
                    }
                  />
                </FormGroup>
              </>
            }
            onConfirm={handleLeaveAction}
            isUpdating={isUpdating}
            onClose={() => setOpenConfirmDialog(false)}
          />
        )}
      </>
    );
  });
