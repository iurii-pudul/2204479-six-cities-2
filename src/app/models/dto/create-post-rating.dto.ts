import {IsInt, IsMongoId, Max, Min} from 'class-validator';

export default class CreatePostRatingDto {

  @IsInt({message: 'Field rating is required'})
  @Min(1, {message: 'Minimum rating value has to be 1'})
  @Max(5, {message: 'Maximum rating value has to be 5'})
  public rating!: number;

  @IsMongoId({message: 'Field author is required and has to be mongoId'})
  public author!: string;

  @IsMongoId({message: 'Field post is required and has to be mongoId'})
  public post!: string;
}
