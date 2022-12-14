import {Expose, Type} from 'class-transformer';
import PostResponse from './post-response.js';
import UserResponse from './user-response.js';

export default class CommentResponse {
  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose()
  @Type(() => UserResponse)
  public author!: string;

  @Expose()
  @Type(() => PostResponse)
  public post!: string;
}
