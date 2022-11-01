import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../types/component.js';
import {LoggerInterface} from '../services/interfaces/logger.interface.js';
import {Controller} from './controller.js';
import {HttpMethod} from '../models/enums/http-method.enum.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../utils/common.js';
import {PostServiceInterface} from '../services/interfaces/post-service.interface.js';
import CreatePostDto from '../models/dto/create-post.dto.js';
import UpdatePostDto from '../models/dto/update-post.dto.js';
import PostResponse from '../models/dto/response/post-response.js';
import {CommentServiceInterface} from '../services/interfaces/comment-service.interface.js';
import CommentResponse from '../models/dto/response/comment.response.js';
import * as core from 'express-serve-static-core';
import {RequestQuery} from '../types/request-query.type.js';
import {ValidateObjectIdMiddleware} from '../services/middlewares/validate-objectid.middleware.js';
import {ValidateDtoMiddleware} from '../services/middlewares/validate-dto.middleware.js';
import {DocumentExistsMiddleware} from '../services/middlewares/document-exists.middleware.js';
import CreatePostRatingDto from '../models/dto/create-post-rating.dto.js';
import {PostRatingsServiceInterface} from '../services/interfaces/post-ratings-service.interface.js';
import PostRatingResponse from '../models/dto/response/post-rating.response.js';

type ParamsGetPost = {
  postId: string;
}

type ParamsGetUser = {
  userId: string;
}

@injectable()
export default class PostController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.PostServiceInterface) private readonly postService: PostServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.PostRatingsServiceInterface) private readonly postRatingService: PostRatingsServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for PostController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getAllPosts});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreatePostDto)]
    });
    this.addRoute({
      path: '/:postId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateDtoMiddleware(UpdatePostDto),
        new DocumentExistsMiddleware(this.postService, 'Post', 'postId'),
      ]
    });
    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.getAllPremium});
    this.addRoute({
      path: '/:postId',
      method: HttpMethod.Get,
      handler: this.getPost,
      middlewares: [
        new ValidateObjectIdMiddleware('postId'),
        new DocumentExistsMiddleware(this.postService, 'Post', 'postId'),
      ]
    });
    this.addRoute({
      path: '/:postId',
      method: HttpMethod.Delete,
      handler: this.deletePost,
      middlewares: [new ValidateObjectIdMiddleware('postId')]
    });
    this.addRoute({
      path: '/:postId/favorites/:userId',
      method: HttpMethod.Get,
      handler: this.getAllFavorites,
      middlewares: [
        new ValidateObjectIdMiddleware('postId'),
        new ValidateObjectIdMiddleware('userId')
      ]
    });
    this.addRoute({
      path: '/:postId/comments',
      method: HttpMethod.Get,
      handler: this.getAllComments,
      middlewares: [
        new ValidateObjectIdMiddleware('postId'),
        new DocumentExistsMiddleware(this.postService, 'Post', 'postId'),
      ]
    });
    this.addRoute({
      path: '/rate',
      method: HttpMethod.Post,
      handler: this.rate,
      middlewares: [new ValidateDtoMiddleware(CreatePostRatingDto)]
    });
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreatePostDto>, res: Response): Promise<void> {
    const result = await this.postService.create(body);
    this.send(res, StatusCodes.CREATED, fillDTO(PostResponse, result));
  }

  public async update({body, params}: Request<core.ParamsDictionary | ParamsGetPost, Record<string, unknown>, UpdatePostDto>, res: Response): Promise<void> {
    const updatedPost = await this.postService.updateById(params.postId, body);
    this.send(res, StatusCodes.CREATED, fillDTO(PostResponse, updatedPost));
  }

  public async deletePost(req: Request, res: Response): Promise<void> {
    await this.postService.deleteById(req.params.postId);
    this.send(res, StatusCodes.CREATED, {value: req.params.postId});
  }

  public async getPost({params}: Request<core.ParamsDictionary | ParamsGetPost>, res: Response): Promise<void> {
    const {postId} = params;
    const post = await this.postService.findById(postId);
    const postResponse = fillDTO(PostResponse, post);
    this.send(res, StatusCodes.OK, postResponse);
  }

  public async getAllPosts({query}: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const postList = await this.postService.find(query.limit);
    const postResponse = fillDTO(PostResponse, postList);
    this.send(res, StatusCodes.OK, postResponse);
  }

  public async getAllPremium(_req: Request, res: Response): Promise<void> {
    const postList = await this.postService.findPremium();
    const postResponse = fillDTO(PostResponse, postList);
    this.send(res, StatusCodes.OK, postResponse);
  }

  public async getAllFavorites({params}: Request<core.ParamsDictionary | ParamsGetUser>, res: Response): Promise<void> {
    const {userId} = params;
    const postList = await this.postService.findFavorite(userId);
    const postResponse = fillDTO(PostResponse, postList);
    this.send(res, StatusCodes.OK, postResponse);
  }

  public async getAllComments({params}: Request<core.ParamsDictionary | ParamsGetPost>, res: Response): Promise<void> {
    const {postId} = params;
    const commentList = await this.commentService.findAllByPostId(postId);
    const commentResponse = fillDTO(CommentResponse, commentList);
    this.send(res, StatusCodes.OK, commentResponse);
  }

  public async rate({body}: Request<Record<string, unknown>, Record<string, unknown>, CreatePostRatingDto>, res: Response): Promise<void> {
    const result = await this.postRatingService.create(body);
    this.send(res, StatusCodes.CREATED, fillDTO(PostRatingResponse, result));
  }
}
