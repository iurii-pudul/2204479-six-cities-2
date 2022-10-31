import * as EmailValidator from 'email-validator';
import * as Path from 'path';
import {ValidatorInterface} from './interface/validator.interface.js';
import CreateUserDto from '../models/dto/create-user.dto.js';

const MAX_USER_NAME_LENGTH = 15;

const MAX_USER_PASS_LENGTH = 12;
const MIN_USER_PASS_LENGTH = 6;

const USER_PHOTO_EXT_ARRAY = ['.png', '.jpg'];

export class UserValidator implements ValidatorInterface {

  constructor(private user: CreateUserDto) {}

  public validate(): string[] {
    const invalid: string[] = [];
    if (!this.user.name || this.user.name.length > MAX_USER_NAME_LENGTH) {
      invalid.push(`incorrect username field, must be 1-${MAX_USER_NAME_LENGTH} symbols ${this.user.name}`);
    }
    if (!this.user.email || !EmailValidator.validate(this.user.email)) {
      invalid.push('incorrect email');
    }
    if (!this.user.photo || !USER_PHOTO_EXT_ARRAY.includes(Path.parse(this.user.photo).ext)) {
      invalid.push(`incorrect photo, image has to be ${JSON.stringify(USER_PHOTO_EXT_ARRAY)} extension`);
    }
    if (!this.user.password || this.user.password.length < MIN_USER_PASS_LENGTH || this.user.password.length > MAX_USER_PASS_LENGTH) {
      invalid.push(`incorrect password, it has to be at least ${MIN_USER_PASS_LENGTH} chars or less than ${MAX_USER_PASS_LENGTH}`);
    }
    return invalid;
  }
}
