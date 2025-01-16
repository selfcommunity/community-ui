import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {
  SCAvatarType,
  SCCategoryType,
  SCFeedUnitType,
  SCLiveStreamType,
  SCPlatformType,
  SCTagType,
  SCUserAutocompleteType,
  SCUserAvatarType,
  SCUserChangeEmailType,
  SCUserConnectionRequestType,
  SCUserConnectionStatusType,
  SCUserCounterType,
  SCUserEmailTokenType,
  SCUserFollowedStatusType,
  SCUserFollowerStatusType,
  SCUserHiddenByStatusType,
  SCUserHiddenStatusType,
  SCUserLoyaltyPointsType,
  SCUserPermissionType,
  SCUserProviderAssociationType,
  SCUserSettingsType,
  SCUserType
} from '@selfcommunity/types';
import {BaseGetParams, SCPaginatedResponse, UserAutocompleteParams, UserGetParams, UserSearchParams} from '../../types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';
import {DeleteProviderAssociation} from '../../types/user';

export interface UserApiClientInterface {
  getAllUsers(params?: any, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  getHiddenUsers(params?: any, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  getHiddenUsersId(params?: any, config?: AxiosRequestConfig): Promise<number[]>;
  userAutocomplete(params: UserAutocompleteParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserAutocompleteType>>;
  userSearch(params: UserSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  getSpecificUser(id: number | string, config?: AxiosRequestConfig): Promise<SCUserType>;
  getUserCounters(id: number | string, config?: AxiosRequestConfig): Promise<SCUserCounterType>;
  userUpdate(id: number | string, data?: SCUserType, config?: AxiosRequestConfig): Promise<SCUserType>;
  userPatch(id: number | string, data?: SCUserType, config?: AxiosRequestConfig): Promise<SCUserType>;
  userDelete(id: number | string, hard?: number, config?: AxiosRequestConfig): Promise<any>;
  changeUserMail(
    id: number | string,
    new_email: string,
    confirm?: boolean,
    send_email?: boolean,
    config?: AxiosRequestConfig
  ): Promise<any | SCUserChangeEmailType>;
  confirmChangeUserMail(id: number | string, new_email: string, validation_code?: string, config?: AxiosRequestConfig): Promise<any>;
  changeUserPassword(id: number | string, password: string, new_password: string, config?: AxiosRequestConfig): Promise<any>;
  userSettings(id: number | string, config?: AxiosRequestConfig): Promise<SCUserSettingsType>;
  userSettingsPatch(id: number | string, data?: SCUserSettingsType, config?: AxiosRequestConfig): Promise<SCUserSettingsType>;
  getCurrentUser(config?: AxiosRequestConfig): Promise<SCUserType>;
  getCurrentUserAvatar(config?: AxiosRequestConfig): Promise<SCUserAvatarType>;
  getCurrentUserPermission(config?: AxiosRequestConfig): Promise<SCUserPermissionType>;
  getCurrentUserPlatform(next?: string, config?: AxiosRequestConfig): Promise<SCPlatformType>;
  getUserFollowedCategories(id: number | string, mutual?: number, config?: AxiosRequestConfig): Promise<SCCategoryType[]>;
  getUserFeed(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getUserFollowers(
    id: number | string,
    mutual?: number,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>>;
  getUserFollowings(
    id: number | string,
    mutual?: number,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>>;
  followUser(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  checkUserFollowed(id: number | string, config?: AxiosRequestConfig): Promise<SCUserFollowedStatusType>;
  checkUserFollower(id: number | string, config?: AxiosRequestConfig): Promise<SCUserFollowerStatusType>;
  getUserConnections(id: number | string, params?: UserGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  checkUserConnections(id: number | string, config?: AxiosRequestConfig): Promise<SCUserConnectionStatusType>;
  getUserConnectionRequests(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserConnectionRequestType>>;
  getUserRequestConnectionsSent(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserConnectionRequestType>>;
  userAcceptRequestConnection(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  userRequestConnection(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  userRemoveConnection(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  userCancelRejectConnectionRequest(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  userCancelRequestConnection(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  userRejectConnectionRequest(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  userMarkSeenConnectionRequest(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  showHideUser(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  checkUserHidden(id: number | string, config?: AxiosRequestConfig): Promise<SCUserHiddenStatusType>;
  checkUserHiddenBy(id: number | string, config?: AxiosRequestConfig): Promise<SCUserHiddenByStatusType>;
  getUserLoyaltyPoints(id: number | string, config?: AxiosRequestConfig): Promise<SCUserLoyaltyPointsType>;
  getUserConnectionStatuses(users: number[], config?: AxiosRequestConfig): Promise<any>;
  userTagToAddressContribution(config?: AxiosRequestConfig): Promise<SCTagType>;
  checkUserEmailToken(id: number | string, email_token: string, config?: AxiosRequestConfig): Promise<SCUserEmailTokenType>;
  addUserAvatar(data: FormData, config?: AxiosRequestConfig): Promise<SCAvatarType>;
  getUserAvatars(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCAvatarType>>;
  removeUserAvatar(avatar_id: number | string, config?: AxiosRequestConfig): Promise<any>;
  setUserPrimaryAvatar(avatar_id: number | string, config?: AxiosRequestConfig): Promise<any>;
  getProviderAssociations(userId: string | number, config?: AxiosRequestConfig): Promise<SCUserProviderAssociationType[]>;
  createProviderAssociation(data: SCUserProviderAssociationType, config?: AxiosRequestConfig): Promise<SCUserProviderAssociationType>;
  deleteProviderAssociation(data: DeleteProviderAssociation, config?: AxiosRequestConfig): Promise<any>;
  getUserLiveStream(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLiveStreamType>>;
}

/**
 * Contains all the endpoints needed to manage users.
 */
export class UserApiClient {
  /**
   * This endpoint retrieves the list of all users
   * @param params
   * @param config
   */
  static getAllUsers(params?: any, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.UserList.url({})}?${p.toString()}`, method: Endpoints.UserList.method});
  }

  /**
   * This endpoint retrieves the list of all users hidden by the authenticated user
   * @param params
   * @param config
   */
  static getHiddenUsers(params?: any, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.ListHiddenUsers.url({})}?${p.toString()}`, method: Endpoints.ListHiddenUsers.method});
  }

  /**
   * This endpoint retrieves the list of all users hidden id by the authenticated user
   * @param params
   * @param config
   */
  static getHiddenUsersId(params?: any, config?: AxiosRequestConfig): Promise<number[]> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.ListHiddenUsersId.url({})}?${p.toString()}`, method: Endpoints.ListHiddenUsersId.method});
  }

  /**
   * This endpoint retrieves the list of all users that meet the search criteria. The user object returned will contain only the following attributes: id, username, real_name, ext_id and avatar.
   * This endpoint is recommended for implementing an autocomplete input field.
   * @param params
   * @param config
   */
  static userAutocomplete(params: UserAutocompleteParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserAutocompleteType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.UserAutocomplete.url({})}?${p.toString()}`, method: Endpoints.UserAutocomplete.method});
  }

  /**
   * This endpoint performs users search.
   * @param params
   * @param config
   */
  static userSearch(params: UserSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.UserSearch.url({})}?${p.toString()}`, method: Endpoints.UserSearch.method});
  }

  /**
   * This endpoint retrieves a specific user's profile identified by ID.
   * @param id
   * @param config
   */
  static getSpecificUser(id: number | string, config?: AxiosRequestConfig): Promise<SCUserType> {
    return apiRequest({...config, url: Endpoints.User.url({id}), method: Endpoints.User.method});
  }

  /**
   * This endpoint retrieves the counters of a specific user identified by ID.
   * @param id
   * @param config
   */
  static getUserCounters(id: number | string, config?: AxiosRequestConfig): Promise<SCUserCounterType> {
    return apiRequest({...config, url: Endpoints.UserCounters.url({id}), method: Endpoints.UserCounters.method});
  }

  /**
   * This endpoint updates the profile of a user identified by ID. A user can only update their personal data.
   * If the request is willing to update the avatar or the cover the 'Content-Type' request header must be set as 'multipart/form-data', otherwise it can be 'application/x-www-form-urlencoded'.
   * @param id
   * @param data
   * @param config
   */
  static userUpdate(id: number | string, data?: SCUserType, config?: AxiosRequestConfig): Promise<SCUserType> {
    return apiRequest({...config, url: Endpoints.UserUpdate.url({id}), method: Endpoints.UserUpdate.method, data: data});
  }

  /**
   * This endpoint patches a specific user identified by ID.
   * @param id
   * @param data
   * @param config
   */
  static userPatch(id: number | string, data?: SCUserType, config?: AxiosRequestConfig): Promise<SCUserType> {
    return apiRequest({...config, url: Endpoints.UserPatch.url({id}), method: Endpoints.UserPatch.method, data: data});
  }

  /**
   * This endpoint deletes a specific user identified by ID.
   * @param id
   * @param hard
   * @param config
   */
  static userDelete(id: number | string, hard?: number, config?: AxiosRequestConfig): Promise<any> {
    const p = urlParams({...(hard && {hard: hard})});
    return apiRequest({...config, url: `${Endpoints.UserDelete.url({id})}?${p.toString()}`, method: Endpoints.UserDelete.method});
  }

  /**
   * This endpoint changes the email of the authenticated user.
   * @param id
   * @param new_email
   * @param confirm
   * @param send_email
   * @param config
   */
  static changeUserMail(
    id: number | string,
    new_email: string,
    confirm?: boolean,
    send_email?: boolean,
    config?: AxiosRequestConfig
  ): Promise<any | SCUserChangeEmailType> {
    return apiRequest({
      ...config,
      url: Endpoints.ChangeUserMail.url({id}),
      method: Endpoints.ChangeUserMail.method,
      data: {
        new_email: new_email,
        confirm: confirm,
        ...(send_email ? {send_email} : {})
      }
    });
  }

  /**
   * This endpoint confirms email change.
   * @param id
   * @param new_email
   * @param validation_code
   * @param config
   */
  static confirmChangeUserMail(id: number | string, new_email: string, validation_code?: string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.ConfirmUserChangeMail.url({id}),
      method: Endpoints.ConfirmUserChangeMail.method,
      data: {
        new_email: new_email,
        validation_code: validation_code
      }
    });
  }

  /**
   * This endpoint changes the password of the authenticated user.
   * @param id
   * @param password
   * @param new_password
   * @param config
   */
  static changeUserPassword(id: number | string, password: string, new_password: string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.ChangeUserPassword.url({id}),
      method: Endpoints.ChangeUserPassword.method,
      data: {
        password: password,
        new_password: new_password
      }
    });
  }

  /**
   * This endpoint retrieves all current user's settings for the authenticated user.
   * @param id
   * @param config
   */
  static userSettings(id: number | string, config?: AxiosRequestConfig): Promise<SCUserSettingsType> {
    return apiRequest({...config, url: Endpoints.UserSettings.url({id}), method: Endpoints.UserSettings.method});
  }

  /**
   * This endpoint changes the user settings for the authenticated user.
   * @param id
   * @param data
   * @param config
   */
  static userSettingsPatch(id: number | string, data?: SCUserSettingsType, config?: AxiosRequestConfig): Promise<SCUserSettingsType> {
    return apiRequest({...config, url: Endpoints.UserSettingsPatch.url({id}), method: Endpoints.UserSettingsPatch.method, data: data ?? null});
  }

  /**
   * This endpoint returns the user identified by the authentication token.
   * @param config
   */
  static getCurrentUser(config?: AxiosRequestConfig): Promise<SCUserType> {
    return apiRequest({...config, url: Endpoints.Me.url(), method: Endpoints.Me.method});
  }

  /**
   * This endpoint returns the url to the user's current avatar.
   * @param config
   */
  static getCurrentUserAvatar(config?: AxiosRequestConfig): Promise<SCUserAvatarType> {
    return apiRequest({...config, url: Endpoints.MyAvatar.url({}), method: Endpoints.MyAvatar.method});
  }

  /**
   * This endpoint returns a list of permissions for the user identified by the authentication token. Some permissions in the list depend on global community settings.
   * @param config
   */
  static getCurrentUserPermission(config?: AxiosRequestConfig): Promise<SCUserPermissionType> {
    return apiRequest({...config, url: Endpoints.Permission.url({}), method: Endpoints.Permission.method});
  }

  /**
   * This endpoint retrieves the platform url starting from the Authorization user token. Using this url, the logged user (must be a staff member) can access the platform to manage the community.
   * @param next
   * @param config
   */
  static getCurrentUserPlatform(next?: string, config?: AxiosRequestConfig): Promise<SCPlatformType> {
    const p = urlParams({...(next && {next: next})});
    return apiRequest({...config, url: `${Endpoints.Platform.url({})}?${p.toString()}`, method: Endpoints.Platform.method});
  }

  /**
   * This endpoint gets the list of categories followed by the user.
   * @param id
   * @param mutual
   * @param config
   */
  static getUserFollowedCategories(id: number | string, mutual?: number, config?: AxiosRequestConfig): Promise<SCCategoryType[]> {
    const p = urlParams({...(mutual && {mutual: mutual})});
    return apiRequest({...config, url: `${Endpoints.FollowedCategories.url({id})}?${p.toString()}`, method: Endpoints.FollowedCategories.method});
  }

  /**
   * This endpoint retrieves the list of posts of the user identified  by ID.
   * @param id
   * @param params
   * @param config
   */
  static getUserFeed(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest({...config, url: Endpoints.UserFeed.url({id}), method: Endpoints.UserFeed.method, params});
  }

  /**
   * This endpoint retrieves the list of followers of a specific user identified  by ID.
   * @param id
   * @param params
   * @param config
   */
  static getUserFollowers(id: number | string, params?: UserGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({...config, url: Endpoints.UserFollowers.url({id}), method: Endpoints.UserFollowers.method, params});
  }

  /**
   * This endpoint retrieves the list of following of a specific user identified  by ID.
   * @param id
   * @param params
   * @param config
   */
  static getUserFollowings(id: number | string, params?: UserGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({...config, url: Endpoints.UserFollowings.url({id}), method: Endpoints.UserFollowings.method, params});
  }

  /**
   * This endpoint allows a user to follow another user identified  by ID.
   * @param id
   * @param config
   */
  static followUser(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.FollowUser.url({id}), method: Endpoints.FollowUser.method});
  }

  /**
   * This endpoint returns is_followed = true if the user (identified in path) is followed by me.
   * @param id
   * @param config
   */
  static checkUserFollowed(id: number | string, config?: AxiosRequestConfig): Promise<SCUserFollowedStatusType> {
    return apiRequest({...config, url: Endpoints.CheckUserFollowed.url({id}), method: Endpoints.CheckUserFollowed.method});
  }

  /**
   * This endpoint returns is_follower = true if the user (identified in path) follow me
   * @param id
   * @param config
   */
  static checkUserFollower(id: number | string, config?: AxiosRequestConfig): Promise<SCUserFollowerStatusType> {
    return apiRequest({...config, url: Endpoints.CheckUserFollower.url({id}), method: Endpoints.CheckUserFollower.method});
  }

  /**
   * This endpoint retrieves the list of connections of a specific user identified by ID.
   * @param id
   * @param params
   * @param config
   */
  static getUserConnections(id: number | string, params?: UserGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({...config, url: Endpoints.UserConnections.url({id}), method: Endpoints.UserConnections.method, params});
  }

  /**
   * This endpoint returns is_connection = true if the user (identified in path) is connected with me.
   * @param id
   * @param config
   */
  static checkUserConnections(id: number | string, config?: AxiosRequestConfig): Promise<SCUserConnectionStatusType> {
    return apiRequest({...config, url: Endpoints.UserCheckConnection.url({id}), method: Endpoints.UserCheckConnection.method});
  }

  /**
   * This endpoint retrieves the list of connection requests received by a specific user identified by ID.
   * @param params
   * @param config
   */
  static getUserConnectionRequests(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return apiRequest({...config, url: Endpoints.UserConnectionRequests.url(), method: Endpoints.UserConnectionRequests.method, params});
  }

  /**
   * This endpoint retrieves a specific user's list of connection requests sent by user.
   * @param params
   * @param config
   */
  static getUserRequestConnectionsSent(
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return apiRequest({...config, url: Endpoints.UserRequestConnectionsSent.url(), method: Endpoints.UserRequestConnectionsSent.method, params});
  }

  /**
   * This endpoint accepts a request connection of the user identified  by ID.
   * @param id
   * @param config
   */
  static userAcceptRequestConnection(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.UserAcceptRequestConnection.url({id}), method: Endpoints.UserAcceptRequestConnection.method});
  }

  /**
   * This endpoint requests a connection to the user identified  by ID.
   * @param id
   * @param config
   */
  static userRequestConnection(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.UserRequestConnection.url({id}), method: Endpoints.UserRequestConnection.method});
  }

  /**
   * This endpoint removes connection with the user identified  by ID.
   * @param id
   * @param config
   */
  static userRemoveConnection(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.UserRemoveConnection.url({id}), method: Endpoints.UserRemoveConnection.method});
  }

  /**
   * This endpoint cancels reject connection to a user identified  by ID.
   * @param id
   * @param config
   */
  static userCancelRejectConnectionRequest(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.UserCancelRejectConnectionRequest.url({id}),
      method: Endpoints.UserCancelRejectConnectionRequest.method
    });
  }

  /**
   * This endpoint cancels a request connection for a user.
   * @param id
   * @param config
   */
  static userCancelRequestConnection(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.UserCancelRequestConnection.url({id}), method: Endpoints.UserCancelRequestConnection.method});
  }

  /**
   * This endpoint rejects a connection request sent from user identified  by ID.
   * @param id
   * @param config
   */
  static userRejectConnectionRequest(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.UserRejectConnectionRequest.url({id}), method: Endpoints.UserRejectConnectionRequest.method});
  }

  /**
   * This endpoint marks seen a connection request of user identified  by ID. for the authenticated user.
   * @param id
   * @param config
   */
  static userMarkSeenConnectionRequest(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.UserMarkSeenConnectionRequest.url({id}), method: Endpoints.UserMarkSeenConnectionRequest.method});
  }

  /**
   * This endpoint shows/hides a user (and its posts) identified  by ID. for the authenticated user.
   * @param id
   * @param config
   */
  static showHideUser(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.UserShowHide.url({id}), method: Endpoints.UserShowHide.method});
  }

  /**
   * This endpoint returns true if the user (identified in path) is hidden by the authenticated user.
   * @param id
   * @param config
   */
  static checkUserHidden(id: number | string, config?: AxiosRequestConfig): Promise<SCUserHiddenStatusType> {
    return apiRequest({...config, url: Endpoints.CheckUserHidden.url({id}), method: Endpoints.CheckUserHidden.method});
  }

  /**
   * This endpoint returns true if the user (identified in path) has hidden by the authenticated user.
   * @param id
   * @param config
   */
  static checkUserHiddenBy(id: number | string, config?: AxiosRequestConfig): Promise<SCUserHiddenByStatusType> {
    return apiRequest({...config, url: Endpoints.CheckUserHiddenBy.url({id}), method: Endpoints.CheckUserHiddenBy.method});
  }

  /**
   * This endpoint returns user's loyalty points.
   * @param id
   * @param config
   */
  static getUserLoyaltyPoints(id: number | string, config?: AxiosRequestConfig): Promise<SCUserLoyaltyPointsType> {
    return apiRequest({...config, url: Endpoints.GetUserLoyaltyPoints.url({id}), method: Endpoints.GetUserLoyaltyPoints.method});
  }

  /**
   * This endpoint lists the connection/follow statuses of the logged user starting from a users array.
   * @param users
   * @param config
   */
  static getUserConnectionStatuses(users: number[], config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.UserConnectionStatuses.url({}),
      method: Endpoints.UserConnectionStatuses.method,
      data: {users: users}
    });
  }

  /**
   * This endpoint returns user's tags to address a contribution.
   * @param config
   */
  static userTagToAddressContribution(config?: AxiosRequestConfig): Promise<SCTagType> {
    return apiRequest({...config, url: Endpoints.UserTagToAddressContribution.url({}), method: Endpoints.UserTagToAddressContribution.method});
  }

  /**
   * This endpoint checks an email token.
   * @param id
   * @param email_token
   * @param config
   */
  static checkUserEmailToken(id, email_token, config?: AxiosRequestConfig): Promise<SCUserEmailTokenType> {
    const p = urlParams({email_token: email_token});
    return apiRequest({...config, url: `${Endpoints.CheckEmailToken.url({id})}?${p.toString()}`, method: Endpoints.CheckEmailToken.method});
  }

  /**
   * This endpoint adds an avatar to my avatars.
   * @param data
   * @param config
   */
  static addUserAvatar(data: FormData, config?: AxiosRequestConfig): Promise<SCAvatarType> {
    return apiRequest({url: Endpoints.AddAvatar.url({}), method: Endpoints.AddAvatar.method, data, ...config});
  }

  /**
   * This endpoint retrieves all user avatars.
   * @param config
   */
  static getUserAvatars(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCAvatarType>> {
    return apiRequest({url: Endpoints.GetAvatars.url({}), method: Endpoints.GetAvatars.method, ...config});
  }

  /**
   * This endpoint removes/deletes an avatar from the authenticated user avatars.
   * @param avatar_id
   * @param config
   */
  static removeUserAvatar(avatar_id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({url: Endpoints.RemoveAvatar.url({}), method: Endpoints.RemoveAvatar.method, data: {avatar_id: avatar_id}, ...config});
  }

  /**
   * This endpoint sets the primary avatar for the authenticated user.
   * @param avatar_id
   * @param config
   */
  static setUserPrimaryAvatar(avatar_id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({url: Endpoints.SetPrimaryAvatar.url({}), method: Endpoints.SetPrimaryAvatar.method, data: {avatar_id: avatar_id}, ...config});
  }

  /**
   * This endpoint retrieve all provider associations owned by a user
   *
   * @param userId
   * @param config
   */
  static getProviderAssociations(userId: string | number, config?: AxiosRequestConfig): Promise<SCUserProviderAssociationType[]> {
    return apiRequest({
      ...config,
      url: Endpoints.ProviderAssociations.url({id: userId}),
      method: Endpoints.ProviderAssociations.method
    });
  }
  /**
   * This endpoint creates a provider association for a given account.
   *
   * @param data
   * @param config
   */
  static createProviderAssociation(data: SCUserProviderAssociationType, config?: AxiosRequestConfig): Promise<SCUserProviderAssociationType> {
    return apiRequest({
      ...config,
      data,
      url: Endpoints.CreateProviderAssociation.url({id: data.user_id}),
      method: Endpoints.CreateProviderAssociation.method
    });
  }
  /**
   * This endpoint deletes a provider association for a given account.
   *
   * It requires an administration token.
   *
   * @param data
   * @param config
   */
  static deleteProviderAssociation(data: DeleteProviderAssociation, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      data,
      url: Endpoints.DeleteProviderAssociation.url({id: data.user_id}),
      method: Endpoints.DeleteProviderAssociation.method
    });
  }

  /**
   * This endpoint retrieves the list of live stream currently started by user identified by ID.
   * @param id
   * @param params
   * @param config
   */
  static getUserLiveStream(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLiveStreamType>> {
    return apiRequest({...config, url: Endpoints.GetLiveStream.url({id}), method: Endpoints.UserFeed.method, params});
  }
}

/**
 *
 :::tip User service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {UserService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllUsers` will return the paginated list of users.

 async getAllUsers() {
        return await UserService.getAllUsers();
      }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificUser(userId) {
       return await UserService.getSpecificUser(userId);
      }
 ```

 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 Ex: If the async function `userUpdate`  is willing to update the avatar or the cover the 'Content-Type' request header must be set as 'multipart/form-data'.

 async getSpecificUser(userId, data, config) {
 const headers = {headers: {'Content-Type': 'multipart/form-data'}}
       return await UserService.getSpecificUser(userId, {avatar: avatar}, headers);
      }
 ```
 :::
 */
export default class UserService {
  static async getAllUsers(params?: any, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getAllUsers(params, config);
  }
  static async getHiddenUsers(params?: any, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getHiddenUsers(params, config);
  }
  static async getHiddenUsersId(params?: any, config?: AxiosRequestConfig): Promise<number[]> {
    return UserApiClient.getHiddenUsersId(params, config);
  }
  static async userAutocomplete(params: UserAutocompleteParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserAutocompleteType>> {
    return UserApiClient.userAutocomplete(params, config);
  }
  static async userSearch(params: UserSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.userSearch(params, config);
  }
  static async getSpecificUser(id: number | string, config?: AxiosRequestConfig): Promise<SCUserType> {
    return UserApiClient.getSpecificUser(id, config);
  }
  static async getUserCounters(id: number | string, config?: AxiosRequestConfig): Promise<SCUserCounterType> {
    return UserApiClient.getUserCounters(id, config);
  }
  static async userUpdate(id: number | string, data?: SCUserType, config?: AxiosRequestConfig): Promise<SCUserType> {
    return UserApiClient.userUpdate(id, data, config);
  }
  static async userPatch(id: number | string, data?: SCUserType, config?: AxiosRequestConfig): Promise<SCUserType> {
    return UserApiClient.userPatch(id, data, config);
  }
  static async userDelete(id: number | string, hard?: number, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.userDelete(id, hard, config);
  }
  static async changeUserMail(
    id: number | string,
    new_email: string,
    confirm?: boolean,
    send_email?: boolean,
    config?: AxiosRequestConfig
  ): Promise<any | SCUserChangeEmailType> {
    return UserApiClient.changeUserMail(id, new_email, confirm, send_email, config);
  }
  static async confirmChangeUserMail(id: number | string, new_email: string, validation_code?: string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.confirmChangeUserMail(id, new_email, validation_code, config);
  }
  static async changeUserPassword(id: number | string, password: string, new_password: string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.changeUserPassword(id, password, new_password, config);
  }
  static async userSettings(id: number | string, config?: AxiosRequestConfig): Promise<SCUserSettingsType> {
    return UserApiClient.userSettings(id, config);
  }
  static async userSettingsPatch(id: number | string, data?: SCUserSettingsType, config?: AxiosRequestConfig): Promise<SCUserSettingsType> {
    return UserApiClient.userSettingsPatch(id, data, config);
  }
  static async getCurrentUser(config?: AxiosRequestConfig): Promise<SCUserType> {
    return UserApiClient.getCurrentUser(config);
  }
  static async getCurrentUserAvatar(config?: AxiosRequestConfig): Promise<SCUserAvatarType> {
    return UserApiClient.getCurrentUserAvatar(config);
  }
  static async getCurrentUserPermission(config?: AxiosRequestConfig): Promise<SCUserPermissionType> {
    return UserApiClient.getCurrentUserPermission(config);
  }
  static async getCurrentUserPlatform(next?: string, config?: AxiosRequestConfig): Promise<SCPlatformType> {
    return UserApiClient.getCurrentUserPlatform(next, config);
  }
  static async getUserFollowedCategories(id: number | string, mutual?: number, config?: AxiosRequestConfig): Promise<SCCategoryType[]> {
    return UserApiClient.getUserFollowedCategories(id, mutual, config);
  }
  static async getUserFeed(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return UserApiClient.getUserFeed(id, params, config);
  }
  static async getUserFollowers(id: number | string, params?: UserGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getUserFollowers(id, params, config);
  }
  static async getUserFollowings(id: number | string, params?: UserGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getUserFollowings(id, params, config);
  }
  static async followUser(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.followUser(id, config);
  }
  static async checkUserFollowed(id: number | string, config?: AxiosRequestConfig): Promise<SCUserFollowedStatusType> {
    return UserApiClient.checkUserFollowed(id, config);
  }
  static async checkUserFollower(id: number | string, config?: AxiosRequestConfig): Promise<SCUserFollowerStatusType> {
    return UserApiClient.checkUserFollower(id, config);
  }
  static async getUserConnections(
    id: number | string,
    params?: UserGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getUserConnections(id, params, config);
  }
  static async checkUserConnections(id: number | string, config?: AxiosRequestConfig): Promise<SCUserConnectionStatusType> {
    return UserApiClient.checkUserConnections(id, config);
  }
  static async getUserConnectionRequests(
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return UserApiClient.getUserConnectionRequests(params, config);
  }
  static async getUserRequestConnectionsSent(
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return UserApiClient.getUserRequestConnectionsSent(params, config);
  }
  static async userAcceptRequestConnection(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.userAcceptRequestConnection(id, config);
  }
  static async userRequestConnection(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.userRequestConnection(id, config);
  }
  static async userRemoveConnection(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.userRemoveConnection(id, config);
  }
  static async userCancelRejectConnectionRequest(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.userCancelRejectConnectionRequest(id, config);
  }
  static async userCancelRequestConnection(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.userCancelRequestConnection(id, config);
  }
  static async userRejectConnectionRequest(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.userRejectConnectionRequest(id, config);
  }
  static async userMarkSeenConnectionRequest(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.userMarkSeenConnectionRequest(id, config);
  }
  static async showHideUser(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.showHideUser(id, config);
  }
  static async checkUserHidden(id: number | string, config?: AxiosRequestConfig): Promise<SCUserHiddenStatusType> {
    return UserApiClient.checkUserHidden(id, config);
  }
  static async checkUserHiddenBy(id: number | string, config?: AxiosRequestConfig): Promise<SCUserHiddenByStatusType> {
    return UserApiClient.checkUserHiddenBy(id, config);
  }
  static async getUserLoyaltyPoints(id: number | string, config?: AxiosRequestConfig): Promise<SCUserLoyaltyPointsType> {
    return UserApiClient.getUserLoyaltyPoints(id, config);
  }
  static async getUserConnectionStatuses(users: number[], config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.getUserConnectionStatuses(users, config);
  }
  static async userTagToAddressContribution(config?: AxiosRequestConfig): Promise<SCTagType> {
    return UserApiClient.userTagToAddressContribution(config);
  }
  static async checkUserEmailToken(id: number | string, email_token, config?: AxiosRequestConfig): Promise<SCUserEmailTokenType> {
    return UserApiClient.checkUserEmailToken(id, email_token, config);
  }
  static async addUserAvatar(data: FormData, config?: AxiosRequestConfig): Promise<SCAvatarType> {
    return UserApiClient.addUserAvatar(data, config);
  }
  static async getUserAvatars(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCAvatarType>> {
    return UserApiClient.getUserAvatars(config);
  }
  static async removeUserAvatar(avatar_id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.removeUserAvatar(avatar_id, config);
  }
  static async setUserPrimaryAvatar(avatar_id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.setUserPrimaryAvatar(avatar_id, config);
  }
  static async getProviderAssociations(userId: string | number, config?: AxiosRequestConfig): Promise<SCUserProviderAssociationType[]> {
    return UserApiClient.getProviderAssociations(userId, config);
  }
  static async createProviderAssociation(data: SCUserProviderAssociationType, config?: AxiosRequestConfig): Promise<SCUserProviderAssociationType> {
    return UserApiClient.createProviderAssociation(data, config);
  }
  static async deleteProviderAssociation(data: DeleteProviderAssociation, config?: AxiosRequestConfig): Promise<any> {
    return UserApiClient.deleteProviderAssociation(data, config);
  }
  static async getUserLiveStream(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCLiveStreamType>> {
    return UserApiClient.getUserLiveStream(id, params, config);
  }
}
