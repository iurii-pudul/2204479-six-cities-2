import {FacilityType} from '../models/enums/facility-type.js';
import {Coordinates} from '../models/entities/coordinates.js';
import {User} from '../models/entities/user.js';
import {UserType} from '../models/enums/user-type.js';
import chalk from 'chalk';
import * as crypto from 'crypto';
import * as jose from 'jose';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import CreateCommentDto from '../models/dto/create-comment.dto.js';
import CreatePostImportDto from '../models/dto/create-post-import.dto.js';
import {ValidationError} from 'class-validator';
import {ValidationErrorField} from '../types/validation-error-field.type.js';
import {ServiceError} from '../models/enums/service-error.enum.js';
import {DEFAULT_STATIC_IMAGES} from '../models/constants/application.constants.js';
import {UnknownObject} from '../types/unknown-object.type.js';

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
  } as unknown as CreatePostImportDto;

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

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data:UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    }));
};
