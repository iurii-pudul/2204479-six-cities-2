import {User} from '../entities/user/user.js';
import * as EmailValidator from 'email-validator';
import * as Path from 'path';
import {Post} from '../entities/post/post.js';

export class Validator {

  public static validateUser(user: User): string[] {
    const invalid: string[] = [];
    if (!user.name || user.name.length > 15) {
      invalid.push('incorrect username field, must be 1-15 symbols');
    }
    if (!user.email || !EmailValidator.validate(user.email)) {
      invalid.push('incorrect email');
    }
    if (!user.photo || !['.png', '.jpg'].includes(Path.parse(user.photo).ext)) {
      invalid.push('incorrect photo, image has to be jpg or png extension');
    }
    if (!user.password || user.password.length < 6 || user.password.length > 12) {
      invalid.push('incorrect password, it has to be at least 6 chars or less than 12');
    }
    return invalid;
  }

  static validatePost(post: Post): string[] {
    const invalid: string[] = this.validateUser(post.author);
    if (!post.title || post.title.length < 5 || post.title.length > 100) {
      invalid.push('incorrect length of title field, it has to be at least 5 chars or less than 100');
    }
    if (!post.description || post.description.length < 20 || post.description.length > 1024) {
      invalid.push('incorrect length of description field, it has to be at least 20 chars or less than 1024');
    }
    if (!post.releaseDate) {
      invalid.push('date of release has to be filled');
    }
    if (!post.city) {
      invalid.push('city has to be chosen from list of cities');
    }
    if (!post.preview) {
      invalid.push('preview link has to be filled');
    }
    if (!post.photos || post.photos.length !== 6) {
      invalid.push('count of photos has to be 6');
    }
    if (!post.premium) {
      invalid.push('premium flag has to be filled');
    }
    if (!post.favorite) {
      invalid.push('favorite flag has to be filled');
    }
    if (!post.rating || post.rating > 5 || post.rating < 1) {
      invalid.push('rating has to be number from 1 to 5');
    }
    if (!post.type) {
      invalid.push('type has to be chosen from list of houseTypes');
    }
    if (!post.roomCount || post.roomCount > 8 || post.roomCount < 1) {
      invalid.push('rooms has to be from 1 to 8');
    }
    if (!post.guestCount || post.guestCount > 10 || post.guestCount < 1) {
      invalid.push('rooms has to be from 1 to 10');
    }
    if (!post.price || post.price > 100000 || post.price < 100) {
      invalid.push('rooms has to be from 100 to 100000');
    }
    if (!post.facilities) {
      invalid.push('facilities has to be chosen from list of FacilityType');
    }
    if (!post.coordinates) {
      invalid.push('coordinates has to be filled');
    }
    return invalid;
  }
}
