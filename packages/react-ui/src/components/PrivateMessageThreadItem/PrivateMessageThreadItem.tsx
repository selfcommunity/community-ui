import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {ListItem, Typography, IconButton, Box, useTheme, Button} from '@mui/material';
import PrivateMessageThreadItemSkeleton from './Skeleton';
import {useIntl} from 'react-intl';
import {SCPrivateMessageThreadType, SCMessageFileType, SCPrivateMessageStatusType} from '@selfcommunity/types';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCThemeType, SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import useMediaQuery from '@mui/material/useMediaQuery';
import PrivateMessageSettingsIconButton from '../PrivateMessageSettingsIconButton';
import {bytesToSize} from '../../utils/sizeCoverter';
import BaseDialog from '../../shared/BaseDialog';
import LightBox from '../../shared/Lightbox';
import AutoPlayer from '../../shared/AutoPlayer';
import {useSnackbar} from 'notistack';
import {PREFIX} from './constants';
import {isSupportedVideoFormat} from '../../utils/thumbnailCoverter';

const classes = {
  root: `${PREFIX}-root`,
  username: `${PREFIX}-username`,
  text: `${PREFIX}-text`,
  img: `${PREFIX}-img`,
  document: `${PREFIX}-document`,
  video: `${PREFIX}-video`,
  other: `${PREFIX}-other`,
  iconButton: `${PREFIX}-icon-button`,
  messageTime: `${PREFIX}-message-time`,
  menuItem: `${PREFIX}-menu-item`,
  downloadButton: `${PREFIX}-download-button`,
  dialogRoot: `${PREFIX}-dialog-root`
};

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot'
})(() => ({}));

const Root = styled(ListItem, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface PrivateMessageThreadItemProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * PrivateMessageItem Object
   * @default null
   */
  message?: SCPrivateMessageThreadType;
  /**
   * Mouse Events to spread to the element
   */
  mouseEvents?: {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  };
  /**
   * Gets mouse hovering status
   * @default null
   */
  isHovering?: () => void;
  /**
   * Menu icon showed only for messages sent by logged user
   * @default false
   */
  showMenuIcon?: boolean;
  /**
   * Action triggered on menu icon click
   * @default null
   */
  onMenuIconClick?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS PrivateMessageItem component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageThreadItem} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageThreadItem` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageThreadItem-root|Styles applied to the root element.|
 |text|.SCPrivateMessageThreadItem-text|Styles applied to the message text element.|
 |img|.SCPrivateMessageThreadItem-img|Styles applied to the img element.|
 |document|.SCPrivateMessageThreadItem-document|Styles applied to the message file element.|
 |video|.SCPrivateMessageThreadItem-video|Styles applied to the message video element.|
 |other|.SCPrivateMessageThreadItem-other|Styles applied to other media type element.|
 |messageTime|.SCPrivateMessageThreadItem-message-time|Styles applied to the thread message time element.|
 |menuItem|.SCPrivateMessageThreadItem-menu-item|Styles applied to the thread message menu item element.|
 |dialogRoot|.SCPrivateMessageThreadItem-dialog-root|Styles applied to dialog root element.|


 * @param inProps
 */
export default function PrivateMessageThreadItem(inProps: PrivateMessageThreadItemProps): JSX.Element {
  // PROPS
  const props: PrivateMessageThreadItemProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {message = null, className = null, mouseEvents = {}, isHovering = null, showMenuIcon = false, onMenuIconClick = null, ...rest} = props;

  // INTL
  const intl = useIntl();

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const hasFile = message ? message.file : null;
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const {enqueueSnackbar} = useSnackbar();

  const getMouseEvents = (mouseEnter, mouseLeave) => ({
    onMouseEnter: mouseEnter,
    onMouseLeave: mouseLeave,
    onTouchStart: mouseEnter,
    onTouchMove: mouseLeave
  });

  const handleMenuItemClick = () => {
    onMenuIconClick();
  };

  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.url);
      const data = await response.blob();
      const blob = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = blob;
      link.download = file.filename;
      link.click();
      URL.revokeObjectURL(blob);
      link.remove();
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error, {
        variant: 'error',
        autoHideDuration: 3000
      });
    }
  };

  // RENDERING

  const renderMessageFile = (m) => {
    if (!m) {
      return null;
    }
    let section = null;
    const defaultSection = (
      <Box className={classes.other}>
        <Button onClick={() => handleDownload(m.file)} startIcon={<Icon>download</Icon>}>
          <Typography>{m.file.filename}</Typography>
          <Typography>{bytesToSize(m.file.filesize)}</Typography>
        </Button>
      </Box>
    );
    if (m.file) {
      let type = m.file.mimetype;
      switch (true) {
        case type.startsWith(SCMessageFileType.IMAGE):
          section = (
            <Box className={classes.img}>
              <img src={m.file.thumbnail} loading="lazy" alt={'img'} onClick={() => setOpenDialog(true)} />
            </Box>
          );
          break;
        case type.startsWith(SCMessageFileType.VIDEO):
          if (!isSupportedVideoFormat(m.file.filename)) {
            section = defaultSection;
          } else {
            section = (
              <Box className={classNames(classes.img, classes.video)}>
                <img src={m.file.thumbnail} loading="lazy" alt={'img'} />
                <IconButton onClick={() => setOpenDialog(true)}>
                  <Icon>play_circle_outline</Icon>
                </IconButton>
              </Box>
            );
          }
          break;
        case type.startsWith(SCMessageFileType.DOCUMENT):
          section = (
            <Box className={m.file.filename.endsWith('.pdf') ? classes.document : classes.other}>
              {m.file.filename.endsWith('.pdf') && <img src={m.file.thumbnail} loading="lazy" alt={'img'} />}
              <Button onClick={() => handleDownload(m.file)} startIcon={<Icon>download</Icon>}>
                <Typography>{m.file.filename}</Typography>
                <Typography>{bytesToSize(m.file.filesize)}</Typography>
              </Button>
            </Box>
          );
          break;
        default:
          // section = <Icon>hide_image</Icon>;
          section = defaultSection;
          break;
      }
    }
    return <>{section}</>;
  };

  if (!message) {
    return <PrivateMessageThreadItemSkeleton elevation={0} />;
  }
  /**
   * Renders root object
   */
  return (
    <Root
      className={classNames(classes.root, className)}
      {...getMouseEvents(mouseEvents.onMouseEnter, mouseEvents.onMouseLeave)}
      {...rest}
      secondaryAction={
        (isHovering || isMobile) &&
        showMenuIcon &&
        message.status !== SCPrivateMessageStatusType.HIDDEN && <PrivateMessageSettingsIconButton onMenuItemDeleteClick={handleMenuItemClick} />
      }>
      {message.group && scUserContext?.user?.username !== message.sender.username && (
        <Typography color="secondary" variant="h4" className={classes.username}>
          {message.sender.username}
        </Typography>
      )}
      <>
        {hasFile && message.status !== SCPrivateMessageStatusType.HIDDEN ? (
          renderMessageFile(message)
        ) : (
          <Box className={classes.text}>
            <Typography component="span" dangerouslySetInnerHTML={{__html: message.message}} />
          </Box>
        )}
        <Typography className={classes.messageTime} color="text.secondary">{`${intl.formatDate(message.created_at, {
          hour: 'numeric',
          minute: 'numeric'
        })}`}</Typography>
      </>
      {openDialog && (
        <>
          {message?.file.mimetype.startsWith(SCMessageFileType.VIDEO) ? (
            <DialogRoot open={openDialog} onClose={() => setOpenDialog(false)} className={classes.dialogRoot}>
              <AutoPlayer url={message?.file.url} width={'100%'} enableAutoplay={false} />
            </DialogRoot>
          ) : (
            <LightBox
              images={[{src: message?.file.url, key: message.file.uuid}]}
              onClose={() => setOpenDialog(false)}
              toolbarButtons={
                <IconButton key={'download'} onClick={() => handleDownload(message?.file)} className={classes.downloadButton}>
                  <Icon>download</Icon>
                </IconButton>
              }
            />
          )}
        </>
      )}
    </Root>
  );
}
