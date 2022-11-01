import {IsEmail, IsString, Length} from 'class-validator';
import {PASSWORD_MAX, PASSWORD_MIN} from './constants.js';

export default class LoginUserDto {

  @IsEmail({}, {message: 'email must be valid address'})
  public email!: string;

  @IsString({message: 'password is required'})
  @Length(PASSWORD_MIN, PASSWORD_MAX, {message: `Min length for password is ${PASSWORD_MIN}, max is ${PASSWORD_MAX}`})
  public password!: string;
}
