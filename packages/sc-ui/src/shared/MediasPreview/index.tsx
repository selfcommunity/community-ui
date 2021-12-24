import React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {SCMediaObjectType} from '../../types/media';
import Document from '../Media/Document';
import Image from '../Media/Image';
import Link from '../Media/Link';
import Share from '../Media/Share';

const PREFIX = 'SCMedias';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  position: 'relative',
  marginTop: 0,
  marginBottom: theme.spacing(),
  marginLeft: -23,
  marginRight: -23
}));

export default ({
  medias,
  mediaObjectTypes = [Image, Document, Link, Share],
  ...rest
}: {
  medias: Array<any>;
  mediaObjectTypes?: Array<SCMediaObjectType>;
  [p: string]: any;
}): JSX.Element => {
  if (!medias.length) {
    /**
     * Feed without any medias:
     * don't render anything
     */
    return null;
  }

  /**
   * Render list of media preview
   * The adornment prop is used to insert the controls
   * for re-editing the media at the top of the group of elements
   */
  return (
    <Root {...rest}>
      {mediaObjectTypes.map((mediaObject: SCMediaObjectType) => {
        const {previewProps = {}} = mediaObject;
        return (
          <div key={mediaObject.name}>
            <mediaObject.previewComponent medias={medias.filter(mediaObject.filter)} {...previewProps} />
          </div>
        );
      })}
    </Root>
  );
};
