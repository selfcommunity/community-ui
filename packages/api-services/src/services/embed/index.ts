import {BaseGetParams, EmbedSearchParams, EmbedUpdateParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCEmbedType, SCFeedUnitType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';

export interface EmbedApiClientInterface {
  getAllEmbeds(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEmbedType>>;
  createEmbed(data: SCEmbedType, config?: AxiosRequestConfig): Promise<SCEmbedType>;
  searchEmbed(params?: EmbedSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEmbedType>>;
  getSpecificEmbed(id: number, config?: AxiosRequestConfig): Promise<SCEmbedType>;
  updateASpecificEmbed(id: number, data?: EmbedUpdateParams, config?: AxiosRequestConfig): Promise<SCEmbedType>;
  patchASpecificEmbed(id: number, data?: EmbedUpdateParams, config?: AxiosRequestConfig): Promise<SCEmbedType>;
  getEmbedFeed(embed_type?: string, embed_id?: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getSpecificEmbedFeed(id: number, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>>;
}
/**
 * Contains all the endpoints needed to manage embeds.
 */

export class EmbedApiClient {
  /**
   * This endpoint retrieves all embeds.
   * @param params
   * @param config
   */
  static getAllEmbeds(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEmbedType>> {
    const p = new URLSearchParams(params);
    return apiRequest({...config, url: `${Endpoints.EmbedList.url({})}?${p.toString()}`, method: Endpoints.EmbedList.method});
  }

  /**
   * This endpoint creates an embed. This operation requires admin role.
   * @param data
   * @param config
   */
  static createEmbed(data: SCEmbedType, config?: AxiosRequestConfig): Promise<SCEmbedType> {
    return apiRequest({...config, url: Endpoints.EmbedCreate.url({}), method: Endpoints.EmbedCreate.method, data});
  }

  /**
   * This endpoint performs embed search.
   * @param params
   * @param config
   */
  static searchEmbed(params?: EmbedSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEmbedType>> {
    const p = new URLSearchParams(params);
    return apiRequest({...config, url: `${Endpoints.EmbedSearch.url({})}?${p.toString()}`, method: Endpoints.EmbedSearch.method});
  }

  /**
   * This endpoint retrieves a specific embed using ID.
   * @param id
   * @param config
   */
  static getSpecificEmbed(id: number, config?: AxiosRequestConfig): Promise<SCEmbedType> {
    return apiRequest({...config, url: Endpoints.Embed.url({id}), method: Endpoints.Embed.method});
  }

  /**
   * This endpoint updates a specific embed. This operation requires admin role.
   * @param id
   * @param data
   * @param config
   */
  static updateASpecificEmbed(id: number, data?: EmbedUpdateParams, config?: AxiosRequestConfig): Promise<SCEmbedType> {
    return apiRequest({...config, url: Endpoints.UpdateEmbed.url({id}), method: Endpoints.UpdateEmbed.method, data: data});
  }

  /**
   * This endpoint patches a specific embed. This operation requires admin role.
   * @param id
   * @param data
   * @param config
   */
  static patchASpecificEmbed(id: number, data?: EmbedUpdateParams, config?: AxiosRequestConfig): Promise<SCEmbedType> {
    return apiRequest({...config, url: Endpoints.PatchEmbed.url({id}), method: Endpoints.PatchEmbed.method, data: data});
  }

  /**
   * This endpoint retrieves the embed's feed which contains Feed that has the Embed as associated media.
   * @param embed_type
   * @param embed_id
   * @param config
   */
  static getEmbedFeed(embed_type?: string, embed_id?: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    const p = new URLSearchParams({embed_type: embed_type, embed_id: embed_id});
    return apiRequest({...config, url: `${Endpoints.EmbedFeed.url({})}?${p.toString()}`, method: Endpoints.EmbedFeed.method});
  }

  /**
   * This endpoint retrieves the embed's feed which contains Feed that has an Embed as associated media.
   * @param id
   * @param config
   */
  static getSpecificEmbedFeed(id: number, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest({...config, url: Endpoints.SpecificEmbedFeed.url({id}), method: Endpoints.SpecificEmbedFeed.method});
  }
}

/**
 *
 :::tipEmbed service can be used in the following ways:

 ```jsx
 1. Import the service from our library:

 import {EmbedService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllEmbeds` will return the paginated list of embeds.

 async getAllEmbeds() {
        return await EmbedService.getAllEmbeds();
      }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificEmbed(embedId) {
        return await EmbedService.getSpecificEmbed(embedId);
     }
 ```
 :::
 */
export default class EmbedService {
  static async getAllEmbeds(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEmbedType>> {
    return EmbedApiClient.getAllEmbeds(params, config);
  }

  static async searchEmbed(params?: EmbedSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEmbedType>> {
    return EmbedApiClient.searchEmbed(params, config);
  }

  static async createEmbed(data: SCEmbedType, config?: AxiosRequestConfig): Promise<SCEmbedType> {
    return EmbedApiClient.createEmbed(data, config);
  }

  static async getSpecificEmbed(id: number, config?: AxiosRequestConfig): Promise<SCEmbedType> {
    return EmbedApiClient.getSpecificEmbed(id, config);
  }

  static async updateASpecificEmbed(id: number, data?: EmbedUpdateParams, config?: AxiosRequestConfig): Promise<SCEmbedType> {
    return EmbedApiClient.updateASpecificEmbed(id, data, config);
  }

  static async patchASpecificEmbed(id: number, data?: EmbedUpdateParams, config?: AxiosRequestConfig): Promise<SCEmbedType> {
    return EmbedApiClient.patchASpecificEmbed(id, data, config);
  }

  static async getEmbedFeed(embed_type?: string, embed_id?: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return EmbedApiClient.getEmbedFeed(embed_type, embed_id, config);
  }

  static async getSpecificEmbedFeed(id: number, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return EmbedApiClient.getSpecificEmbedFeed(id, config);
  }
}
