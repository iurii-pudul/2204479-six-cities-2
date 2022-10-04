import {MockData} from '../entities/MockData.js';
import {UserType} from '../enums/user-type.js';
import dayjs from 'dayjs';
import {PostGeneratorInterface} from './interfaces/post-generator.interface.js';
import {generateRandomValue, getRandomItem, getRandomItems} from '../utils/random.js';
import {Coordinates} from '../entities/coordinates.js';
import generator from 'generate-password';

export class PostGenerator implements PostGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const releaseDate =  dayjs().subtract(generateRandomValue(1, 7), 'day').toISOString();
    const city = getRandomItem<string>(this.mockData.cities);
    const preview = getRandomItem<string>(this.mockData.previews);
    const photos = this.mockData.avatars.join(';'); // потому что надо 6 фото
    const premium = getRandomItem<string>(['true', 'false']);
    const favorite = getRandomItem<string>(['true', 'false']);
    const rating = generateRandomValue(1, 5);
    const type = getRandomItem(this.mockData.houseTypes);
    const roomCount = generateRandomValue(1, 8);
    const guestCount = generateRandomValue(1, 10);
    const price = generateRandomValue(100, 100000);
    const facilities = getRandomItems<string>(this.mockData.facilities).join(';');
    const author = [
      getRandomItem<string>(this.mockData.users),
      getRandomItem<string>(this.mockData.emails),
      getRandomItem<string>(this.mockData.avatars),
      generator.generate({length: 10, numbers: true}),
      getRandomItem([UserType.COMMON, UserType.PRO])
    ].join(';');

    const coordinates = this.mockData.coordinates.filter((c: Coordinates) => c.city === city)[0];
    const cords = [coordinates.latitude, coordinates.longitude].join(';');

    const comments = getRandomItems<string>(this.mockData.comments).join(';');

    return [
      title,
      description,
      releaseDate,
      city,
      preview,
      photos,
      premium,
      favorite,
      rating,
      type,
      roomCount,
      guestCount,
      price,
      facilities,
      author,
      comments,
      cords
    ].join('\t');
  }
}
