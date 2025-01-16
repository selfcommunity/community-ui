import React, {useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Icon, IconButton, InputAdornment, TextField, Tooltip} from '@mui/material';
import {useThemeProps} from '@mui/system';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {BaseTextFieldProps} from '@mui/material/TextField/TextField';

const PREFIX = 'SCCopyTextField';

const classes = {
  root: `${PREFIX}-root`,
  btnCopy: `${PREFIX}-btn-copy`
};

const Root = styled(TextField, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.btnCopy}`]: {
    color: theme.palette.secondary.main
  },
  [`& .Mui-disabled`]: {
    color: `${theme.palette.primary.main} !important`,
    [`& .MuiOutlinedInput-notchedOutline`]: {
      borderColor: `${theme.palette.primary.main} !important`
    }
  }
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface CopyTextFieldProps extends BaseTextFieldProps {
  className?: string;
  onChange?: (value: string) => void;
  onCopy?: (value: string) => void;
  value: string;
  label?: string | React.ReactElement;
}

export default function CopyTextField(inProps: CopyTextFieldProps): JSX.Element {
  // PROPS
  const props: CopyTextFieldProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, label, value: _value, onCopy, onChange, ...rest} = props;

  // STATE
  const [value, setValue] = useState<string>(_value);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  // REF
  const timeout = useRef(null);

  // HANDLERS
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange && onChange(event.target.value);
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value).then(
      function () {
        /* clipboard successfully set */
        hanldeCopySuccess();
      },
      function () {
        /* clipboard write failed */
        console.log('Failed to opy text!');
      }
    );
  };

  const hanldeCopySuccess = () => {
    setOpenConfirm(true);
    if (timeout) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    timeout.current = setTimeout(() => {
      setOpenConfirm(false);
      onCopy && onCopy(value);
    }, 1500);
  };

  const button = (
    <IconButton aria-label="Copy text" edge="end" onClick={() => handleCopy(value)} className={classes.btnCopy}>
      <Icon>insert_link</Icon>
    </IconButton>
  );

  // RENDER
  return (
    <Root
      className={classNames(classes.root, className)}
      label={label ? label : <FormattedMessage id="ui.shared.copyTextField.textToCopy" defaultMessage="ui.shared.copyTextField.textToCopy" />}
      margin="normal"
      variant="outlined"
      disabled={true}
      fullWidth
      value={value}
      multiline
      onChange={handleChange}
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <InputAdornment position="end">
            {openConfirm ? (
              <Tooltip
                open={openConfirm}
                PopperProps={{open: true}}
                title={<FormattedMessage id="ui.shared.copyTextField.textCopied" defaultMessage="ui.shared.copyTextField.textCopied" />}>
                {button}
              </Tooltip>
            ) : (
              <Tooltip title={<FormattedMessage id="ui.shared.copyTextField.textToCopy" defaultMessage="ui.shared.copyTextField.textToCopy" />}>
                {button}
              </Tooltip>
            )}
          </InputAdornment>
        )
      }}
      InputLabelProps={{
        shrink: true
      }}
      {...rest}
    />
  );
}
