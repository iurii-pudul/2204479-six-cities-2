import {FileReaderInterface} from './interfaces/file-reader.interface.js';
import {readFileSync} from 'fs';
import {CityType} from '../entities/enums/city-type.js';
import {HousingType} from '../entities/enums/housing-type.js';
import {FacilityType} from '../entities/enums/facility-type.js';
import {User} from '../entities/user/user.js';
import {Coordinates} from '../entities/post/coordinates.js';
import {UserType} from '../entities/enums/user-type.js';
import {Post} from '../entities/post/post.js';
import chalk from 'chalk';
import {Validator} from '../validators/validator.js';

export type ErrorObject = {
  postName: string;
  errors: string[]
}

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';
  private defaultProfileImage = '/src/assets/empty_profile.png';

  constructor(public filename: string) {
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf8'});
  }

  public toArray(): Post[] {
    console.log('DATA FROM FILE', this.rawData);

    if (!this.rawData) {
      return [];
    }

    const resultData: Post[] = this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(
        ([title, description, releaseDate, city, preview, photos, premium, favorite, rating, type, roomCount, guestCount, price, facilities, author, commentCount, coordinates]) => ({
          title,
          description,
          releaseDate: new Date(releaseDate),
          city: Object.values(CityType).filter((c) => (c === city)) as unknown as CityType,
          preview,
          photos: photos.split(';').map((n) => (n)),
          premium,
          favorite,
          rating,
          type: Object.values(HousingType).filter((t) => (t === type)) as unknown as HousingType,
          roomCount,
          guestCount,
          price,
          facilities: this.getFacilities(facilities),
          author: this.mapToAuthor(author.split(';').map((a) => (a))),
          commentCount: this.getCountOfComment(commentCount.split(';')),
          coordinates: this.mapToCoordinates(coordinates.split(';').map((c) => (c)))
        })
      ) as unknown as Post[];

    const errorObjects = this.validatePost(resultData);
    if (errorObjects.length > 0) {
      console.log(errorObjects);
      throw Error(chalk.red('INVALID DATA'));
    }
    console.log(chalk.green('PARSED DATA'));
    return resultData;
  }

  getFacilities(facilities: string): FacilityType[] {
    return facilities ? facilities.split(';')
      .map((facility) => (Object.values(FacilityType).filter((f) => (f === facility)))
      ) as unknown as FacilityType[] : [];
  }

  getCountOfComment(c: string[]): number {
    return c ? c.length : 0;
  }

  mapToCoordinates(c: string[]): Coordinates {
    return c ? {latitude: c[0], longitude: c[1]} : {} as Coordinates;
  }

  mapToAuthor(a: string[]): User {
    return a ? {
      name: a[0],
      email: a[1],
      photo: a[2] ? a[2] : this.defaultProfileImage,
      password: a[3],
      type: Object.values(UserType).filter((t) => (t === a[4])) as unknown as UserType,
    } : {} as User;
  }

  validatePost(data: Post[]): ErrorObject[] {
    const result: ErrorObject[] = [];
    data.forEach((p) => {
      const errors = Validator.validatePost(p);
      if (errors.length !== 0) {
        result.push({postName: p.type, errors: errors});
      }
    });
    return result;
  }
}
