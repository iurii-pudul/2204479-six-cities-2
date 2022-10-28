import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import {CommentEntity} from './comment.entity.js';

const {prop, modelOptions} = typegoose;

export interface CommentRatingsEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comment-ratings'
  }
})
export class CommentRatingsEntity extends defaultClasses.TimeStamps {

  @prop({required: true, min: 1, max: 5})
  public rating!: number;

  @prop({
    ref: CommentEntity,
    required: true
  })
  public comment!: Ref<CommentEntity>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public author!: Ref<UserEntity>;

}

export const CommentRatingsModel = getModelForClass(CommentRatingsEntity);
