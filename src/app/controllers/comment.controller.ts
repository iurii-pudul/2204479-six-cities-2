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
import {ValidateDtoMiddleware} from '../services/middlewares/validate-dto.middleware.js';
import CreateCommentRatingDto from '../models/dto/create-comment-rating.dto.js';
import {CommentRatingsServiceInterface} from '../services/interfaces/comment-ratings-service.interface.js';
import CommentRatingResponse from '../models/dto/response/comment-rating.response.js';
import {PrivateRouteMiddleware} from '../services/middlewares/private-route.middleware.js';
import {ConfigInterface} from '../services/interfaces/config.interface.js';


@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.PostServiceInterface) private readonly postService: PostServiceInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.CommentRatingsServiceInterface) private readonly commentRatingService: CommentRatingsServiceInterface,
  ) {
    super(logger, configService);
    this.logger.info('Register routes for CommentControllerâ€¦');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
    this.addRoute({
      path: '/rate',
      method: HttpMethod.Post,
      handler: this.rate,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentRatingDto)
      ]
    });
  }

  public async create(req: Request<object, object, CreateCommentDto>, res: Response): Promise<void> {
    const {body} = req;

    if (!await this.postService.findById(body.post)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Post with id ${body.post} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({...body, author: req.user.id});
    await this.postService.incCommentCount(body.post);
    this.created(res, fillDTO(CommentResponse, comment));
  }

  public async rate({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentRatingDto>, res: Response): Promise<void> {
    const commentRating = await this.commentRatingService.create(body);
    this.created(res, fillDTO(CommentRatingResponse, commentRating));
  }
}
