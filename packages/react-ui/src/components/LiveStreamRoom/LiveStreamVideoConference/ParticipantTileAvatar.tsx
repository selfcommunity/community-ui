import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Box} from '@mui/material';
import classNames from 'classnames';
import {SCUserType} from '@selfcommunity/types';
import ParticipantPlaceholder from './ParticipantPlaceholder';
import {SCContextType, useSCContext} from '@selfcommunity/react-core';

const PREFIX = 'SCParticipantTileAvatar';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  height: 'auto !important',
  '& img': {
    borderRadius: '50%',
    width: 100,
    height: 100
  }
}));

export interface ParticipantTileAvatarProps {
  className?: string;
  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  /**
   * User Object
   * @default null
   */
  participant?: any;
}

export default function ParticipantTileAvatar(inProps: ParticipantTileAvatarProps): JSX.Element {
  // PROPS
  const props: ParticipantTileAvatarProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, user, participant, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();

  // RENDER
  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {user ? (
        <img src={`${user.avatar}`} />
      ) : participant && participant.identity ? (
        <img src={`${scContext.settings.portal}/api/v2/avatar/${participant.identity}`} />
      ) : (
        <ParticipantPlaceholder />
      )}
    </Root>
  );
}
