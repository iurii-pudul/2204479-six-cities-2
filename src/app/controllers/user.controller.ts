import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../types/component.js';
import {LoggerInterface} from '../services/interfaces/logger.interface.js';
import {Controller} from './controller.js';
import {HttpMethod} from '../models/enums/http-method.enum.js';
import CreateUserDto from '../models/dto/create-user.dto.js';
import {UserServiceInterface} from '../services/interfaces/user-service.interface.js';
import HttpError from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {createJWT, fillDTO} from '../utils/common.js';
import UserResponse from '../models/dto/response/user-response.js';
import LoginUserDto from '../models/dto/login-user.dto.js';
import UpdateUserDto from '../models/dto/update-user.dto.js';
import * as core from 'express-serve-static-core';
import {ValidateObjectIdMiddleware} from '../services/middlewares/validate-objectid.middleware.js';
import {ValidateDtoMiddleware} from '../services/middlewares/validate-dto.middleware.js';
import {DocumentExistsMiddleware} from '../services/middlewares/document-exists.middleware.js';
import {UploadFileMiddleware} from '../services/middlewares/upload-file.middleware.js';
import {JWT_ALGORITHM} from '../models/constants/user-constants.js';
import LoggedUserResponse from '../models/dto/response/logged-user.response.js';
import {PrivateRouteMiddleware} from '../services/middlewares/private-route.middleware.js';
import {ConfigInterface} from '../services/interfaces/config.interface.js';
import UploadUserPhotoResponse from '../models/dto/response/upload-user-photo.response.js';

type ParamsGetUser = {
  userId: string;
}

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) readonly configService: ConfigInterface,
  ) {
    super(logger, configService);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto)
      ]
    });
    this.addRoute({
      path: '/is_auth',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
    this.addRoute({
      path: '/:userId',
      method: HttpMethod.Patch,
      handler: this.updateUser,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new ValidateDtoMiddleware(UpdateUserDto),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
      ]
    });
    this.addRoute({
      path: '/:userId',
      method: HttpMethod.Get,
      handler: this.getUser,
      middlewares: [new ValidateObjectIdMiddleware('userId')]
    });
    this.addRoute({
      path: '/:userId/photo',
      method: HttpMethod.Post,
      handler: this.uploadPhoto,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'photo'),
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
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

  public async updateUser({body, params}: Request<core.ParamsDictionary | ParamsGetUser, Record<string, unknown>, UpdateUserDto>, res: Response): Promise<void> {
    const result = await this.userService.updateById(params.userId, body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(UserResponse, result)
    );
  }

  public async getUser({params}: Request<core.ParamsDictionary | ParamsGetUser>, res: Response): Promise<void> {
    const {userId} = params;
    const user = await this.userService.findById(userId);
    const userResponse = fillDTO(UserResponse, user);
    this.send(res, StatusCodes.OK, userResponse);
  }

  public async uploadPhoto(req: Request, res: Response) {
    const {userId} = req.params;
    const uploaFile = {photo: req.file?.filename};
    await this.userService.updateById(userId, uploaFile);
    this.created(res, fillDTO(UploadUserPhotoResponse, uploaFile));
  }

  public async login({body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>, res: Response): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      { email: user.email, id: user.id}
    );

    this.ok(res, {
      ...fillDTO(LoggedUserResponse, user),
      token
    });
  }

  public async checkAuthenticate(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(req.user.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserResponse, user));
  }
}
