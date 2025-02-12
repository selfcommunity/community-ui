import {Button, Divider, Icon} from '@mui/material';
import {ButtonProps} from '@mui/material/Button/Button';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCPreferences, SCPreferencesContextType, SCUserContext, SCUserContextType, UserUtils, useSCPreferences} from '@selfcommunity/react-core';
import classNames from 'classnames';
import React, {useContext, useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCCommunitySubscriptionTier, SCEventType, SCFeatureName, SCLiveStreamType} from '@selfcommunity/types';
import CreateLivestreamDialog, {CreateLiveStreamDialogProps} from '../CreateLiveStreamDialog';

const PREFIX = 'SCCreateLivestreamButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface CreateLiveStreamButtonProps extends ButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to spread to CreateGroup component
   * @default empty object
   */
  CreateLiveStreamDialogComponentProps?: CreateLiveStreamDialogProps;

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

/**
 *> API documentation for the Community-JS CreateLiveStreamButton component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CreateLiveStreamButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCreateLiveStreamButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCreateLivestreamButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function CreateLiveStreamButton(inProps: CreateLiveStreamButtonProps): JSX.Element {
  //PROPS
  const props: CreateLiveStreamButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, CreateLiveStreamDialogComponentProps = {}, onSuccess, children, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  // STATE
  const [open, setOpen] = React.useState(false);

  // CONST
  const authUserId = useMemo(() => (scUserContext.user ? scUserContext.user.id : null), [scUserContext.user]);
  const isStaff = useMemo(() => scUserContext.user && UserUtils.isStaff(scUserContext.user), [scUserContext.user]);
  const isCommunityOwner = useMemo(() => authUserId === 1, [authUserId]);
  const isFreeTrialTier = useMemo(
    () =>
      preferences &&
      SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value === SCCommunitySubscriptionTier.FREE_TRIAL,
    [preferences]
  );
  const liveStreamEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.LIVE_STREAM) &&
      SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED].value,
    [preferences, features]
  );
  const onlyStaffEnabled = useMemo(() => preferences[SCPreferences.CONFIGURATIONS_LIVE_STREAM_ONLY_STAFF_ENABLED].value, [preferences]);

  /**
   * Handle close
   */
  const handleClose = () => {
    setOpen((o) => !o);
  };

  /**
   * Handle close
   */
  const handleSuccess = (data: SCEventType | SCLiveStreamType) => {
    onSuccess && onSuccess(data);
    setOpen((o) => !o);
  };

  /**
   * If there's no authUserId, component is hidden.
   */
  if (!liveStreamEnabled || !authUserId || (onlyStaffEnabled && !isStaff) || (isFreeTrialTier && !isCommunityOwner)) {
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <React.Fragment>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleClose}
        variant="contained"
        color="secondary"
        startIcon={<Icon>movie</Icon>}
        {...rest}>
        {children ?? <FormattedMessage id="ui.createEventButton.goLive" defaultMessage="ui.createEventButton.goLive" />}
      </Root>
      {open && <CreateLivestreamDialog open onClose={handleClose} onSuccess={handleSuccess} {...CreateLiveStreamDialogComponentProps} />}
    </React.Fragment>
  );
}
