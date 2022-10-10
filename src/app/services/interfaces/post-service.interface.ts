import {DocumentType} from '@typegoose/typegoose';
import CreatePostDto from '../../models/dto/user/create-post.dto.js';
import {PostEntity} from '../../models/entities/db/post.entity.js';

export interface PostServiceInterface {
  create(dto: CreatePostDto): Promise<DocumentType<PostEntity>>;
  findById(postId: string): Promise<DocumentType<PostEntity> | null>;
}
