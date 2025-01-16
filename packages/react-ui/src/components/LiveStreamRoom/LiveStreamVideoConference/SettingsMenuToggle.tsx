import * as React from 'react';
import {mergePropsReactAria} from './utils';
import {useLayoutContext} from '@livekit/components-react';

export interface UseSettingsToggleProps {
  props: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

/**
 * The `useSettingsToggle` hook provides state and functions for toggling the settings menu.
 */
export function useSettingsToggle({props}: UseSettingsToggleProps) {
  const {dispatch, state} = useLayoutContext().widget;
  const className = 'lk-button lk-settings-toggle';

  const mergedProps = React.useMemo(() => {
    return mergePropsReactAria(props, {
      className,
      onClick: () => {
        if (dispatch) dispatch({msg: 'toggle_settings'});
      },
      'aria-pressed': state?.showSettings ? 'true' : 'false'
    });
  }, [props, className, dispatch, state]);

  return {mergedProps};
}

export type SettingsMenuToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * The `SettingsMenuToggle` component is a button that toggles the visibility of the `SettingsMenu` component.
 */
export const SettingsMenuToggle: (props: SettingsMenuToggleProps & React.RefAttributes<HTMLButtonElement>) => React.ReactNode =
  /* @__PURE__ */ React.forwardRef<HTMLButtonElement, SettingsMenuToggleProps>(function SettingsMenuToggle(props: SettingsMenuToggleProps, ref) {
    const {mergedProps} = useSettingsToggle({props});

    return (
      <button ref={ref} {...mergedProps}>
        {props.children}
      </button>
    );
  });
