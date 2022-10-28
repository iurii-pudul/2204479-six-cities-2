import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';
import {LoggerInterface} from './interfaces/logger.interface.js';
import {FavoriteServiceInterface} from './interfaces/favorite-service.interface.js';
import {FavoriteEntity} from '../models/entities/db/favorite.entity.js';
import {SortType} from '../models/enums/sort-type.enum.js';
import chalk from 'chalk';
import CreateFavoriteDto from '../models/dto/user/create-favorite.dto.js';

@injectable()
export class FavoriteService implements FavoriteServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) {}

  public async addToFavorites(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>> {
    const result = this.favoriteModel.create(dto);
    this.logger.info(chalk.green('Post added to favorites'));
    return result;
  }

  public async findFavorites(userId: string): Promise<DocumentType<FavoriteEntity>[]> {
    return this.favoriteModel
      .aggregate([
        {$match: {userId: userId}},
        {$sort: {createdAt: SortType.Down}},
      ]);
  }

  public async deleteFromFavorites(postId: string, userId: string): Promise<void> {
    this.favoriteModel.findOneAndRemove({userId: userId, postId: postId});
  }
}
