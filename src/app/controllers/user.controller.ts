import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../types/component.js';
import {LoggerInterface} from '../services/interfaces/logger.interface.js';
import {Controller} from './controller.js';
import {HttpMethod} from '../models/enums/http-method.enum.js';
import CreateUserDto from '../models/dto/create-user.dto.js';
import {ConfigInterface} from '../services/interfaces/config.interface.js';
import {UserServiceInterface} from '../services/interfaces/user-service.interface.js';
import HttpError from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../utils/common.js';
import UserResponse from '../models/dto/response/user-response.js';
import LoginUserDto from '../models/dto/login-user.dto.js';
import UpdateUserDto from '../models/dto/update-user.dto.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:userId', method: HttpMethod.Put, handler: this.updateUser});
    this.addRoute({path: '/:userId', method: HttpMethod.Get, handler: this.getUser});
    this.addRoute({path: '/login', method: HttpMethod.Post, handler: this.login});
    this.addRoute({path: '/logout', method: HttpMethod.Post, handler: this.logout});
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(UserResponse, result)
    );
  }

  public async updateUser({body}: Request<Record<string, unknown>, Record<string, unknown>, UpdateUserDto>, res: Response): Promise<void> {
    const result = await this.userService.updateById(body.id, body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(UserResponse, result)
    );
  }

  public async getUser(_req: Request, res: Response): Promise<void> {
    console.log(_req.params);
    const user = await this.userService.findById(_req.params.userId);
    const userResponse = fillDTO(UserResponse, user);
    this.send(res, StatusCodes.OK, userResponse);
  }

  public async login({body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>, _res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);
    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async logout({body}: Request<Record<string, unknown>, Record<string, unknown>, string>, _res: Response): Promise<void> {
    console.log(body);
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }
}
