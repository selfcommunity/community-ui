import {Box, BoxProps, FormControl, Icon, InputLabel, MenuItem, Select, Stack, Switch, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCCommunitySubscriptionTier, SCLiveStreamSettingsType, SCLiveStreamViewType} from '@selfcommunity/types';
import classNames from 'classnames';
import React, {useContext, useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
import {LIVESTREAM_DEFAULT_SETTINGS} from './constants';
import {SCPreferences, SCPreferencesContextType, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import UpScalingTierBadge from '../../shared/UpScalingTierBadge';

export const PREFIX = 'SCLiveStreamFormSettings';

const classes = {
  root: `${PREFIX}-root`,
  switch: `${PREFIX}-switch`,
  switchLabel: `${PREFIX}-switch-Label`,
  accessView: `${PREFIX}-access-view`,
  accessViewIcon: `${PREFIX}-access-view-icon`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({}));

export interface LiveStreamFormSettingsProps extends BoxProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Event Object
   * @default null
   */
  settings?: SCLiveStreamSettingsType;

  /**
   * onChange callback
   * @param data
   */
  onChange?: (data) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS LiveStreamSettingsForm component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {LiveStreamSettingsForm} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `LiveStreamSettingsForm` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLiveStreamForm-root|Styles applied to the root element.|
 |switch|.SCLiveStreamForm-switch|Styles applied to the switch element.|
 |switchLabel|.SCLiveStreamForm-switch-label|Styles applied to the switchLabel element.|
 |accessView|.SCLiveStreamForm-access-view|Styles applied to the access view.|

 * @param inProps
 */
export default function LiveStreamSettingsForm(inProps: LiveStreamFormSettingsProps): JSX.Element {
  //PROPS
  const props: LiveStreamFormSettingsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, settings = LIVESTREAM_DEFAULT_SETTINGS, onChange, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const {preferences}: SCPreferencesContextType = useSCPreferences();

  const authUserId = useMemo(() => (scUserContext.user ? scUserContext.user.id : null), [scUserContext.user]);
  const isCommunityOwner = useMemo(() => authUserId === 1, [authUserId]);
  const isEnterpriseTier = useMemo(
    () =>
      preferences &&
      SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value === SCCommunitySubscriptionTier.ENTERPRISE,
    [preferences]
  );
  const isEnterpriseFeaturesVisible = useMemo(() => Boolean(isEnterpriseTier || isCommunityOwner), [isEnterpriseTier, isCommunityOwner]);

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          className={classes.switch}
          checked={Boolean(settings?.muteParticipants)}
          onChange={() => onChange({...LIVESTREAM_DEFAULT_SETTINGS, ...settings, ...{['muteParticipants']: !settings?.muteParticipants}})}
        />
        <Typography className={classes.switchLabel}>
          <FormattedMessage id="ui.liveStreamForm.muteParticipants" defaultMessage="ui.liveStreamForm.muteParticipants" />
        </Typography>
      </Stack>
      {isEnterpriseFeaturesVisible && (
        <>
          <Stack direction="row" spacing={1} alignItems="center">
            <Switch
              className={classes.switch}
              checked={Boolean(settings?.disableVideo)}
              disabled={!isEnterpriseTier}
              onChange={() => onChange({...LIVESTREAM_DEFAULT_SETTINGS, ...settings, ...{['disableVideo']: !settings?.disableVideo}})}
            />
            <Typography className={classes.switchLabel}>
              <FormattedMessage id="ui.liveStreamForm.disableVideo" defaultMessage="ui.liveStreamForm.disableVideo" />
            </Typography>
            <UpScalingTierBadge desiredTier={SCCommunitySubscriptionTier.ENTERPRISE} />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Switch
              className={classes.switch}
              checked={Boolean(settings?.disableShareScreen)}
              disabled={!isEnterpriseTier}
              onChange={() => onChange({...LIVESTREAM_DEFAULT_SETTINGS, ...settings, ...{['disableShareScreen']: !settings?.disableShareScreen}})}
            />
            <Typography className={classes.switchLabel}>
              <FormattedMessage id="ui.liveStreamForm.disableShareScreen" defaultMessage="ui.liveStreamForm.disableShareScreen" />
            </Typography>
            <UpScalingTierBadge desiredTier={SCCommunitySubscriptionTier.ENTERPRISE} />
          </Stack>
        </>
      )}
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          className={classes.switch}
          checked={Boolean(settings?.disableChat)}
          onChange={() => onChange({...LIVESTREAM_DEFAULT_SETTINGS, ...settings, ...{['disableChat']: !settings?.disableChat}})}
        />
        <Typography className={classes.switchLabel}>
          <FormattedMessage id="ui.liveStreamForm.disableChat" defaultMessage="ui.liveStreamForm.disableChat" />
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          className={classes.switch}
          checked={Boolean(settings?.hideParticipantsList)}
          onChange={() => onChange({...LIVESTREAM_DEFAULT_SETTINGS, ...settings, ...{['hideParticipantsList']: !settings?.hideParticipantsList}})}
        />
        <Typography className={classes.switchLabel}>
          <FormattedMessage id="ui.liveStreamForm.hideParticipantsList" defaultMessage="ui.liveStreamForm.hideParticipantsList" />
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          className={classes.switch}
          checked={Boolean(settings?.automaticallyNotifyFollowers)}
          onChange={() =>
            onChange({...LIVESTREAM_DEFAULT_SETTINGS, ...settings, ...{['automaticallyNotifyFollowers']: !settings?.automaticallyNotifyFollowers}})
          }
        />
        <Typography className={classes.switchLabel}>
          <FormattedMessage id="ui.liveStreamForm.automaticallyNotifyFollowers" defaultMessage="ui.liveStreamForm.automaticallyNotifyFollowers" />
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          className={classes.switch}
          checked={Boolean(settings?.showInProfile)}
          onChange={() => onChange({...LIVESTREAM_DEFAULT_SETTINGS, ...settings, ...{['showInProfile']: !settings?.showInProfile}})}
        />
        <Typography className={classes.switchLabel}>
          <FormattedMessage id="ui.liveStreamForm.showInProfile" defaultMessage="ui.liveStreamForm.showInProfile" />
        </Typography>
      </Stack>
      <FormControl className={classes.accessView}>
        <InputLabel id="viewLabel">
          <FormattedMessage id="ui.liveStreamForm.view.label" defaultMessage="ui.liveStreamForm.view.label" />
        </InputLabel>
        <Select
          name="view"
          label={<FormattedMessage id="ui.liveStreamForm.view.label" defaultMessage="ui.liveStreamForm.view.label" />}
          labelId="viewLabel"
          fullWidth
          value={settings?.view ?? SCLiveStreamViewType.SPEAKER}
          onChange={(e) => onChange({...LIVESTREAM_DEFAULT_SETTINGS, ...settings, ...{['view']: e.target.value}})}
          displayEmpty
          renderValue={(selected) => {
            return (
              <>
                <Icon className={classes.accessViewIcon}>{selected === SCLiveStreamViewType.SPEAKER ? 'upload' : 'category'}</Icon>&nbsp;
                <FormattedMessage id={`ui.liveStreamForm.view.${selected}`} defaultMessage={`ui.liveStreamForm.view.${selected}`} />
              </>
            );
          }}>
          {Object.values(SCLiveStreamViewType).map((f) => (
            <MenuItem value={f} key={f}>
              <Box>
                <Typography variant="body1">
                  <b>
                    <Icon className={classes.accessViewIcon}>{f === SCLiveStreamViewType.SPEAKER ? 'upload' : 'category'}</Icon>&nbsp;
                    <FormattedMessage id={`ui.liveStreamForm.view.${f}`} defaultMessage={`ui.liveStreamForm.view.${f}`} />
                  </b>
                </Typography>
                <Typography>
                  <FormattedMessage id={`ui.liveStreamForm.view.${f}.description`} defaultMessage={`ui.liveStreamForm.view.${f}.description`} />
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Root>
  );
}
