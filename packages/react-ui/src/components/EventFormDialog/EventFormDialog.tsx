import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCEventType} from '@selfcommunity/types';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {PREFIX} from './constants';
import EventForm, {EventFormProps} from '../EventForm';
import {useCallback} from 'react';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface EventFormDialogProps extends BaseDialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Open dialog
   * @default true
   */
  open?: boolean;

  /**
   * On dialog close callback function
   * @default null
   */
  onClose?: () => void;

  /**
   * Props to spread to EventForm component
   * @default undefined
   */
  EventFormComponentProps?: EventFormProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS EventFormDialog component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {EventFormDialog} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCEventFormDialog` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventFormDialog-root|Styles applied to the root element.|

 * @param inProps
 */
export default function EventFormDialog(inProps: EventFormDialogProps): JSX.Element {
  //PROPS
  const props: EventFormDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, open = true, onClose, EventFormComponentProps, ...rest} = props;

  const handleSuccess = useCallback(
    (event: SCEventType) => {
      EventFormComponentProps?.onSuccess?.(event);
      onClose?.();
    },
    [onClose, EventFormComponentProps]
  );

  /**
   * Renders root object
   */
  return (
    <Root
      DialogContentProps={{dividers: false}}
      title={
        EventFormComponentProps?.event ? (
          <FormattedMessage id="ui.eventForm.title.edit" defaultMessage="ui.eventForm.title.edit" />
        ) : (
          <FormattedMessage id="ui.eventForm.title" defaultMessage="ui.eventForm.title" />
        )
      }
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      {...rest}>
      <EventForm {...(EventFormComponentProps && EventFormComponentProps)} onSuccess={handleSuccess} />
    </Root>
  );
}
