import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import {CircularProgress, Typography} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {AccountService} from '@selfcommunity/api-services';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCAccountVerify';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Typography, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

export interface AccountVerifyProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Validation code sent by email to the user
   * @default empty string
   */
  validationCode: string;

  /**
   * Action component to display after success message
   * */
  successAction?: React.ReactNode;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS AccountVerify component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {AccountVerify} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAccountVerify` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountVerify-root|Styles applied to the root element.|

 *
 * @param inProps
 */
export default function AccountVerify(inProps: AccountVerifyProps): JSX.Element {
  const props: AccountVerifyProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  // PROPS
  const {className, onSuccess = null, validationCode, successAction = null, ...rest} = props;

  // STATE
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // EFFECTS
  useEffect(() => {
    setIsValidating(true);
    setError(false);
    AccountService.verify({validation_code: validationCode})
      .catch((error) => setError(true))
      .then(() => setIsValidating(false));
  }, [validationCode]);

  if (scUserContext.user !== null) {
    // User already logged in
    return null;
  }

  // RENDER
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {isValidating ? (
        <>
          <CircularProgress />
          <FormattedMessage id="ui.accountVerify.verifying" defaultMessage="ui.accountVerify.verifying" />
        </>
      ) : error ? (
        <FormattedMessage id="ui.accountVerify.error" defaultMessage="ui.accountVerify.error" />
      ) : (
        <>
          <FormattedMessage id="ui.accountVerify.success" defaultMessage="ui.accountVerify.success" />
          {successAction}
        </>
      )}
    </Root>
  );
}
