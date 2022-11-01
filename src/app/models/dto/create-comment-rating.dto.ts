import {IsInt, IsMongoId, Max, Min} from 'class-validator';
import {COMMENT_RATING_MAX, COMMENT_RATING_MIN} from '../constants/constants.js';

export default class CreateCommentRatingDto {

  @IsInt({message: 'Field rating is required'})
  @Min(COMMENT_RATING_MIN, {message: `Minimum rating value has to be ${COMMENT_RATING_MIN}`})
  @Max(COMMENT_RATING_MAX, {message: `Maximum rating value has to be ${COMMENT_RATING_MAX}`})
  public rating!: number;

  @IsMongoId({message: 'Field author is required and has to be mongoId'})
  public author!: string;

  @IsMongoId({message: 'Field comment is required and has to be mongoId'})
  public comment!: string;
}
