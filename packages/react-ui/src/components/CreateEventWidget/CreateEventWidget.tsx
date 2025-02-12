import {Box, CardActions, CardContent, CardMedia, Divider, Icon, styled, Typography, useThemeProps} from '@mui/material';
import {SCPreferences, SCPreferencesContextType, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import {useContext, useEffect, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import CreateEventButton, {CreateEventButtonProps} from '../CreateEventButton';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import Skeleton from './Skeleton';
import {SCFeatureName} from '@selfcommunity/types';

const classes = {
  root: `${PREFIX}-root`,
  image: `${PREFIX}-image`,
  calendar: `${PREFIX}-calendar`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  spaging: `${PREFIX}-spacing`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface CreateEventWidgetProps extends WidgetProps {
  /**
   * Props to spread to CreateEventButton component
   * @default {}
   */
  CreateEventButtonComponentProps?: CreateEventButtonProps;
  /**
   * Other props
   */
  [p: string]: any;
}

export default function CreateEventWidget(inProps: CreateEventWidgetProps) {
  // PROPS
  const props: CreateEventWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {CreateEventButtonComponentProps = {}, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState(true);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // HOOK
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();
  const eventsEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      SCPreferences.CONFIGURATIONS_EVENTS_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_EVENTS_ENABLED].value,
    [preferences, features]
  );
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const onlyStaffEnabled = useMemo(() => preferences[SCPreferences.CONFIGURATIONS_EVENTS_ONLY_STAFF_ENABLED].value, [preferences]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const canCreateEvent = useMemo(() => scUserContext?.user?.permission?.create_event, [scUserContext?.user?.permission]);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  /**
   * If there's no authUserId, component is hidden.
   */
  if (!eventsEnabled || (!canCreateEvent && onlyStaffEnabled) || !authUserId) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classes.root} {...rest}>
      <Box position="relative">
        <CardMedia
          component="img"
          image={`${preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}`}
          alt="placeholder image"
          className={classes.image}
        />
        <Icon className={classes.calendar} fontSize="large">
          CalendarIcon
        </Icon>
      </Box>

      <CardContent className={classes.content}>
        <Typography variant="h5" className={classes.title}>
          <FormattedMessage id="ui.createEvent.title" defaultMessage="ui.createEvent.title" />
        </Typography>

        <Typography variant="body1" className={classes.spaging}>
          <FormattedMessage id="ui.createEvent.description" defaultMessage="ui.createEvent.description" />
        </Typography>

        <Divider className={classes.spaging} />
      </CardContent>

      <CardActions className={classes.actions}>
        <CreateEventButton {...CreateEventButtonComponentProps} />
      </CardActions>
    </Root>
  );
}
