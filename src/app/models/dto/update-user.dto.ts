import {UserType} from '../enums/user-type.js';
import {IsEnum, IsOptional, IsString, Length} from 'class-validator';
import {USER_NAME_MAX, USER_NAME_MIN} from './constants.js';

export default class UpdateUserDto {

  @IsOptional()
  @IsString({message: 'Field name is required'})
  @Length(USER_NAME_MIN, USER_NAME_MAX, {message: `Min length for name is ${USER_NAME_MIN}, max is ${USER_NAME_MAX}`})
  public name?: string;

  @IsOptional()
  @IsString({message: 'photo is required'})
  public photo?: string;

  @IsOptional()
  @IsEnum(UserType, {message: 'Field photo must be PRO or COMMON'})
  public type?: UserType;
}
