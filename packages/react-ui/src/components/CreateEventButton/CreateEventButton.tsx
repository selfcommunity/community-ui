import {Button, ButtonProps, Icon} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCPreferences, SCPreferencesContextType, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import {SCFeatureName} from '@selfcommunity/types';
import classNames from 'classnames';
import React, {useContext, useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
import EventFormDialog, {EventFormDialogProps} from '../EventFormDialog';

const PREFIX = 'SCCreateEventButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface CreateEventButtonProps extends ButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to spread to CreateEvent component
   * @default empty object
   */
  EventFormDialogComponentProps?: EventFormDialogProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Create Group Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CreateEventButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCreateEventButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCreateEventButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function CreateEventButton(inProps: CreateEventButtonProps): JSX.Element {
  //PROPS
  const props: CreateEventButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, EventFormDialogComponentProps = {}, children, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [open, setOpen] = React.useState(false);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
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
  const onlyStaffEnabled = useMemo(() => preferences[SCPreferences.CONFIGURATIONS_EVENTS_ONLY_STAFF_ENABLED].value, [preferences]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const canCreateEvent = useMemo(() => scUserContext?.user?.permission?.create_event, [scUserContext?.user?.permission]);

  /**
   * Handle click on button
   */
  const handleClick = () => {
    setOpen((o) => !o);
  };

  /**
   * If there's no authUserId, component is hidden.
   */
  if (!eventsEnabled || (!canCreateEvent && onlyStaffEnabled) || !authUserId) {
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <React.Fragment>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleClick}
        variant="contained"
        color="secondary"
        startIcon={!EventFormDialogComponentProps.EventFormComponentProps?.event && <Icon fontSize="small">add</Icon>}
        {...rest}>
        {children ?? <FormattedMessage id="ui.createEventButton" defaultMessage="ui.createEventButton" />}
      </Root>
      {open && <EventFormDialog {...EventFormDialogComponentProps} open onClose={handleClick} />}
    </React.Fragment>
  );
}
