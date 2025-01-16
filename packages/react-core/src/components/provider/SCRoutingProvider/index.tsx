import React, {createContext, useContext, useMemo} from 'react';
import {SCContextType, SCPreferencesContextType, SCRoutingContextType} from '../../../types';
import {useSCContext} from '../SCContextProvider';
import {SCPreferencesContext} from '../SCPreferencesProvider';
import * as SCPreferences from '../../../constants/Preferences';
import {SCRoutingType} from '../../../types/context';
import {
  CATEGORIES_LIST_ROUTE_NAME,
  CATEGORY_ROUTE_NAME,
  COMMENT_ROUTE_NAME,
  DISCUSSION_ROUTE_NAME,
  INCUBATOR_ROUTE_NAME,
  POST_ROUTE_NAME,
  STATUS_ROUTE_NAME,
  USER_NOTIFICATIONS_ROUTE_NAME,
  USER_PRIVATE_MESSAGES_ROUTE_NAME,
  USER_PROFILE_ROUTE_NAME,
  USER_PROFILE_SETTINGS_ROUTE_NAME,
  defaultRoutes,
  LIVESTREAM_ROUTE_NAME,
} from '../../../constants/Routes';

/**
 * Creates Global Context
 *
 :::tip Context can be consumed in one of the following ways:


 ```jsx
 1. <SCRoutingContext.Consumer>{(routerLink, routes, url) => (...)}</SCRoutingContext.Consumer>
 ```
 ```jsx
 2. const scRoutingContext: SCRoutingContextType = useContext(SCRoutingContext);
 ```
 ```jsx
 3. const scRoutingContext: SCRoutingContextType = useSCRouting();
 ````

 :::
 */
export const SCRoutingContext = createContext<SCRoutingContextType>({} as SCRoutingContextType);

/**
 * #### Description:
 * This component provides routing context.
 * @param children
 * @return
 * ```jsx
 * <SCRoutingContext.Provider value={contextValue}>{children}</SCRoutingContext.Provider>
 * ```
 */
export default function SCRoutingProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scContext: SCContextType = useSCContext();
  const router: SCRoutingType = scContext.settings.router ? scContext.settings.router : {};
  const routerLink: React.ComponentClass<any> = router.routerLink ? router.routerLink : null;
  const _routes = Object.assign(getPreferencesRoutes(), defaultRoutes);
  const routes: Record<string, any> = router.routes ? {..._routes, ...router.routes} : defaultRoutes;

  /**
   * Normalize template url (preferences)
   */
  function normalizeUrl(url) {
    let tpl = url;
    const re = /\{([^/]+)?\}/g;
    let match = re.exec(url);
    while (match) {
      tpl = tpl.replace(match[0], `:${match[1]}`);
      re.lastIndex = 0;
      match = re.exec(tpl);
    }
    return tpl;
  }

  /**
   * Get override routes from community preferences
   */
  function getPreferencesRoutes() {
    if (Object.keys(scPreferencesContext.preferences).length) {
      return {
        [POST_ROUTE_NAME]: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_POST].value),
        [DISCUSSION_ROUTE_NAME]: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_DISCUSSION].value),
        [STATUS_ROUTE_NAME]: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_STATUS].value),
        [COMMENT_ROUTE_NAME]: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_COMMENT].value),
        [CATEGORY_ROUTE_NAME]: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_CATEGORY].value),
        [CATEGORIES_LIST_ROUTE_NAME]: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_CATEGORIES_LIST].value),
        [USER_PROFILE_ROUTE_NAME]: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_USER_PROFILE].value),
        [USER_PROFILE_SETTINGS_ROUTE_NAME]: normalizeUrl(
          scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_USER_PROFILE_SETTINGS].value
        ),
        [USER_NOTIFICATIONS_ROUTE_NAME]: normalizeUrl(
          scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_NOTIFICATIONS].value
        ),
        [USER_PRIVATE_MESSAGES_ROUTE_NAME]: normalizeUrl(
          scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_USER_PRIVATE_MESSAGES].value
        ),
        [INCUBATOR_ROUTE_NAME]: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_INCUBATOR].value),
        [LIVESTREAM_ROUTE_NAME]: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_LIVE_STREAM].value),
      };
    }
    return {};
  }

  /**
   * Generate path
   */
  function url(name = '', params = {}) {
    const replacer = (tpl: string, data: Record<string, any>) => {
      const re = /:([^/|^?|^#]+)?/g;
      let _tpl = tpl;
      let match = re.exec(tpl);
      const hasParams = Object.keys(data).length > 0;
      while (match) {
        _tpl = hasParams ? _tpl.replace(match[0], data[match[1]]) : _tpl.split(match[0])[0];
        re.lastIndex = 0;
        match = re.exec(_tpl);
      }
      if (router.handleRoute) {
        // Handle override url
        return router.handleRoute(name, _tpl, params, tpl);
      }
      return _tpl;
    };
    return replacer(routes[name], params);
  }

  const contextValue = useMemo(
    () => ({
      routerLink,
      routes,
      url,
    }),
    [routerLink, routes]
  );

  return <SCRoutingContext.Provider value={contextValue}>{children}</SCRoutingContext.Provider>;
}

/**
 * Let's only export the `useSCTheme` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCRouting(): SCRoutingContextType {
  return useContext(SCRoutingContext);
}
