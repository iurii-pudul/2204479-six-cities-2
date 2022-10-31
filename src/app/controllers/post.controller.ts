import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../types/component.js';
import {LoggerInterface} from '../services/interfaces/logger.interface.js';
import {Controller} from './controller.js';
import {HttpMethod} from '../models/enums/http-method.enum.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../utils/common.js';
import UserResponse from '../models/dto/response/user-response.js';
import {PostServiceInterface} from '../services/interfaces/post-service.interface.js';
import CreatePostDto from '../models/dto/create-post.dto.js';
import UpdatePostDto from '../models/dto/update-post.dto.js';
import PostResponse from '../models/dto/response/post-response.js';
import {CommentServiceInterface} from '../services/interfaces/comment-service.interface.js';
import CreateCommentDto from '../models/dto/create-comment.dto.js';
import CommentResponse from '../models/dto/response/comment.response.js';

@injectable()
export default class PostController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.PostServiceInterface) private readonly postService: PostServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);
    this.logger.info('Register routes for PostController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getAllPosts});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/', method: HttpMethod.Put, handler: this.update});
    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.getAllPremium});
    this.addRoute({path: '/:postId', method: HttpMethod.Get, handler: this.getPost});
    this.addRoute({path: '/:postId', method: HttpMethod.Delete, handler: this.deletePost});
    this.addRoute({path: '/:postId/favorites/:userId', method: HttpMethod.Get, handler: this.getAllFavorites});
    this.addRoute({path: '/:postId/favorites/:userId', method: HttpMethod.Post, handler: this.addToFavorites});
    this.addRoute({path: '/:postId/favorites/:userId', method: HttpMethod.Delete, handler: this.deleteFromFavorites});
    this.addRoute({path: '/:postId/comments', method: HttpMethod.Get, handler: this.getAllComments});
    this.addRoute({path: '/:postId/comments', method: HttpMethod.Post, handler: this.addComment});
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreatePostDto>, res: Response): Promise<void> {
    const result = await this.postService.create(body);
    this.send(res, StatusCodes.CREATED, fillDTO(UserResponse, result)
    );
  }

  public async update({body}: Request<Record<string, unknown>, Record<string, unknown>, UpdatePostDto>, res: Response): Promise<void> {
    const updatedPost = await this.postService.updateById(body.id, body);
    this.send(res, StatusCodes.CREATED, fillDTO(PostResponse, updatedPost));
  }

  public async deletePost(req: Request, res: Response): Promise<void> {
    await this.postService.deleteById(req.params.postId);
    this.send(res, StatusCodes.CREATED, {value: req.params.postId});
  }

  public async getPost(req: Request, res: Response): Promise<void> {
    const post = await this.postService.findById(req.params.postId);
    const postResponse = fillDTO(PostResponse, post);
    this.send(res, StatusCodes.OK, postResponse);
  }

  public async getAllPosts(_req: Request, res: Response): Promise<void> {
    const postList = await this.postService.find();
    const postResponse = fillDTO(PostResponse, postList);
    this.send(res, StatusCodes.OK, postResponse);
  }

  public async getAllPremium(_req: Request, res: Response): Promise<void> {
    const postList = await this.postService.findPremium();
    const postResponse = fillDTO(PostResponse, postList);
    this.send(res, StatusCodes.OK, postResponse);
  }

  public async getAllFavorites(req: Request, res: Response): Promise<void> {
    const postList = await this.postService.findFavorite(req.params.userId);
    const postResponse = fillDTO(PostResponse, postList);
    this.send(res, StatusCodes.OK, postResponse);
  }

  public async addToFavorites(req: Request, res: Response): Promise<void> {
    const postList = await this.postService.addToFavorites(req.params.userId, req.params.postId);
    const postResponse = fillDTO(PostResponse, postList);
    this.send(res, StatusCodes.OK, postResponse);
  }

  public async deleteFromFavorites(req: Request, res: Response): Promise<void> {
    const postList = await this.postService.deleteFromFavorites(req.params.userId, req.params.postId);
    const postResponse = fillDTO(PostResponse, postList);
    this.send(res, StatusCodes.OK, postResponse);
  }

  public async addComment({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentDto>, res: Response): Promise<void> {
    const comment = await this.commentService.create(body);
    const commentResponse = fillDTO(CommentResponse, comment);
    this.send(res, StatusCodes.OK, commentResponse);
  }

  public async getAllComments(req: Request, res: Response): Promise<void> {
    const commentList = await this.commentService.findAllByPostId(req.params.postId);
    const commentResponse = fillDTO(CommentResponse, commentList);
    this.send(res, StatusCodes.OK, commentResponse);
  }
}
