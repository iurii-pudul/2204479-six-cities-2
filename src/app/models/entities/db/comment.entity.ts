import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {

  @prop({required: true, trim: true, minlength: 5, maxlength: 1024})
  public text!: string;
  @prop({required: true})
  public releaseDate!: Date;
  @prop({required: true, min: 1, max: 5})
  public rating!: number;
  @prop({
    ref: UserEntity,
    required: true
  })
  public author!: Ref<UserEntity>;

}

export const CommentModel = getModelForClass(CommentEntity);
