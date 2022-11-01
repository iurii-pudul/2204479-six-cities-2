import {Expose, Type} from 'class-transformer';
import PostResponse from './post-response.js';
import UserResponse from './user-response.js';

export default class FavoriteResponse {

  @Expose()
  @Type(() => UserResponse)
  public userId!: string;

  @Expose()
  @Type(() => PostResponse)
  public postId!: string;
}
