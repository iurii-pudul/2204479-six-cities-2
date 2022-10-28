import {UserType} from '../../enums/user-type.js';

export default class UpdateUserDto {
  public name!: string;
  public photo!: string;
  public type!: UserType;
}
