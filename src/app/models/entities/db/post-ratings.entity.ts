import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import {PostEntity} from './post.entity.js';

const {prop, modelOptions} = typegoose;

export interface PostRatingsEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'post-ratings'
  }
})
export class PostRatingsEntity extends defaultClasses.TimeStamps {

  @prop({required: true, min: 1, max: 5})
  public rating!: number;

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

export const PostRatingsModel = getModelForClass(PostRatingsEntity);
