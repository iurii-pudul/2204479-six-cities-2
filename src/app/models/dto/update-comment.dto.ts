import {IsString} from 'class-validator';

export default class UpdateCommentDto {

  @IsString({message: 'Field text is required'})
  public text!: string;
}
