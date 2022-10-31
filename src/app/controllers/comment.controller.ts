import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../types/component.js';
import {LoggerInterface} from '../services/interfaces/logger.interface.js';
import {Controller} from './controller.js';
import {HttpMethod} from '../models/enums/http-method.enum.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../utils/common.js';
import {CommentServiceInterface} from '../services/interfaces/comment-service.interface.js';
import CreateCommentDto from '../models/dto/create-comment.dto.js';
import CommentResponse from '../models/dto/response/comment.response.js';
import {PostServiceInterface} from '../services/interfaces/post-service.interface.js';
import HttpError from '../errors/http-error.js';
import {ValidateDtoMiddleware} from '../services/middlewares/validate-dto,middleware.js';


@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.PostServiceInterface) private readonly postService: PostServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateCommentDto)]
    });
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentDto>, res: Response): Promise<void> {
    const result = await this.commentService.create(body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(CommentResponse, result)
    );

    if (!await this.postService.findById(body.post)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Post with id ${body.post} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(body);
    await this.postService.incCommentCount(body.post);
    this.created(res, fillDTO(CommentResponse, comment));
  }
}
