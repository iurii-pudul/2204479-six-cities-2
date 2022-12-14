import {LoggerInterface} from './services/interfaces/logger.interface.js';
import {ConfigInterface} from './services/interfaces/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from './types/component.js';
import {getURI} from './utils/db.js';
import {DatabaseInterface} from './services/interfaces/database-client/database.interface.js';
import express, {Express} from 'express';
import {ControllerInterface} from './controllers/controller.interface.js';
import {ExceptionFilterInterface} from './errors/exception-filter.interface.js';
import {AuthenticateMiddleware} from './services/middlewares/authenticate.middleware.js';
import {getFullServerPath} from './utils/common.js';
import cors from 'cors';

@injectable()
export default class Application {

  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private database: DatabaseInterface,
    @inject(Component.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.PostController) private postController: ControllerInterface,
    @inject(Component.CommentController) private commentController: ControllerInterface,
    @inject(Component.FavoriteController) private favoriteController: ControllerInterface,
  ) {
    this.expressApp = express();
  }

  public initRoutes() {
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/posts', this.postController.router);
    this.expressApp.use('/comments', this.commentController.router);
    this.expressApp.use('/favorites', this.favoriteController.router);
  }

  public initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.expressApp.use(
      '/static',
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );

    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
    this.expressApp.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.expressApp.use(cors());
  }

  public initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization???');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(this.config.get('DB_USER'), this.config.get('DB_PASSWORD'), this.config.get('DB_HOST'), this.config.get('DB_PORT'), this.config.get('DB_NAME'));
    await this.database.connect(uri);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();
    this.expressApp.listen(this.config.get('PORT'));
    this.logger.info(`Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);

    this.expressApp.get('/', (_req, res) => {
      res.send('Hello');
    });
  }
}
