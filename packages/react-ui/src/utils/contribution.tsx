import React from 'react';
import {SCRoutes} from '@selfcommunity/react-core';
import {SCContributionType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';

/**
 * From obj extract type of the contribution
 * @param obj
 */
export function getContributionType(obj) {
  return SCContributionType.DISCUSSION in obj
    ? SCContributionType.DISCUSSION
    : SCContributionType.POST in obj
    ? SCContributionType.POST
    : SCContributionType.STATUS in obj
    ? SCContributionType.STATUS
    : SCContributionType.COMMENT in obj
    ? SCContributionType.COMMENT
    : null;
}

/**
 * From obj extract the contribution
 * @param obj
 */
export function getContribution(obj) {
  return SCContributionType.DISCUSSION in obj
    ? obj[SCContributionType.DISCUSSION]
    : SCContributionType.POST in obj
    ? obj[SCContributionType.POST]
    : SCContributionType.STATUS in obj
    ? obj[SCContributionType.STATUS]
    : SCContributionType.COMMENT in obj
    ? obj[SCContributionType.COMMENT]
    : null;
}

/**
 * Get a snippet for a contribution
 * @param obj (Discussion, Post, Status, Comment)
 */
export function getContributionSnippet(obj) {
  if (obj.type === SCContributionType.DISCUSSION) {
    return obj.summary ? <span dangerouslySetInnerHTML={{__html: obj.summary}}></span> : obj.title;
  } else {
    return obj.summary ? (
      <span dangerouslySetInnerHTML={{__html: obj.summary}}></span>
    ) : (
      <FormattedMessage id={`ui.common.${obj.type.toLowerCase()}WithoutText`} defaultMessage={`ui.common.${obj.type.toLowerCase()}WithoutText`} />
    );
  }
}

/**
 * Get the contribution text
 * Hydrate text with mention, etc.
 * @param html Html of the contribution
 * @param handleUrl Func that handle urls
 */
export function getContributionHtml(html, handleUrl) {
  return html.replace(/<mention.*? id="([0-9]+)"{1}.*?>@([a-z\d_-]+)<\/mention>/gi, (match, id, username) => {
    return `<a href='${handleUrl(SCRoutes.USER_PROFILE_ROUTE_NAME, {id, username})}'>@${username}</a>`;
  });
}

/**
 * Get the contribution text for comment object
 * Hydrate text with mention, etc.
 * @param html Html of the contribution
 * @param handleUrl Func that handle urls
 */
export function getCommentContributionHtml(html, handleUrl) {
  return html.replace(/<mention.*? id="([0-9]+)"{1}.*?>@([a-z\d_-]+)<\/mention>/gi, (match, id, username) => {
    return `<a href='${handleUrl(SCRoutes.USER_PROFILE_ROUTE_NAME, {id, username})}'>@${username}</a>`;
  });
}

/**
 * Get route name for a contribution
 * @param obj
 */
export function getContributionRouteName(obj) {
  if (!obj) return null;
  if (obj.type) {
    return SCRoutes[`${obj.type.toUpperCase()}_ROUTE_NAME`];
  }
  return obj.type;
}

/**
 * Get data for scRoutingContext.url()
 * @param obj (Discussion, Post, Status, Comment)
 */
export function getRouteData(obj) {
  let data = {};
  if (obj) {
    if (obj.type === SCContributionType.DISCUSSION || obj.type === SCContributionType.POST || obj.type === SCContributionType.STATUS) {
      data = {
        ...obj,
        contribution_type: obj.type,
        contribution_id: obj.id,
        contribution_slug: obj.slug
      };
    } else if (obj.type === SCContributionType.COMMENT) {
      const contributionType = getContributionType(obj);
      const isContributionTypeObj = obj[contributionType] && typeof obj[contributionType] === 'object';
      data = {
        ...obj,
        contribution_type: contributionType,
        contribution_id: isContributionTypeObj ? obj[contributionType].id : obj[contributionType],
        contribution_slug: isContributionTypeObj ? obj[contributionType].slug : contributionType
      };
    }
  }
  return data;
}
