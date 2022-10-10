import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {City} from '../../enums/city.js';
import {HousingType} from '../../enums/housing-type.js';
import {FacilityType} from '../../enums/facility-type.js';
import {Coordinates} from '../coordinates.js';
import {UserEntity} from './user.entity.js';
import {CommentEntity} from './comment.entity.js';

const {prop, modelOptions} = typegoose;

export interface PostEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'posts'
  }
})
export class PostEntity extends defaultClasses.TimeStamps {

  @prop({required: true, trim: true, minlength: 10, maxlength: 100})
  public title!: string;

  @prop({required: true, trim: true, minlength: 20, maxlength: 1024})
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

  @prop({required: true})
  public favorite!: boolean;

  @prop({required: true, min: 1, max: 5})
  public rating!: number;

  @prop({required: true, enum: HousingType})
  public type!: HousingType;

  @prop({required: true, min: 1, max: 8})
  public roomCount!: number;

  @prop({required: true, min: 1, max: 10})
  public guestCount!: number;

  @prop({required: true, min: 100, max: 100000})
  public price!: number;

  @prop({required: true, type: [String], enum: FacilityType})
  public facilities!: FacilityType[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public author!: Ref<UserEntity>;

  @prop({
    ref: CommentEntity,
    required: true,
    default: [],
    _id: false
  })
  public comments?: Ref<CommentEntity>[];

  @prop({required: true})
  public coordinates!: Coordinates;

}

export const PostModel = getModelForClass(PostEntity);
