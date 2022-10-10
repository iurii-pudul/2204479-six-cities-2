import {DocumentType} from '@typegoose/typegoose';
import {CommentEntity} from '../../models/entities/db/comment.entity.js';
import CreateCommentDto from '../../models/dto/user/create-comment.dto.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findById(commentId: string): Promise<DocumentType<CommentEntity> | null>;
}
