import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../types/component.js';
import {LoggerInterface} from '../services/interfaces/logger.interface.js';
import {Controller} from './controller.js';
import {HttpMethod} from '../models/enums/http-method.enum.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../utils/common.js';
import {FavoriteServiceInterface} from '../services/interfaces/favorite-service.interface.js';
import FavoriteResponse from '../models/dto/response/favorite.response.js';
import {ValidateDtoMiddleware} from '../services/middlewares/validate-dto.middleware.js';
import CreateFavoriteDto from '../models/dto/create-favorite.dto.js';
import {PrivateRouteMiddleware} from '../services/middlewares/private-route.middleware.js';
import {ConfigInterface} from '../services/interfaces/config.interface.js';


@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
  ) {
    super(logger, configService);
    this.logger.info('Register routes for FavoriteController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.addToFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateFavoriteDto)
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Delete,
      handler: this.deleteFromFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateFavoriteDto)
      ],
    });
  }

  public async addToFavorites({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateFavoriteDto>, res: Response): Promise<void> {
    const favorite = await this.favoriteService.addToFavorites(body);
    const favoriteResponse = fillDTO(FavoriteResponse, favorite);
    this.send(res, StatusCodes.OK, favoriteResponse);
  }

  public async deleteFromFavorites({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateFavoriteDto>, res: Response): Promise<void> {
    await this.favoriteService.deleteFromFavorites(body.postId, body.userId);
    this.send(res, StatusCodes.OK, body);
  }
}
