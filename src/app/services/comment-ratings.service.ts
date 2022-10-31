import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';
import {LoggerInterface} from './interfaces/logger.interface.js';
import chalk from 'chalk';
import {CommentRatingsServiceInterface} from './interfaces/comment-ratings-service.interface.js';
import {CommentRatingsEntity} from '../models/entities/db/comment-ratings.entity.js';
import CreateCommentRatingDto from '../models/dto/create-comment-rating.dto.js';
import {ObjectId} from 'mongodb';

@injectable()
export class CommentRatingsService implements CommentRatingsServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.CommentRatingsModel) private readonly commentRatingModel: types.ModelType<CommentRatingsEntity>
  ) {}

  public async create(dto: CreateCommentRatingDto): Promise<DocumentType<CommentRatingsEntity>> {
    const result = await this.commentRatingModel.create(dto);
    this.logger.info(chalk.green('Comment has been rated'));
    return result;
  }

  public async deleteById(ratingId: string): Promise<void> {
    this.commentRatingModel.findByIdAndDelete(ratingId).exec();
  }

  public async findByCommentId(commentId: string): Promise<number | undefined> {
    const result = await this.commentRatingModel.aggregate([
      { $match: {comment: new ObjectId(commentId)} },
      { $group: {_id: null, ratingVal :{$avg: '$rating'}} }
    ]).exec();

    return result[0]?.ratingVal;
  }
}
