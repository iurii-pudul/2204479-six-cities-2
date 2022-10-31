import {Expose, Type} from 'class-transformer';
import {City} from '../../enums/city.js';
import {HousingType} from '../../enums/housing-type.js';
import {FacilityType} from '../../enums/facility-type.js';
import {User} from '../../entities/user.js';
import {Comment} from '../../entities/comment.js';
import {Coordinates} from '../../entities/coordinates.js';
import CommentResponse from './comment.response.js';
import UserResponse from './user-response.js';

export default class PostResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public releaseDate!: string;

  @Expose()
  public city!: City;

  @Expose()
  public preview!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public premium!: boolean;

  @Expose()
  public favorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: HousingType;

  @Expose()
  public roomCount!: number;

  @Expose()
  public guestCount!: number;

  @Expose()
  public price!: number;

  @Expose()
  public facilities!: FacilityType[];

  @Expose()
  @Type(() => UserResponse)
  public author!: User;

  @Expose()
  public commentCount!: number;

  @Expose()
  @Type(() => CommentResponse)
  public comments!: Comment[];

  @Expose()
  public coordinates!: Coordinates;
}
