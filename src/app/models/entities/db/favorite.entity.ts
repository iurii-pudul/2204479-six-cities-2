import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {PostEntity} from './post.entity.js';
import {UserEntity} from './user.entity.js';

const {prop, modelOptions} = typegoose;

export interface FavoriteEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'favorites'
  }
})
export class FavoriteEntity extends defaultClasses.TimeStamps {

  @prop({
    ref: PostEntity,
    required: true,
    _id: true
  })
  public postId!: Ref<PostEntity>;

  @prop({
    ref: UserEntity,
    required: true,
    _id: true
  })
  public userId!: Ref<UserEntity>;

}

export const FavoriteModel = getModelForClass(FavoriteEntity);
