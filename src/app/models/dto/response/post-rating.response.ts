import {Expose, Type} from 'class-transformer';
import UserResponse from './user-response.js';
import PostResponse from './post-response.js';

export default class PostRatingResponse {
  @Expose()
  public rating!: string;

  @Expose()
  @Type(() => UserResponse)
  public author!: string;

  @Expose()
  @Type(() => PostResponse)
  public post!: string;
}
