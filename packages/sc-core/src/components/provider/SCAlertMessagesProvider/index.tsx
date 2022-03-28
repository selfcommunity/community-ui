import React, {createContext, useContext, useState} from 'react';
import {SCAlertMessagesContextType} from '../../../types';
import {SnackbarProvider} from 'notistack';

/**
 * Creates Global Context
 *
 :::tipContext can be consumed in one of the following ways:
 ```jsx
 1. <SCAlertMessagesContext.Consumer>{(options,) => (...)}</SCAlertMessagesContext.Consumer>
 ```
 ```jsx
 2. const scAlertMessagesContext: SCAlertMessagesContextType = useContext(SCAlertMessagesContext)
 ```
 ```jsx
 3. const scAlertMessagesContext: SCAlertMessagesContextType = useSCAlertMessages();
 ````
 :::

 */
export const SCAlertMessagesContext = createContext<SCAlertMessagesContextType>({} as SCAlertMessagesContextType);

/**
 * This component makes the `intl` available down the React tree.
 */
export default function SCAlertMessagesProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const [options, setOptions] = useState({maxSnack: 3});

  return (
    <SCAlertMessagesContext.Provider value={{options}}>
      <SnackbarProvider {...options}>{children}</SnackbarProvider>
    </SCAlertMessagesContext.Provider>
  );
}

/**
 * Let's only export the `useSCAlertMessages` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCAlertMessages(): SCAlertMessagesContextType {
  return useContext(SCAlertMessagesContext);
}
