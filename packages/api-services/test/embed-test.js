import {generateJWTToken} from '../src/utils/token';
import {EmbedService} from '../src/index';
import {getRandomInt} from './utils/random';

describe('Embed Service Test', () => {
  let token;
  let embed;
  beforeAll(async () => {
    token = await generateJWTToken(process.env.SERVICES_USER_ID, process.env.SERVICES_SECRET_KEY);
  });
  test('Get all Embeds', () => {
    return EmbedService.getAllEmbeds().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Create an embed', () => {
    const body = {embed_type: 'image', embed_id: getRandomInt()};
    return EmbedService.createEmbed(token, body).then((data) => {
      expect(data).toBeInstanceOf(Object);
      embed = data;
    });
  });
  test('Get a specific embed', () => {
    return EmbedService.getSpecificEmbed(embed.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Search an embed', () => {
    return EmbedService.searchEmbed().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Update a specific embed', () => {
    return EmbedService.updateASpecificEmbed(token, embed.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Patch a specific embed', () => {
    return EmbedService.patchASpecificEmbed(token, embed.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Get a specific embed feed', () => {
    return EmbedService.getSpecificEmbedFeed(embed.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get embeds feed', () => {
    return EmbedService.getEmbedFeed().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
});
