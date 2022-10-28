import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';
import {LoggerInterface} from './interfaces/logger.interface.js';
import chalk from 'chalk';
import {PostServiceInterface} from './interfaces/post-service.interface.js';
import {PostEntity} from '../models/entities/db/post.entity.js';
import CreatePostDto from '../models/dto/user/create-post.dto.js';
import UpdatePostDto from '../models/dto/user/update-post.dto.js';
import {SortType} from '../models/enums/sort-type.enum.js';

const LIMIT_OF_POSTS = 50;
const LIMIT_OF_PREMIUM_POSTS = 3;

@injectable()
export class PostService implements PostServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.PostModel) private readonly postModel: types.ModelType<PostEntity>
  ) {}

  public async create(dto: CreatePostDto): Promise<DocumentType<PostEntity>> {
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

  public async findAll(): Promise<DocumentType<PostEntity>[]> {
    return this.postModel.find()
      .limit(LIMIT_OF_POSTS)
      .sort({createdAt: SortType.Down})
      .populate(['author'])
      .exec();
  }

  public async find(): Promise<DocumentType<PostEntity>[]> {
    return this.postModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: { postId: '$_id'},
          pipeline: [
            { $match: { $expr: { $eq: ['$post', '$$postId'] } } },
            { $project: { _id: 1 }}
          ],
          as: 'comments'
        },
      },
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
            commentCount: { $size: '$comments'},
            rating: { $avg : '$ratings.rating'}
          }
      },
      { $unset: ['comments', 'ratings'] },
      { $limit: LIMIT_OF_PREMIUM_POSTS },
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

  public async deleteById(postId: string): Promise<void> {
    this.postModel.findByIdAndDelete(postId).exec();
  }

  public async findPremium(): Promise<DocumentType<PostEntity>[]> {
    return this.postModel
      .aggregate([
        {$match: {premium: true}},
        {$sort: {createdAt: SortType.Down}},
        {$limit: LIMIT_OF_PREMIUM_POSTS},
      ])
      .exec();
  }

  public async incCommentCount(postId: string): Promise<DocumentType<PostEntity> | null> {
    return this.postModel
      .findByIdAndUpdate(postId, {'$inc': {commentCount: 1}})
      .exec();
  }

  public async findFavorite(): Promise<DocumentType<PostEntity>[]> {
    return this.postModel
      .aggregate([
        {$match: {favorite: true}},
        {$sort: {createdAt: SortType.Down}}
      ])
      .exec();
  }

  public async addToFavorites(postId: string): Promise<DocumentType<PostEntity> | null> {
    return this.postModel.findByIdAndUpdate(postId, {favorite: true}, {new: true});
  }

  public async deleteFromFavorites(postId: string): Promise<DocumentType<PostEntity> | null> {
    return this.postModel.findByIdAndUpdate(postId, {favorite: false}, {new: true});
  }
}
