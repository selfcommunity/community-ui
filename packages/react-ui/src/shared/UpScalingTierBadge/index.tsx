import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {FormattedMessage} from 'react-intl';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
import {Chip, Tooltip, TooltipProps} from '@mui/material';
import React, {useMemo} from 'react';
import {SCCommunitySubscriptionTier} from '@selfcommunity/types';
import classNames from 'classnames';

const PREFIX = 'SCUpScalingTierBadge';

const classes = {
  root: `${PREFIX}-root`,
  badge: `${PREFIX}-badge`
};

const Root = styled(Tooltip, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

const Badge = styled(Chip, {
  name: PREFIX,
  slot: 'badgeRoot'
})(({theme}) => ({}));

export interface UpScalingTierProps extends Pick<TooltipProps, Exclude<keyof TooltipProps, 'children' | 'title'>> {
  className?: string;
  desiredTier?: SCCommunitySubscriptionTier;
}

export default function UpScalingTierBadge(inProps: UpScalingTierProps): JSX.Element {
  // PROPS
  const props: any = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, desiredTier = SCCommunitySubscriptionTier.GO, ...rest} = props;
  const {preferences}: SCPreferencesContextType = useSCPreferences();
  const isEnterpriseTier = useMemo(
    () =>
      preferences &&
      SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value === SCCommunitySubscriptionTier.ENTERPRISE,
    [preferences]
  );

  const tooltipMsg = useMemo(() => {
    let _msg = <FormattedMessage id="ui.upScalingTierBadge.goFeature" defaultMessage="ui.upScalingTierBadge.goFeature" />;
    switch (desiredTier) {
      case SCCommunitySubscriptionTier.PROFESSIONAL:
        _msg = <FormattedMessage id="ui.upScalingTierBadge.professionalFeature" defaultMessage="ui.upScalingTierBadge.professionalFeature" />;
        break;
      case SCCommunitySubscriptionTier.ENTERPRISE:
        _msg = <FormattedMessage id="ui.upScalingTierBadge.enterpriseFeature" defaultMessage="ui.upScalingTierBadge.enterpriseFeature" />;
        break;
      default:
        break;
    }
    return _msg;
  }, [desiredTier]);
  const badgeLabel = useMemo(() => {
    let _label = <FormattedMessage id="ui.upScalingTierBadge.go" defaultMessage="ui.upScalingTierBadge.go" />;
    switch (desiredTier) {
      case SCCommunitySubscriptionTier.PROFESSIONAL:
        _label = <FormattedMessage id="ui.upScalingTierBadge.professional" defaultMessage="ui.upscalingBadge.professional" />;
        break;
      case SCCommunitySubscriptionTier.ENTERPRISE:
        _label = <FormattedMessage id="ui.upScalingTierBadge.enterprise" defaultMessage="ui.upScalingTierBadge.enterprise" />;
        break;
      default:
        break;
    }
    return _label;
  }, [desiredTier]);

  if (desiredTier === SCCommunitySubscriptionTier.ENTERPRISE && isEnterpriseTier) {
    return null;
  }

  return (
    <Root classes={{root: classNames(className, classes.root)}} title={tooltipMsg} placement="top" {...rest}>
      <Badge color="secondary" size="small" label={badgeLabel} className={classes.badge} />
    </Root>
  );
}
