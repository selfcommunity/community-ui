import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {SCEventLocationType, SCEventType, SCLiveStreamType} from '@selfcommunity/types';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {PREFIX} from './constants';
import EventForm from '../EventForm';
import LiveStreamSelector from './LiveStreamSelector/LiveStreamSelector';
import {CreateLiveStreamStep, LiveStreamType} from './types';
import LiveStreamForm from '../LiveStreamForm';
import {TransitionProps} from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import {Box, Button, Icon} from '@mui/material';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({
  paddingBottom: '0px !important',
  [`& .${classes.title}`]: {
    display: 'flex',
    alignItems: 'center'
  },
  [`& .${classes.content}`]: {
    paddingBottom: 0
  }
}));

export interface CreateLiveStreamDialogProps extends BaseDialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Open dialog
   * @default true
   */
  open?: boolean;
  /**
   * On dialog close callback function
   * @default null
   */
  onClose?: () => void;
  /**
   * On success callback function
   * @default null
   */
  onSuccess?: (data: SCEventType | SCLiveStreamType) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 *> API documentation for the Community-JS CreateLiveStreamDialog component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CreateLivestreamDialog} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCreateLivestreamDialog` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCreateLivestreamDialog-root|Styles applied to the root element.|
 |content|.SCCreateLivestreamDialog-content|Styles applied to the content element.|

 * @param inProps
 */
export default function CreateLiveStreamDialog(inProps: CreateLiveStreamDialogProps): JSX.Element {
  //PROPS
  const props: CreateLiveStreamDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, open = true, onClose, onSuccess, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  const canCreateLiveStream: boolean = useMemo(() => scUserContext?.user?.permission?.create_live_stream, [scUserContext?.user?.permission]);
  const canCreateEvent: boolean = useMemo(() => scUserContext?.user?.permission?.create_event, [scUserContext?.user?.permission]);

  // STATE
  const [step, setStep] = useState<CreateLiveStreamStep>(canCreateEvent ? CreateLiveStreamStep.SELECT_TYPE : CreateLiveStreamStep.CREATE_LIVE);
  const [liveType, setLiveType] = useState<LiveStreamType>(canCreateEvent ? null : LiveStreamType.DIRECT_LIVE);

  const canShowBackButton: boolean = useMemo(() => step === CreateLiveStreamStep.CREATE_LIVE && canCreateEvent, [step, canCreateEvent]);

  // HANDLER
  const handleLiveTypeSelected = useCallback((l) => {
    setLiveType(l);
  }, []);

  const handleLiveTypeSelectedNext = useCallback((l) => {
    setLiveType(l);
    setStep(CreateLiveStreamStep.CREATE_LIVE);
  }, []);

  const handleBack = useCallback(() => {
    setStep(CreateLiveStreamStep.SELECT_TYPE);
  }, []);

  const handleSubmit = useCallback((e: SCEventType | SCLiveStreamType) => {
    onSuccess && onSuccess(e);
  }, []);

  useEffect(() => {
    if (!canCreateEvent) {
      setLiveType(LiveStreamType.DIRECT_LIVE);
    }
  }, [canCreateEvent]);

  // user must be logged
  if (!scUserContext.user || !canCreateLiveStream) {
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <Root
      DialogContentProps={{dividers: false}}
      maxWidth="md"
      title={
        <Box className={classes.title} component="span">
          {canShowBackButton && (
            <Button variant="text" onClick={handleBack} startIcon={<Icon>arrow_back</Icon>}>
              <FormattedMessage id="ui.createLivestreamDialog.button.back" defaultMessage="ui.createLivestreamDialog.button.back" />
            </Button>
          )}
          <Box component="span">
            <FormattedMessage id="ui.createLivestreamDialog.title" defaultMessage="ui.createLivestreamDialog.title" />
          </Box>
        </Box>
      }
      fullWidth
      open={open}
      scroll="body"
      onClose={!canShowBackButton ? onClose : undefined}
      className={classNames(classes.root, className)}
      TransitionComponent={Transition}
      PaperProps={{elevation: 0}}
      {...rest}>
      <Box className={classes.content}>
        {step === CreateLiveStreamStep.SELECT_TYPE && (
          <LiveStreamSelector liveSelected={liveType} onLiveSelected={handleLiveTypeSelected} onNext={handleLiveTypeSelectedNext} />
        )}
        {step === CreateLiveStreamStep.CREATE_LIVE && (
          <>
            {liveType === LiveStreamType.EVENT_LIVE ? (
              <EventForm EventAddressComponentProps={{locations: [SCEventLocationType.LIVESTREAM]}} onSuccess={handleSubmit} />
            ) : (
              <LiveStreamForm onSuccess={handleSubmit} />
            )}
          </>
        )}
      </Box>
    </Root>
  );
}
