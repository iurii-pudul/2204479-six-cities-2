import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {City} from '../../enums/city.js';
import {HousingType} from '../../enums/housing-type.js';
import {FacilityType} from '../../enums/facility-type.js';
import {Coordinates} from '../coordinates.js';
import {UserEntity} from './user.entity.js';
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN, GUEST_COUNT_MAX, GUEST_COUNT_MIN, PRICE_MAX, PRICE_MIN,
  ROOM_COUNT_MAX,
  ROOM_COUNT_MIN,
  TITLE_MAX,
  TITLE_MIN
} from '../../constants/constants.js';

const {prop, modelOptions} = typegoose;

export interface PostEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'posts'
  }
})
export class PostEntity extends defaultClasses.TimeStamps {

  @prop({required: true, trim: true, minlength: TITLE_MIN, maxlength: TITLE_MAX})
  public title!: string;

  @prop({required: true, trim: true, minlength: DESCRIPTION_MIN, maxlength: DESCRIPTION_MAX})
  public description!: string;

  @prop({required: true})
  public releaseDate?: Date;

  @prop({required: true, enum: City})
  public city!: City;

  @prop({required: true})
  public preview!: string;

  @prop({required: true, type: [String]}) // как то валидировать на количество элементов в массиве
  public photos!: string[];

  @prop({required: true})
  public premium!: boolean;

  @prop({required: true, enum: HousingType})
  public type!: HousingType;

  @prop({required: true, min: ROOM_COUNT_MIN, max: ROOM_COUNT_MAX})
  public roomCount!: number;

  @prop({required: true, min: GUEST_COUNT_MIN, max: GUEST_COUNT_MAX})
  public guestCount!: number;

  @prop({required: true, min: PRICE_MIN, max: PRICE_MAX})
  public price!: number;

  @prop({required: true, type: [String], enum: FacilityType})
  public facilities!: FacilityType[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public author!: Ref<UserEntity>;

  @prop({required: true})
  public coordinates!: Coordinates;

  @prop()
  public commentCount?: number;

}

export const PostModel = getModelForClass(PostEntity);
