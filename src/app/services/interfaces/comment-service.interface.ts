import {DocumentType} from '@typegoose/typegoose';
import {CommentEntity} from '../../models/entities/db/comment.entity.js';
import CreateCommentDto from '../../models/dto/user/create-comment.dto.js';
import UpdateCommentDto from '../../models/dto/user/update-comment.dto.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  updateById(commentId: string, dto: UpdateCommentDto): Promise<DocumentType<CommentEntity> | null>;
  findById(commentId: string): Promise<DocumentType<CommentEntity> | null>;
  find(): Promise<DocumentType<CommentEntity>[]>;
  findAllByPostId(postId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteAllByPostId(postId: string): Promise<number | null>;
  deleteById(commentId: string): Promise<void>;
}
