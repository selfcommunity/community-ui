import React from 'react';
import {SCComposerMediaActionType} from '../../../../types/composer';
import Button from './Button';
import Component from './Component';
import {MEDIA_TYPE_DOCUMENT} from '../../../../constants/Media';
import {SCMediaType} from '@selfcommunity/core';

const Document: SCComposerMediaActionType = {
  name: 'document',
  button: (props) => <Button {...props} />,
  component: (props) => <Component {...props} />,
  filter: (media: SCMediaType): boolean => media.type === MEDIA_TYPE_DOCUMENT
};

export default Document;
