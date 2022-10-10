import {User} from '../../entities/user.js';

export default class CreateCommentDto {
  public text!: string;
  public releaseDate?: Date;
  public rating!: number;
  public author!: User;
}
