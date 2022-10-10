import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';
import {LoggerInterface} from './interfaces/logger.interface.js';
import chalk from 'chalk';
import {PostServiceInterface} from './interfaces/post-service.interface.js';
import {PostEntity} from '../models/entities/db/post.entity.js';
import CreatePostDto from '../models/dto/user/create-post.dto.js';

@injectable()
export class PostService implements PostServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.PostModel) private readonly postModel: types.ModelType<PostEntity>
  ) {}

  public async create(dto: CreatePostDto): Promise<DocumentType<PostEntity>> {
    dto.releaseDate = new Date();
    dto.commentCount = 0; // count comments here

    const result = await this.postModel.create(dto);
    this.logger.info(chalk.green('New post created'));

    return result;
  }

  public async findById(postId: string): Promise<DocumentType<PostEntity> | null> {
    return await this.postModel.findById(postId).exec();
  }
}
