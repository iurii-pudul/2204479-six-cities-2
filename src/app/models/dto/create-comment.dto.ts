import {IsMongoId, IsString} from 'class-validator';

export default class CreateCommentDto {

  @IsString({message: 'Field text is required'})
  public text!: string;

  @IsMongoId({message: 'Field author is required and has to be mongoId'})
  public author!: string;

  @IsMongoId({message: 'Field post is required and has to be mongoId'})
  public post!: string;
}
