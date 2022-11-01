import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';
import {LoggerInterface} from './interfaces/logger.interface.js';
import chalk from 'chalk';
import {PostServiceInterface} from './interfaces/post-service.interface.js';
import {PostEntity} from '../models/entities/db/post.entity.js';
import CreatePostDto from '../models/dto/create-post.dto.js';
import UpdatePostDto from '../models/dto/update-post.dto.js';
import {SortType} from '../models/enums/sort-type.enum.js';
import {ObjectId} from 'mongodb';

const LIMIT_OF_POSTS = 50;
const LIMIT_OF_PREMIUM_POSTS = 3;

@injectable()
export class PostService implements PostServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.PostModel) private readonly postModel: types.ModelType<PostEntity>,
  ) {}

  public async create(dto: CreatePostDto): Promise<DocumentType<PostEntity>> {
    dto.releaseDate = new Date().toDateString();
    const result = await this.postModel.create(dto);
    this.logger.info(chalk.green('New post created'));

    return result;
  }

  public async updateById(postId: string, dto: UpdatePostDto): Promise<DocumentType<PostEntity> | null> {
    return this.postModel
      .findByIdAndUpdate(postId, dto, {new: true})
      .populate(['author'])
      .exec();
  }

  public async findAll(limit?: number): Promise<DocumentType<PostEntity>[]> {
    return this.postModel.find()
      .limit(limit ? limit : LIMIT_OF_POSTS)
      .sort({createdAt: SortType.Down})
      .populate(['author'])
      .exec();
  }

  // todo add favorite field when authorized user will be in session
  public async find(limit?: number): Promise<DocumentType<PostEntity>[]> {
    return this.postModel.aggregate([
      {
        $lookup: {
          from: 'post-ratings',
          let: { postId: '$_id'},
          pipeline: [
            { $match: { $expr: { $eq: ['$post', '$$postId'] } } },
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
      { $limit: limit ? +limit : LIMIT_OF_POSTS },
      { $sort: { offerCount: SortType.Down }},
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      }
    ]).exec();
  }

  public async findById(postId: string): Promise<DocumentType<PostEntity> | null> {
    return this.postModel.findById(postId).exec();
  }

  public async exists(postId: string): Promise<boolean> {
    return (await this.postModel.exists({_id: postId})) !== null;
  }

  public async deleteById(postId: string): Promise<void> {
    this.postModel.findByIdAndDelete(postId).exec();
  }

  public async findPremium(): Promise<DocumentType<PostEntity>[]> {
    return this.postModel.find({premium: true})
      .limit(LIMIT_OF_PREMIUM_POSTS)
      .sort({createdAt: SortType.Down})
      .exec();
  }

  public async incCommentCount(postId: string): Promise<DocumentType<PostEntity> | null> {
    return this.postModel
      .findByIdAndUpdate(postId, {'$inc': {commentCount: 1}})
      .exec();
  }

  public async findFavorite(userId: string): Promise<DocumentType<PostEntity>[]> {
    return this.postModel
      .aggregate([
        {
          $lookup: {
            from: 'favorites',
            let: { postId: '$_id', userId: new ObjectId(userId)},
            pipeline: [
              { $match: {
                $and: [
                  { $expr: { $eq: ['$postId', '$$postId'] } },
                  { $expr: { $eq: ['$userId', '$$userId'] } },
                ]
              } }
            ],
            as: 'favorites'
          },
        },
        { $addFields:
            {
              id: { $toString: '$_id'},
              favorite: { $gt: [ { $size: '$favorites' }, 0] }
            }
        },
        { $unset: ['favorites'] },
      ]);
  }
}
