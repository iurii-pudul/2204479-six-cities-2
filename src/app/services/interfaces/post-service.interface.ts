import {DocumentType} from '@typegoose/typegoose';
import CreatePostDto from '../../models/dto/user/create-post.dto.js';
import {PostEntity} from '../../models/entities/db/post.entity.js';
import UpdatePostDto from '../../models/dto/user/update-post.dto.js';

export interface PostServiceInterface {
  create(dto: CreatePostDto): Promise<DocumentType<PostEntity>>;
  updateById(postId: string, dto: UpdatePostDto): Promise<DocumentType<PostEntity> | null>;
  findById(postId: string): Promise<DocumentType<PostEntity> | null>;
  deleteById(postId: string): Promise<void>;
  findAll(): Promise<DocumentType<PostEntity>[]>;
  find(): Promise<DocumentType<PostEntity>[]>;
  findPremium(): Promise<DocumentType<PostEntity>[]>;
  incCommentCount(postId: string): Promise<DocumentType<PostEntity> | null>;
  findFavorite(): Promise<DocumentType<PostEntity>[]>;
  addToFavorites(postId: string): Promise<DocumentType<PostEntity> | null>;
  deleteFromFavorites(postId: string): Promise<DocumentType<PostEntity> | null>;
}
