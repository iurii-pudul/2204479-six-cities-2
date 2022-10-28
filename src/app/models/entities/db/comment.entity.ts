import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import {PostEntity} from './post.entity.js';

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
