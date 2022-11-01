import {DocumentType} from '@typegoose/typegoose';
import CreatePostDto from '../../models/dto/create-post.dto.js';
import {PostEntity} from '../../models/entities/db/post.entity.js';
import UpdatePostDto from '../../models/dto/update-post.dto.js';
import {DocumentExistsInterface} from './middleware/document-exists.interface.js';

export interface PostServiceInterface extends DocumentExistsInterface {
  create(dto: CreatePostDto): Promise<DocumentType<PostEntity>>;
  updateById(postId: string, dto: UpdatePostDto): Promise<DocumentType<PostEntity> | null>;
  findById(postId: string): Promise<DocumentType<PostEntity> | null>;
  deleteById(postId: string): Promise<void>;
  findAll(limit?: number): Promise<DocumentType<PostEntity>[]>;
  find(limit?: number, userId?: string): Promise<DocumentType<PostEntity>[]>;
  findPremium(): Promise<DocumentType<PostEntity>[]>;
  incCommentCount(postId: string): Promise<DocumentType<PostEntity> | null>;
  findFavorite(userId: string): Promise<DocumentType<PostEntity>[]>;
}
