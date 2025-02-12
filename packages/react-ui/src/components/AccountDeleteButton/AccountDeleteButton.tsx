import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {Button, ButtonProps} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCUserContextType, UserUtils, useSCUser} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import BaseDialog from '../../shared/BaseDialog';
import AccountDelete from '../AccountDelete';

const PREFIX = 'SCAccountDeleteButton';

const classes = {
  root: `${PREFIX}-root`,
  dialogRoot: `${PREFIX}-dialog-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root, styles.voted]
})(({theme}) => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(({theme}) => ({}));

export interface AccountDeleteButtonProps extends Pick<ButtonProps, Exclude<keyof ButtonProps, 'onClick' | 'disabled'>> {
  /**
   * Callback when delete account
   */
  onDeleteAccount?: (user?: SCUserType) => void;
  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Account Delete Button component. Learn about the available props and the CSS API.
 *
 *
 * This component display a button that open a Dialog that display the [AccountDelete](/docs/sdk/community-js/react-ui/Components/AccountDelete) component.

 #### Import

 ```jsx
 import {AccountDeleteButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAccountDeleteButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountDeleteButton-root|Styles applied to the root element.|
 |dialogRoot|.SCAccountDeleteButton-dialog-root|Styles applied to the dialog root element.|
 * @param inProps
 */
export default function AccountDeleteButton(inProps: AccountDeleteButtonProps): JSX.Element {
  // PROPS
  const props: AccountDeleteButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onDeleteAccount, ...rest} = props;

  // STATE
  const [open, setOpen] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const isAdmin = useMemo(() => UserUtils.isCommunityCreator(scUserContext.user), [scUserContext.user]);

  // HANDLERS
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (user: SCUserType) => {
    onDeleteAccount && onDeleteAccount(user);
    handleClose();
  };

  // RENDER
  if (!scUserContext.user || isAdmin) {
    return null;
  }
  return (
    <>
      <Root onClick={handleOpen} className={classNames(classes.root, className)} {...rest}>
        <FormattedMessage id="ui.accountDeleteButton.buttonLabel" defaultMessage="ui.accountDeleteButton.buttonLabel" />
      </Root>
      {open && (
        <DialogRoot
          title={<FormattedMessage id="ui.accountDeleteButton.dialogTitle" defaultMessage="ui.accountDeleteButton.dialogTitle" />}
          onClose={handleClose}
          open={open}
          DialogContentProps={{}}>
          <AccountDelete onDeleteAccount={handleDelete} />
        </DialogRoot>
      )}
    </>
  );
}
