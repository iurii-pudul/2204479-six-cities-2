import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';
import {LoggerInterface} from './interfaces/logger.interface.js';
import chalk from 'chalk';
import {CommentServiceInterface} from './interfaces/comment-service.interface.js';
import {CommentEntity} from '../models/entities/db/comment.entity.js';
import CreateCommentDto from '../models/dto/create-comment.dto.js';
import UpdateCommentDto from '../models/dto/update-comment.dto.js';
import {SortType} from '../models/enums/sort-type.enum.js';
import {ObjectId} from 'mongodb';

@injectable()
export class CommentService implements CommentServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(chalk.green('New comment created'));
    return result;
  }

  public async updateById(commentId: string, dto: UpdateCommentDto): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel
      .findByIdAndUpdate(commentId, dto, {new: true})
      .populate(['author', 'post'])
      .exec();
  }

  public async findById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel.findById(commentId)
      .populate(['author', 'post'])
      .exec();
  }

  public async find(): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.aggregate([
      {
        $lookup: {
          from: 'comment-ratings',
          let: { commentId: '$_id'},
          pipeline: [
            { $match: { $expr: { $eq: ['$comment', '$$commentId'] } } },
            { $project: {_id: '$_id', rating : '$rating'} }
          ],
          as: 'ratings'
        },
      },
      { $addFields:
          {
            id: { $toString: '$_id'},
            rating: { $avg : '$ratings.rating'}
          }
      },
      { $unset: ['ratings'] },
      { $sort: { offerCount: SortType.Down }},
      {
        $lookup: {
          from: 'posts',
          localField: 'post',
          foreignField: '_id',
          as: 'post',
          pipeline: [
            { $project: { rating: 0 }}
          ]
        }
      },
      { $unwind: '$post' },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
    ]).exec();
  }

  public async findAllByPostId(postId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .aggregate([
        { $match: { $expr: { $eq: ['$post', new ObjectId(postId)] } }},
        {
          $lookup: {
            from: 'comment-ratings',
            let: { commentId: '$_id', postId: '$post'},
            pipeline: [
              { $match: { $expr: { $eq: ['$comment', '$$commentId'] } }},
              { $project: {_id: '$_id', rating : '$rating'} }
            ],
            as: 'ratings'
          },
        },
        { $addFields:
            {
              id: { $toString: '$_id'},
              rating: { $ifNull: [{$avg : '$ratings.rating'}, 0] }
            }
        },
        { $unset: ['ratings'] },
      ]).exec();
  }

  public async deleteAllByPostId(postId: string): Promise<number | null> {
    const result = await this.commentModel
      .deleteMany({post: postId})
      .exec();

    return result.deletedCount;
  }

  public async deleteById(commentId: string): Promise<void> {
    this.commentModel.findByIdAndDelete(commentId).exec();
  }
}
