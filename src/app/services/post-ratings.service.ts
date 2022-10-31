import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';
import {LoggerInterface} from './interfaces/logger.interface.js';
import chalk from 'chalk';
import {PostRatingsServiceInterface} from './interfaces/post-ratings-service.interface.js';
import {PostRatingsEntity} from '../models/entities/db/post-ratings.entity.js';
import CreatePostRatingDto from '../models/dto/create-post-rating.dto.js';
import {ObjectId} from 'mongodb';

@injectable()
export class PostRatingsService implements PostRatingsServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.PostRatingsModel) private readonly postRatingModel: types.ModelType<PostRatingsEntity>
  ) {}

  public async create(dto: CreatePostRatingDto): Promise<DocumentType<PostRatingsEntity>> {
    const result = await this.postRatingModel.create(dto);
    this.logger.info(chalk.green('Post has been rated'));
    return result;
  }

  public async deleteById(ratingId: string): Promise<void> {
    this.postRatingModel.findByIdAndDelete(ratingId).exec();
  }

  public async findByPostId(postId: string): Promise<number | undefined> {
    const result = await this.postRatingModel.aggregate([
      { $match: {post: new ObjectId(postId)} },
      { $group: {_id: null, ratingVal :{$avg: '$rating'}} }
    ]).exec();

    return result[0]?.ratingVal;
  }
}
