import {Box, Divider, MenuItem, styled, Typography} from '@mui/material';
import {Link, SCPreferences, SCPreferencesContext, SCPreferencesContextType, SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import React, {useContext} from 'react';
import {useThemeProps} from '@mui/system';
import {SCHeaderMenuUrlsType} from '../../types';
import classNames from 'classnames';
import {UserService} from '@selfcommunity/api-services';

const PREFIX = 'SCHeaderMenu';

const classes = {
  root: `${PREFIX}-root`,
  menuItem: `${PREFIX}-menu-item`
};
const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface HeaderMenuProps {
  /**
   * The single pages url
   */
  url?: SCHeaderMenuUrlsType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function HeaderMenu(inProps: HeaderMenuProps) {
  // PROPS
  const props: HeaderMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, url, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;
  const roles = scUserContext.user && scUserContext.user.role;
  const isAdmin = roles && roles.includes('admin');
  const isModerator = roles && roles.includes('moderator');

  /**
   * Fetches paltform url
   * @param query
   */
  const fetchPlatform = (query) => {
    UserService.getCurrentUserPlatform(query).then((res) => {
      const platformUrl = res.platform_url;
      window.open(platformUrl, '_blank').focus();
    });
  };

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {url && url.profile && (
        <MenuItem className={classes.menuItem} key={'profile'} component={Link} to={url.profile}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.profile" defaultMessage="ui.header.menuItem.profile" />
          </Typography>
        </MenuItem>
      )}
      {followEnabled && url && url.followings && (
        <MenuItem className={classes.menuItem} key={'followings'} component={Link} to={url.followings}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.followings" defaultMessage="ui.header.menuItem.followings" />
          </Typography>
        </MenuItem>
      )}
      {followEnabled && url && url.followers && (
        <MenuItem className={classes.menuItem} key={'followers'} component={Link} to={url.followers}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.followers" defaultMessage="ui.header.menuItem.followers" />
          </Typography>
        </MenuItem>
      )}
      {!followEnabled && url && url.connections && (
        <MenuItem className={classes.menuItem} key={'followers'} component={Link} to={url.connections}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.connections" defaultMessage="ui.header.menuItem.connections" />
          </Typography>
        </MenuItem>
      )}
      {url && url.loyalty && (
        <MenuItem className={classes.menuItem} key={'loyaltyProgram'} component={Link} to={url.loyalty}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.loyalty" defaultMessage="ui.header.menuItem.loyalty" />
          </Typography>
        </MenuItem>
      )}
      {url && url.peopleSuggestion && (
        <MenuItem className={classes.menuItem} key={'suggestedPeople'} component={Link} to={url.peopleSuggestion}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.interestingPeople" defaultMessage="ui.header.menuItem.interestingPeople" />
          </Typography>
        </MenuItem>
      )}
      {url && url.followedPosts && (
        <MenuItem className={classes.menuItem} key={'followedPosts'} component={Link} to={url.followedPosts}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.postsFollowed" defaultMessage="ui.header.menuItem.postsFollowed" />
          </Typography>
        </MenuItem>
      )}
      {url && url.followedDiscussions && (
        <MenuItem className={classes.menuItem} key={'followedDiscussions'} component={Link} to={url.followedDiscussions}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.discussionsFollowed" defaultMessage="ui.header.menuItem.discussionsFollowed" />
          </Typography>
        </MenuItem>
      )}
      {url && url.messages && (
        <MenuItem className={classes.menuItem} key={'privateMessages'} component={Link} to={url.messages}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.privateMessages" defaultMessage="ui.header.menuItem.privateMessages" />
          </Typography>
        </MenuItem>
      )}
      {isAdmin && (
        <Box>
          <MenuItem className={classes.menuItem} key={'platform'} onClick={() => fetchPlatform('')}>
            <Typography textAlign="center">
              <FormattedMessage id="ui.header.menuItem.platform" defaultMessage="ui.header.menuItem.platform" />
            </Typography>
          </MenuItem>
          {url && url.communityTour && (
            <MenuItem className={classes.menuItem} key={'communityTour'} component={Link} to={url.communityTour}>
              <Typography textAlign="center">
                <FormattedMessage id="ui.header.menuItem.communityTour" defaultMessage="ui.header.menuItem.communityTour" />
              </Typography>
            </MenuItem>
          )}
        </Box>
      )}
      {(isModerator || isAdmin) && (
        <Box>
          <MenuItem className={classes.menuItem} key={'moderation'} onClick={() => fetchPlatform('/moderation')}>
            <Typography textAlign="center">
              <FormattedMessage id="ui.header.menuItem.moderation" defaultMessage="ui.header.menuItem.moderation" />
            </Typography>
          </MenuItem>
        </Box>
      )}
      {url && url.settings && (
        <MenuItem className={classes.menuItem} key={'settings'} component={Link} to={url.settings}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.settings" defaultMessage="ui.header.menuItem.settings" />
          </Typography>
        </MenuItem>
      )}
      <Divider />
      {url && url.logout && (
        <MenuItem className={classes.menuItem} key={'logout'} onClick={url.logout}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.logout" defaultMessage="ui.header.menuItem.logout" />
          </Typography>
        </MenuItem>
      )}
    </Root>
  );
}
