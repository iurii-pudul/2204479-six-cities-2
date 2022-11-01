import {FacilityType} from '../models/enums/facility-type.js';
import {Coordinates} from '../models/entities/coordinates.js';
import {User} from '../models/entities/user.js';
import {UserType} from '../models/enums/user-type.js';
import chalk from 'chalk';
import * as crypto from 'crypto';
import CreatePostDto from '../models/dto/create-post.dto.js';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import CreateCommentDto from '../models/dto/create-comment.dto.js';

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

  function mapToCoordinates(c: string[]): Coordinates {
    return c ? {latitude: c[0], longitude: c[1]} : {} as Coordinates;
  }

  function mapToComments(com: string[]): CreateCommentDto[] {
    const result: CreateCommentDto[] = [];
    com.forEach((c) => {
      const data = new CreateCommentDto();
      data.text = c;
      result.push(data);
    });
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
    comments: mapToComments(comments.split(';').map((c) => (c))),
    coordinates: mapToCoordinates(coordinates.split(';'))
  } as unknown as CreatePostDto;

  console.log(chalk.green('PARSED DATA'));
  return resultData;
};

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (message: string) => ({
  error: message,
});
