import {UserValidator} from './user-validator.js';
import {ValidatorInterface} from './interface/validator.interface.js';
import CreatePostDto from '../models/dto/user/create-post.dto.js';

// const MAX_POST_COMMENT_LENGTH = 1024;
// const MIN_POST_COMMENT_LENGTH = 5;

const MIN_POST_TITLE_LENGTH = 5;
const MAX_POST_TITLE_LENGTH = 100;

const MIN_POST_DESCRIPTION_LENGTH = 20;
const MAX_POST_DESCRIPTION_LENGTH = 1024;

const POST_PHOTO_COUNT = 6;

// const MAX_POST_RATING = 5;
// const MIN_POST_RATING = 1;

const MAX_POST_ROOM_COUNT = 8;
const MIN_POST_ROOM_COUNT = 1;

const MAX_POST_GUEST_COUNT = 10;
const MIN_POST_GUEST_COUNT = 1;

const MAX_POST_PRICE = 100000;
const MIN_POST_PRICE = 100;

export class PostValidator implements ValidatorInterface {

  constructor(private post: CreatePostDto) {}

  public validate(): string[] {
    const invalid: string[] = new UserValidator(this.post.author).validate();
    // if (this.post.comments && this.post.comments.length > 0) {
    //   this.post.comments.forEach((c) => {
    //     if (c.length < MIN_POST_COMMENT_LENGTH || c.length > MAX_POST_COMMENT_LENGTH) {
    //       console.log(this.post.comments);
    //       invalid.push(`incorrect length of comments, it has to be at least ${MIN_POST_COMMENT_LENGTH} chars or less than ${MAX_POST_COMMENT_LENGTH}`);
    //     }
    //   });
    // }
    if (!this.post.title || this.post.title.length < MIN_POST_TITLE_LENGTH || this.post.title.length > MAX_POST_TITLE_LENGTH) {
      invalid.push(`incorrect length of title field, it has to be at least ${MIN_POST_TITLE_LENGTH} chars or less than ${MAX_POST_TITLE_LENGTH}`);
    }
    if (!this.post.description || this.post.description.length < MIN_POST_DESCRIPTION_LENGTH || this.post.description.length > MAX_POST_DESCRIPTION_LENGTH) {
      invalid.push(`incorrect length of description field, it has to be at least ${MIN_POST_DESCRIPTION_LENGTH} chars or less than ${MAX_POST_DESCRIPTION_LENGTH}`);
    }
    if (!this.post.city) {
      invalid.push('city has to be chosen from list of cities');
    }
    if (!this.post.preview) {
      invalid.push('preview link has to be filled');
    }
    if (!this.post.photos || this.post.photos.length !== POST_PHOTO_COUNT) {
      invalid.push(`count of photos has to be ${POST_PHOTO_COUNT}`);
    }
    if (!this.post.premium) {
      invalid.push('premium flag has to be filled');
    }
    if (!this.post.favorite) {
      invalid.push('favorite flag has to be filled');
    }
    // if (!this.post.rating || this.post.rating > MAX_POST_RATING || this.post.rating < MIN_POST_RATING) {
    //   invalid.push(`rating has to be number from ${MIN_POST_RATING} to ${MAX_POST_RATING}`);
    // }
    if (!this.post.type) {
      invalid.push('type has to be chosen from list of houseTypes');
    }
    if (!this.post.roomCount || this.post.roomCount > MAX_POST_ROOM_COUNT || this.post.roomCount < MIN_POST_ROOM_COUNT) {
      invalid.push(`rooms has to be from ${MIN_POST_ROOM_COUNT} to ${MAX_POST_ROOM_COUNT}`);
    }
    if (!this.post.guestCount || this.post.guestCount > MAX_POST_GUEST_COUNT || this.post.guestCount < MIN_POST_GUEST_COUNT) {
      invalid.push(`rooms has to be from ${MIN_POST_GUEST_COUNT} to ${MAX_POST_GUEST_COUNT}`);
    }
    if (!this.post.price || this.post.price > MAX_POST_PRICE || this.post.price < MIN_POST_PRICE) {
      invalid.push(`rooms has to be from ${MIN_POST_PRICE} to ${MAX_POST_PRICE}`);
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
