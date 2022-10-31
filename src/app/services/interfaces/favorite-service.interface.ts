import {DocumentType} from '@typegoose/typegoose';
import {FavoriteEntity} from '../../models/entities/db/favorite.entity.js';
import CreateFavoriteDto from '../../models/dto/create-favorite.dto.js';

export interface FavoriteServiceInterface {
  addToFavorites(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>>;
  findFavorites(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  deleteFromFavorites(postId: string, userId: string): Promise<void>;
}
