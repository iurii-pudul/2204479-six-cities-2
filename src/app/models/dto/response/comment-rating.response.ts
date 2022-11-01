import {Expose, Type} from 'class-transformer';
import UserResponse from './user-response.js';
import CommentResponse from './comment.response.js';

export default class CommentRatingResponse {
  @Expose()
  public rating!: string;

  @Expose()
  @Type(() => UserResponse)
  public author!: string;

  @Expose()
  @Type(() => CommentResponse)
  public comment!: string;
}
