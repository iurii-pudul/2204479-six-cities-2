import {UserType} from '../enums/user-type.js';

export default class CreateUserDto {
  public name!: string;
  public email!: string;
  public password!: string;
  public photo!: string;
  public type!: UserType;
}
