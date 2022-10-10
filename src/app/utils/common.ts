import {FacilityType} from '../models/enums/facility-type.js';
import {Coordinates} from '../models/entities/coordinates.js';
import {User} from '../models/entities/user.js';
import {UserType} from '../models/enums/user-type.js';
import chalk from 'chalk';
import {PostValidator} from '../validators/post-validator.js';
import {ErrorObject} from '../services/file/tsv-file-reader.js';
import * as crypto from 'crypto';
import CreatePostDto from '../models/dto/user/create-post.dto.js';

let INDEX = 1;

export const createPost = (row: string) => {
  const defaultProfileImage = '/src/assets/empty_profile.png';
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, releaseDate, city, preview, photos, premium, favorite, rating, type, roomCount, guestCount, price, facilities, author, comments, coordinates] = tokens;

  function getFacilities(s: string) : FacilityType[] {
    return s ? s.split(';').map((f) => (f)) as FacilityType[] : [];
  }

  function mapToAuthor(a: string[]): User {
    return a ? {
      name: a[0],
      email: a[1],
      photo: a[2] ? a[2] : defaultProfileImage,
      type: Object.values(UserType).filter((t) => (t === a[4]))[0],
    } : {} as User;
  }

  function getComments(c: string[]): string[] {
    return c.length > 0 ? c.filter((n) => n) : [];
  }

  function mapToCoordinates(c: string[]): Coordinates {
    return c ? {latitude: c[0], longitude: c[1]} : {} as Coordinates;
  }

  function validatePost(post: CreatePostDto, index: number): ErrorObject[] {
    const result: ErrorObject[] = [];
    const errors = new PostValidator(post).validate();
    if (errors.length !== 0) {
      result.push({postLine: index, postName: post.title, errors: errors});
    }
    return result;
  }

  const resultData = {
    title,
    description,
    releaseDate: new Date(releaseDate),
    city,
    preview,
    photos: photos.split(';').map((n) => (n)),
    premium,
    favorite,
    rating,
    type,
    roomCount,
    guestCount,
    price,
    facilities: getFacilities(facilities),
    author: mapToAuthor(author.split(';').map((a) => (a))),
    comments: getComments(comments.split(';')),
    coordinates: mapToCoordinates(coordinates.split(';'))
  } as unknown as CreatePostDto;

  const errorObjects = validatePost(resultData, INDEX);
  INDEX++;
  if (errorObjects.length > 0) {
    console.log(errorObjects);
    throw Error(chalk.red('INVALID DATA'));
  }
  console.log(chalk.green('PARSED DATA'));
  return resultData;
};

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';
