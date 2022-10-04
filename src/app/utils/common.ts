import {City} from '../enums/city.js';
import {HousingType} from '../enums/housing-type.js';
import {FacilityType} from '../enums/facility-type.js';
import {Coordinates} from '../entities/coordinates.js';
import {User} from '../entities/user.js';
import {UserType} from '../enums/user-type.js';
import {Post} from '../entities/post.js';
import chalk from 'chalk';
import {Validator} from '../validators/validator.js';
import {ErrorObject} from '../cli-commands/tsv-file-reader.js';

let INDEX = 1;

export const createPost = (row: string) => {
  const defaultProfileImage = '/src/assets/empty_profile.png';
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, releaseDate, city, preview, photos, premium, favorite, rating, type, roomCount, guestCount, price, facilities, author, commentCount, coordinates] = tokens;

  function getFacilities(s: string) {
    return s ? s.split(';')
      .map((facility) => (Object.values(FacilityType).filter((f) => (f === facility)))
      ) as unknown as FacilityType[] : [];
  }

  function mapToAuthor(a: string[]): User {
    return a ? {
      name: a[0],
      email: a[1],
      photo: a[2] ? a[2] : defaultProfileImage,
      password: a[3],
      type: Object.values(UserType).filter((t) => (t === a[4])) as unknown as UserType,
    } : {} as User;
  }

  function getCountOfComment(c: string[]): number {
    return c ? c.length : 0;
  }

  function mapToCoordinates(c: string[]): Coordinates {
    return c ? {latitude: c[0], longitude: c[1]} : {} as Coordinates;
  }

  function validatePost(post: Post, index: number): ErrorObject[] {
    const result: ErrorObject[] = [];
    const errors = Validator.validatePost(post);
    if (errors.length !== 0) {
      result.push({postLine: index, postName: post.title, errors: errors});
    }
    return result;
  }

  const resultData = {
    title,
    description,
    releaseDate: new Date(releaseDate),
    city: Object.values(City).filter((c) => (c === city)) as unknown as City,
    preview,
    photos: photos.split(';').map((n) => (n)),
    premium,
    favorite,
    rating,
    type: Object.values(HousingType).filter((t) => (t === type)) as unknown as HousingType,
    roomCount,
    guestCount,
    price,
    facilities: getFacilities(facilities) as unknown as FacilityType,
    author: mapToAuthor(author.split(';').map((a) => (a))) as unknown as User,
    commentCount: getCountOfComment(commentCount.split(';')),
    coordinates: mapToCoordinates(coordinates.split(';').map((c) => (c))) as unknown as Coordinates
  } as unknown as Post;

  const errorObjects = validatePost(resultData, INDEX);
  INDEX++;
  if (errorObjects.length > 0) {
    console.log(errorObjects);
    throw Error(chalk.red('INVALID DATA'));
  }
  console.log(chalk.green('PARSED DATA'));
  return resultData;
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';
