import React, {ReactElement, useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {MEDIA_TYPE_VIDEO} from '../../../constants/Media';
import AutoPlayer from '../../AutoPlayer';
import Box from '@mui/material/Box';
import classNames from 'classnames';
import {PREFIX} from './constants';
import {BoxProps, CircularProgress} from '@mui/material';
import {SCMediaType} from '@selfcommunity/types/src/types';
import filter from './filter';

const classes = {
  displayRoot: `${PREFIX}-display-root`,
  displayLink: `${PREFIX}-link`,
  displayHtmlWrap: `${PREFIX}-html-wrap`,
  displayHtml: `${PREFIX}-html`,
  displayHtmlPlaceholder: `${PREFIX}-html-placeholder`,
  displayHtmlLoading: `${PREFIX}-html-loading`,
  displayVideo: `${PREFIX}-video`,
  thumbnail: `${PREFIX}-thumbnail`,
  thumbnailFullWidth: `${PREFIX}-thumbnail`,
  image: `${PREFIX}-image`,
  snippet: `${PREFIX}-snippet`,
  snippetTitle: `${PREFIX}-snippet-title`,
  snippetDescription: `${PREFIX}-snippet-description`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'DisplayRoot'
})(({theme}) => ({}));

export interface DisplayComponentProps extends BoxProps {
  /**
   * Medias
   */
  medias: SCMediaType[];
  /**
   * Handle full width option
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Handles on media click
   */
  onMediaClick?: (any) => void;
}
export default (props: DisplayComponentProps): ReactElement => {
  // PROPS
  const {className = '', medias, fullWidth = false, onMediaClick = null, ...rest} = props;

  // HANDLERS
  const handleLinkClick = (link) => {
    onMediaClick && onMediaClick(link);
  };

  // MEMO
  const _medias = useMemo(() => medias.filter(filter), [medias]);

  // RENDER

  /**
   * Renders link display
   * @param media
   * @param key
   */
  const renderPreview = (media: SCMediaType, key: number) => {
    // if (media.embed.metadata.html) {
    // 	return renderHtml(media, key);
    // }
    const domain = new URL(media.embed.metadata.url).hostname.replace('www.', '');
    return (
      <Box className={classes.displayLink} key={key}>
        {media.embed.metadata.images && media.embed.metadata.images.length > 0 && (
          <>
            {fullWidth ? (
              <Box
                className={classNames(classes.thumbnailFullWidth, classes.image)}
                style={{background: `url(${media.image})`, paddingBottom: `${100 / media.image_width / media.image_height}%`}}
              />
            ) : (
              <Box className={classNames(classes.thumbnail, classes.image)} style={{background: `url(${media.image})`}} />
            )}
          </>
        )}
        <Box className={classes.snippet}>
          <b className={classes.snippetTitle}>{media.embed.metadata.title}</b>
          <br />
          <p className={classes.snippetDescription}>{media.embed.metadata.description}</p>
          <a href={media.embed.metadata.url} target={'_blank'} onClick={() => handleLinkClick(media)}>
            {domain}
          </a>
        </Box>
        <div style={{clear: 'both'}}></div>
      </Box>
    );
  };

  /**
   * Render html embed
   * @param media
   * @param key
   */
  const renderHtml = (media: SCMediaType, key: number) => {
    return (
      <Box className={classes.displayHtmlWrap} key={key}>
        <div dangerouslySetInnerHTML={{__html: media.embed.metadata.html}} className={classes.displayHtml} />
        <div
          className={classes.displayHtmlPlaceholder}
          style={{paddingTop: `${(100 * media.embed.metadata.height) / media.embed.metadata.width}%`, maxHeight: media.embed.metadata.height}}>
          <CircularProgress size={20} className={classes.displayHtmlLoading} />
        </div>
      </Box>
    );
  };

  /**
   * Renders component
   */
  if (_medias.length === 0) {
    return null;
  }
  return (
    <Root className={classNames(className, classes.displayRoot)} {...rest}>
      {_medias.map((l, i) => {
        if (l.embed.metadata && l.embed.metadata.type === MEDIA_TYPE_VIDEO) {
          return <AutoPlayer url={l.url} width={'100%'} height={360} key={i} onVideoWatch={() => handleLinkClick(l)} />;
        }
        return <React.Fragment key={i}>{renderPreview(l, i)}</React.Fragment>;
      })}
    </Root>
  );
};
