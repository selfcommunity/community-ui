import {SCLiveStreamConnectionDetailsType, SCLiveStreamMonthlyDurationType, SCLiveStreamType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import Endpoints from '../../constants/Endpoints';
import {SCPaginatedResponse} from '../../types';
import {LiveStreamCreateParams, LiveStreamRemoveParticipantParams, LiveStreamSearchParams} from '../../types/liveStream';
import {apiRequest} from '../../utils/apiRequest';
import {urlParams} from '../../utils/url';

export interface LiveStreamApiClientInterface {
  // LiveStreams search
  search(params?: LiveStreamSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLiveStreamType>>;

  // LiveStream detail
  getSpecificInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCLiveStreamType>;

  // LiveStreams CRUD
  create(data: LiveStreamCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCLiveStreamType>;
  update(id: number | string, data: SCLiveStreamType, config?: AxiosRequestConfig): Promise<SCLiveStreamType>;
  patch(id: number | string, data: SCLiveStreamType, config?: AxiosRequestConfig): Promise<SCLiveStreamType>;
  delete(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Close live room permanently
  close(id: number | string, config?: AxiosRequestConfig): Promise<SCLiveStreamType>;

  // LiveStream image change (bigger, big, medium, small)
  changeCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCLiveStreamType>;

  // Join LiveStream
  join(id: number | string, config?: AxiosRequestConfig): Promise<SCLiveStreamConnectionDetailsType>;

  // Remove participant
  removeParticipant(id: number | string, data: LiveStreamRemoveParticipantParams | FormData, config?: AxiosRequestConfig): Promise<any>;

  // LiveStream monthly duration
  getMonthlyDuration(config?: AxiosRequestConfig): Promise<SCLiveStreamMonthlyDurationType>;
}
/**
 * Contains all the endpoints needed to manage LiveStreams.
 */
export class LiveStreamApiClient {
  /**
   * This endpoint performs LiveStreams search
   * @param params
   * @param config
   */
  static search(params?: LiveStreamSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLiveStreamType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.SearchLiveStream.url({})}?${p.toString()}`, method: Endpoints.SearchLiveStream.method});
  }

  /**
   * This endpoint retrieves a specific LiveStream.
   * @param id
   * @param config
   */
  static getSpecificInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCLiveStreamType> {
    return apiRequest({...config, url: Endpoints.GetLiveStreamInfo.url({id}), method: Endpoints.GetLiveStreamInfo.method});
  }

  /**
   * This endpoint creates an LiveStream.
   * @param data
   * @param config
   */
  static create(data: LiveStreamCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCLiveStreamType> {
    return apiRequest({...config, url: Endpoints.CreateLiveStream.url({}), method: Endpoints.CreateLiveStream.method, data: data});
  }

  /**
   * This endpoint updates an LiveStream.
   * @param id
   * @param data
   * @param config
   */
  static update(id: number | string, data: SCLiveStreamType, config?: AxiosRequestConfig): Promise<SCLiveStreamType> {
    return apiRequest({...config, url: Endpoints.UpdateLiveStream.url({id}), method: Endpoints.UpdateLiveStream.method, data: data});
  }

  /**
   * This endpoint patches an LiveStream.
   * @param id
   * @param data
   * @param config
   */
  static patch(id: number | string, data: SCLiveStreamType, config?: AxiosRequestConfig): Promise<SCLiveStreamType> {
    return apiRequest({...config, url: Endpoints.PatchLiveStream.url({id}), method: Endpoints.PatchLiveStream.method, data: data});
  }
  /**
   * This endpoint deletes an LiveStream.
   * @param id
   * @param config
   */
  static delete(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.DeleteLiveStream.url({id}), method: Endpoints.DeleteLiveStream.method});
  }

  /**
   * This endpoint allows to close permanently a room
   * @param id
   * @param config
   */
  static close(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.CloseLiveStream.url({id}), method: Endpoints.CloseLiveStream.method});
  }

  /**
   * This endpoint changes the LiveStream avatar
   * @param id
   * @param data
   * @param config
   */
  static changeCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCLiveStreamType> {
    return apiRequest({url: Endpoints.PatchLiveStream.url({id}), method: Endpoints.PatchLiveStream.method, data, ...config});
  }

  /**
   * This endpoint allows to attend an LiveStream
   * @param id
   * @param config
   */
  static join(id: number | string, config?: AxiosRequestConfig): Promise<SCLiveStreamConnectionDetailsType> {
    return apiRequest({...config, url: Endpoints.JoinLiveStream.url({id}), method: Endpoints.JoinLiveStream.method});
  }

  /**
   * This endpoint remove participant from the specified live stream.
   * If ban=true in the payload the user can no longer join the meet
   * @param id
   * @param data
   * @param config
   */
  static removeParticipant(id: number | string, data: LiveStreamRemoveParticipantParams | FormData, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      url: Endpoints.RemoveParticipant.url({id}),
      method: Endpoints.RemoveParticipant.method,
      data,
      ...config
    });
  }

  /**
   * This endpoint retrieves LiveStream montlhy duration.
   * @param config
   */
  static getMonthlyDuration(config?: AxiosRequestConfig): Promise<SCLiveStreamMonthlyDurationType> {
    return apiRequest({...config, url: Endpoints.GetLiveStreamMonthlyDuration.url({}), method: Endpoints.GetLiveStreamMonthlyDuration.method});
  }
}

/**
 *
 :::tip LiveStream service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {LiveStreamService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `search` will return the LiveStreams matching the search query.

 async searchLiveStreams() {
	 return await LiveStreamService.search();
 }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificInfo(liveStreamId) {
	 return await LiveStreamService.getSpecificInfo(liveStreamId);
 }
 ```
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
 ```
 :::
 */
export default class LiveStreamService {
  static async search(params?: LiveStreamSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLiveStreamType>> {
    return LiveStreamApiClient.search(params, config);
  }
  static async getSpecificInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCLiveStreamType> {
    return LiveStreamApiClient.getSpecificInfo(id, config);
  }
  static async create(data: LiveStreamCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCLiveStreamType> {
    return LiveStreamApiClient.create(data, config);
  }
  static async update(id: number | string, data: SCLiveStreamType, config?: AxiosRequestConfig): Promise<SCLiveStreamType> {
    return LiveStreamApiClient.update(id, data, config);
  }
  static async patch(id: number | string, data: SCLiveStreamType, config?: AxiosRequestConfig): Promise<SCLiveStreamType> {
    return LiveStreamApiClient.patch(id, data, config);
  }
  static async delete(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return LiveStreamApiClient.delete(id, config);
  }
  static async close(id: number | string, config?: AxiosRequestConfig): Promise<SCLiveStreamType> {
    return LiveStreamApiClient.close(id, config);
  }
  static async changeCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCLiveStreamType> {
    return LiveStreamApiClient.changeCover(id, data, config);
  }
  static async join(id: number | string, config?: AxiosRequestConfig): Promise<SCLiveStreamConnectionDetailsType> {
    return LiveStreamApiClient.join(id, config);
  }
  static async removeParticipant(id: number | string, data: LiveStreamRemoveParticipantParams | FormData, config?: AxiosRequestConfig): Promise<any> {
    return LiveStreamApiClient.removeParticipant(id, data, config);
  }
  static async getMonthlyDuration(config?: AxiosRequestConfig): Promise<SCLiveStreamMonthlyDurationType> {
    return LiveStreamApiClient.getMonthlyDuration(config);
  }
}
