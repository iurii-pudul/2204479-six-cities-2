import {Expose} from 'class-transformer';
import {UserType} from '../../enums/user-type.js';

export default class UserResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public photo!: string;

  @Expose()
  public type!: UserType;
}
