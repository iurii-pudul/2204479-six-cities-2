import {DocumentType} from '@typegoose/typegoose';
import {PostRatingsEntity} from '../../models/entities/db/post-ratings.entity.js';
import CreatePostRatingDto from '../../models/dto/create-post-rating.dto.js';

export interface PostRatingsServiceInterface {
  create(dto: CreatePostRatingDto): Promise<DocumentType<PostRatingsEntity>>;
  deleteById(ratingId: string): Promise<void>;
  findByPostId(postId: string): Promise<number | undefined>;
}
