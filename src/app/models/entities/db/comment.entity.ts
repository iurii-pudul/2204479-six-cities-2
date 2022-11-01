import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import {PostEntity} from './post.entity.js';
import {COMMENT_TEXT_MAX, COMMENT_TEXT_MIN} from '../../dto/constants.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {

  @prop({required: true, trim: true, minlength: COMMENT_TEXT_MIN, maxlength: COMMENT_TEXT_MAX})
  public text!: string;

  @prop({
    ref: PostEntity,
    required: true
  })
  public post!: Ref<PostEntity>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public author!: Ref<UserEntity>;

}

export const CommentModel = getModelForClass(CommentEntity);
