import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';
import {LoggerInterface} from './interfaces/logger.interface.js';
import chalk from 'chalk';
import {CommentServiceInterface} from './interfaces/comment-service.interface.js';
import {CommentEntity} from '../models/entities/db/comment.entity.js';
import CreateCommentDto from '../models/dto/user/create-comment.dto.js';

@injectable()
export class CommentService implements CommentServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    dto.releaseDate = new Date();

    const result = await this.commentModel.create(dto);
    this.logger.info(chalk.green('New comment created'));

    return result;
  }

  public async findById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    return await this.commentModel.findById(commentId).exec();
  }
}
