import {IsInt, IsMongoId, Max, Min} from 'class-validator';
import {POST_RATING_MAX, POST_RATING_MIN} from '../constants/constants.js';

export default class CreatePostRatingDto {

  @IsInt({message: 'Field rating is required'})
  @Min(POST_RATING_MIN, {message: `Minimum rating value has to be ${POST_RATING_MIN}`})
  @Max(POST_RATING_MAX, {message: `Maximum rating value has to be ${POST_RATING_MAX}`})
  public rating!: number;

  @IsMongoId({message: 'Field author is required and has to be mongoId'})
  public author!: string;

  @IsMongoId({message: 'Field post is required and has to be mongoId'})
  public post!: string;
}
