/**
 * Axios client wrapper
 */
import http, {HttpResponse, HttpMethod} from './client';

/**
 * Endpoint component
 */
import Endpoints, {EndpointType} from './constants/Endpoints';

/**
 * Utils
 */
import {formatHttpError} from './utils/http';
import {generateJWTToken, parseJwt} from './utils/token';
import {apiRequest} from './utils/apiRequest';

/**
 * Services
 */
import CategoryService, {CategoryApiClient, CategoryApiClientInterface} from './services/category';
import CommentService, {CommentApiClient, CommentApiClientInterface} from './services/comment';
import CustomAdvService, {CustomAdvApiClient, CustomAdvApiClientInterface} from './services/custom_adv';
import CustomPageService, {CustomPageApiClient, CustomPageApiClientInterface} from './services/custom_page';
import DataPortabilityService, {DataPortabilityApiClient, DataPortabilityApiClientInterface} from './services/data_portability';
import EmbedService, {EmbedApiClient, EmbedApiClientInterface} from './services/embed';
import FeatureService, {FeatureApiClient, FeatureApiClientInterface} from './services/feature';
import FeedService, {FeedApiClient, FeedApiClientInterface} from './services/feed';
import FeedObjectService, {FeedObjectApiClient, FeedObjectApiClientInterface} from './services/feed_object';
import IncubatorService, {IncubatorApiClient, IncubatorApiClientInterface} from './services/incubator';
import InsightService, {InsightApiClient, InsightApiClientInterface} from './services/insight';
import LegalPageService, {LegalPageApiClient, LegalPageApiClientInterface} from './services/legal_page';
import LocalityService, {LocalityApiClient, LocalityApiClientInterface} from './services/locality';
import LoyaltyService, {LoyaltyApiClient, LoyaltyApiClientInterface} from './services/loyalty';
import MediaService, {MediaApiClient, MediaApiClientInterface} from './services/media';
import ModerationService, {ModerationApiClient, ModerationApiClientInterface} from './services/moderation';
import NotificationService, {NotificationApiClient, NotificationApiClientInterface} from './services/notification';
import PreferenceService, {PreferenceApiClient, PreferenceApiClientInterface} from './services/preference';
import PrivateMessageService, {PrivateMessageApiClient, PrivateMessageApiClientInterface} from './services/private_message';
import ScoreService, {ScoreApiClient, ScoreApiClientInterface} from './services/score';
import SSOService, {SSOApiClient, SSOApiClientInterface} from './services/sso';
import SuggestionService, {SuggestionApiClient, SuggestionApiClientInterface} from './services/suggestion';
import TagService, {TagApiClient, TagApiClientInterface} from './services/tag';
import UserService, {UserApiClient, UserApiClientInterface} from './services/user';
import WebhookService, {WebhookApiClient, WebhookApiClientInterface} from './services/webhook';

/**
 * Types
 */
import {
  SCPaginatedResponse,
  WebhookParamType,
  WebhookEventsType,
  SSOSignUpParams,
  CommentListParams,
  CommentCreateParams,
  IncubatorCreateParams,
  LoyaltyPrizeParams,
  ModerateContributionParams,
  CustomNotificationParams,
  UserAutocompleteParams,
  UserScoreParams,
  UserSearchParams,
  TagParams,
  MediaCreateParams,
  MediaTypes,
  ChunkType,
  ChunkUploadParams,
  ChunkUploadCompleteParams,
  ThreadParams,
  MessageCreateParams,
  MessageMediaUploadParams,
  MessageThumbnailUploadParams,
  MessageChunkUploadDoneParams,
  MessageMediaChunksParams
} from './types';

/**
 * Export all
 */
export {
  http,
  HttpResponse,
  HttpMethod,
  apiRequest,
  formatHttpError,
  generateJWTToken,
  parseJwt,
  Endpoints,
  EndpointType,
  PreferenceService,
  PreferenceApiClient,
  PreferenceApiClientInterface,
  UserService,
  UserApiClient,
  UserApiClientInterface,
  FeatureService,
  FeatureApiClient,
  FeatureApiClientInterface,
  CategoryService,
  CategoryApiClient,
  CategoryApiClientInterface,
  CommentService,
  CommentApiClient,
  CommentApiClientInterface,
  CustomAdvService,
  CustomAdvApiClient,
  CustomAdvApiClientInterface,
  CustomPageService,
  CustomPageApiClient,
  CustomPageApiClientInterface,
  DataPortabilityService,
  DataPortabilityApiClient,
  DataPortabilityApiClientInterface,
  EmbedService,
  EmbedApiClient,
  EmbedApiClientInterface,
  FeedService,
  FeedApiClient,
  FeedApiClientInterface,
  FeedObjectService,
  FeedObjectApiClient,
  FeedObjectApiClientInterface,
  IncubatorService,
  IncubatorApiClient,
  IncubatorApiClientInterface,
  InsightService,
  InsightApiClient,
  InsightApiClientInterface,
  LegalPageService,
  LegalPageApiClient,
  LegalPageApiClientInterface,
  LocalityService,
  LocalityApiClient,
  LocalityApiClientInterface,
  LoyaltyService,
  LoyaltyApiClient,
  LoyaltyApiClientInterface,
  MediaService,
  MediaApiClient,
  MediaApiClientInterface,
  ModerationService,
  ModerationApiClient,
  ModerationApiClientInterface,
  NotificationService,
  NotificationApiClient,
  NotificationApiClientInterface,
  PrivateMessageService,
  PrivateMessageApiClient,
  PrivateMessageApiClientInterface,
  ScoreService,
  ScoreApiClient,
  ScoreApiClientInterface,
  SSOService,
  SSOApiClient,
  SSOApiClientInterface,
  SuggestionService,
  SuggestionApiClient,
  SuggestionApiClientInterface,
  TagService,
  TagApiClient,
  TagApiClientInterface,
  WebhookService,
  WebhookApiClient,
  WebhookApiClientInterface,
  SCPaginatedResponse,
  WebhookParamType,
  WebhookEventsType,
  CommentCreateParams,
  IncubatorCreateParams,
  SSOSignUpParams,
  CommentListParams,
  LoyaltyPrizeParams,
  ModerateContributionParams,
  CustomNotificationParams,
  UserAutocompleteParams,
  UserScoreParams,
  UserSearchParams,
  TagParams,
  MediaCreateParams,
  MediaTypes,
  ChunkUploadParams,
  ChunkUploadCompleteParams,
  ChunkType,
  ThreadParams,
  MessageCreateParams,
  MessageMediaUploadParams,
  MessageThumbnailUploadParams,
  MessageChunkUploadDoneParams,
  MessageMediaChunksParams
};
