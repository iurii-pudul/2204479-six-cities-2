import {Expose} from 'class-transformer';

export default class CommentResponse {
  @Expose()
  public text!: string;

  @Expose()
  public author!: string;

  @Expose()
  public post!: string;
}
