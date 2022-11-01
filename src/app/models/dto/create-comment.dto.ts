import {IsMongoId, IsString, MaxLength, MinLength} from 'class-validator';
import {COMMENT_TEXT_MAX, COMMENT_TEXT_MIN} from '../constants/constants.js';

export default class CreateCommentDto {

  @IsString({message: 'Field text is required'})
  @MinLength(COMMENT_TEXT_MIN, {message: `comment length has to be grater than ${COMMENT_TEXT_MIN}`})
  @MaxLength(COMMENT_TEXT_MAX, {message: `comment length has to be less than ${COMMENT_TEXT_MAX}`})
  public text!: string;

  public author!: string;

  @IsMongoId({message: 'Field post is required and has to be mongoId'})
  public post!: string;
}
