import {IsMongoId} from 'class-validator';

export default class CreateFavoriteDto {


  constructor(userId: string, postId: string) {
    this.userId = userId;
    this.postId = postId;
  }

  @IsMongoId({message: 'Field userId is required and has to be mongoId'})
  public userId!: string;

  @IsMongoId({message: 'Field postId is required and has to be mongoId'})
  public postId!: string;
}
