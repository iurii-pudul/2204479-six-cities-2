import * as EmailValidator from 'email-validator';
import * as Path from 'path';
import {ValidatorInterface} from './interface/validator.interface.js';
import {User} from '../models/entities/user.js';

export class UserValidator implements ValidatorInterface {

  constructor(private user: User) {}

  public validate(): string[] {
    const invalid: string[] = [];
    if (!this.user.name || this.user.name.length > 15) {
      invalid.push(`incorrect username field, must be 1-15 symbols ${this.user.name}`);
    }
    if (!this.user.email || !EmailValidator.validate(this.user.email)) {
      invalid.push('incorrect email');
    }
    if (!this.user.photo || !['.png', '.jpg'].includes(Path.parse(this.user.photo).ext)) {
      invalid.push('incorrect photo, image has to be jpg or png extension');
    }
    if (!this.user.password || this.user.password.length < 6 || this.user.password.length > 12) {
      invalid.push('incorrect password, it has to be at least 6 chars or less than 12');
    }
    return invalid;
  }
}
