import {UserType} from '../enums/user-type.js';
import {IsEnum, IsString, Length} from 'class-validator';

export default class UpdateUserDto {

  @IsString({message: 'Field name is required'})
  @Length(1, 15, {message: 'Min length for name is 1, max is 15'})
  public name?: string;

  @IsString({message: 'photo is required'})
  public photo?: string;

  @IsEnum(UserType, {message: 'Field photo must be PRO or COMMON'})
  public type?: UserType;
}
