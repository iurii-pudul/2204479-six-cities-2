import {UserValidator} from './user-validator.js';
import {ValidatorInterface} from './interface/validator.interface.js';
import {Post} from '../models/entities/post.js';

export class PostValidator implements ValidatorInterface {

  constructor(private post: Post) {}

  public validate(): string[] {
    const invalid: string[] = new UserValidator(this.post.author).validate();
    if (!this.post.title || this.post.title.length < 5 || this.post.title.length > 100) {
      invalid.push('incorrect length of title field, it has to be at least 5 chars or less than 100');
    }
    if (!this.post.description || this.post.description.length < 20 || this.post.description.length > 1024) {
      invalid.push('incorrect length of description field, it has to be at least 20 chars or less than 1024');
    }
    if (!this.post.releaseDate) {
      invalid.push('date of release has to be filled');
    }
    if (!this.post.city) {
      invalid.push('city has to be chosen from list of cities');
    }
    if (!this.post.preview) {
      invalid.push('preview link has to be filled');
    }
    if (!this.post.photos || this.post.photos.length !== 6) {
      invalid.push('count of photos has to be 6');
    }
    if (!this.post.premium) {
      invalid.push('premium flag has to be filled');
    }
    if (!this.post.favorite) {
      invalid.push('favorite flag has to be filled');
    }
    if (!this.post.rating || this.post.rating > 5 || this.post.rating < 1) {
      invalid.push('rating has to be number from 1 to 5');
    }
    if (!this.post.type) {
      invalid.push('type has to be chosen from list of houseTypes');
    }
    if (!this.post.roomCount || this.post.roomCount > 8 || this.post.roomCount < 1) {
      invalid.push('rooms has to be from 1 to 8');
    }
    if (!this.post.guestCount || this.post.guestCount > 10 || this.post.guestCount < 1) {
      invalid.push('rooms has to be from 1 to 10');
    }
    if (!this.post.price || this.post.price > 100000 || this.post.price < 100) {
      invalid.push('rooms has to be from 100 to 100000');
    }
    if (!this.post.facilities) {
      invalid.push('facilities has to be chosen from list of FacilityType');
    }
    if (!this.post.coordinates) {
      invalid.push('coordinates has to be filled');
    }
    return invalid;
  }
}
