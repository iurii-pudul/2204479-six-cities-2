import {DocumentType} from '@typegoose/typegoose';
import {CommentRatingsEntity} from '../../models/entities/db/comment-ratings.entity.js';
import CreateCommentRatingDto from '../../models/dto/user/create-comment-rating.dto.js';


export interface CommentRatingsServiceInterface {
  create(dto: CreateCommentRatingDto): Promise<DocumentType<CommentRatingsEntity>>;
  deleteById(ratingId: string): Promise<void>;
  findByCommentId(commentId: string): Promise<number | undefined>;
}
