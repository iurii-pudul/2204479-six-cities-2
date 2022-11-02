import {UserType} from '../enums/user-type.js';
import {IsEmail, IsEnum, IsString, Length} from 'class-validator';
import {PASSWORD_MAX, PASSWORD_MIN, USER_NAME_MAX, USER_NAME_MIN} from '../constants/constants.js';

export default class CreateUserDto {

  @IsString({message: 'Field name is required'})
  @Length(USER_NAME_MIN, USER_NAME_MAX, {message: `Min length for name is ${USER_NAME_MIN}, max is ${USER_NAME_MAX}`})
  public name!: string;

  @IsEmail({}, {message: 'email must be valid address'})
  public email!: string;

  @IsString({message: 'password is required'})
  @Length(PASSWORD_MIN, PASSWORD_MAX, {message: `Min length for password is ${PASSWORD_MIN}, max is ${PASSWORD_MAX}`})
  public password!: string;

  @IsEnum(UserType, {message: 'Field photo must be PRO or COMMON'})
  public type!: UserType;
}
