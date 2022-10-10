import 'reflect-metadata';
import LoggerService from './app/services/logger/logger.service.js';
import {ConfigService} from './app/services/config/config.service.js';
import Application from './app/application.js';
import {Container} from 'inversify';
import {Component} from './app/types/component.js';
import {LoggerInterface} from './app/services/interfaces/logger.interface.js';
import {ConfigInterface} from './app/services/interfaces/config.interface.js';
import DatabaseService from './app/services/database-client/database.service.js';
import {DatabaseInterface} from './app/services/interfaces/database-client/database.interface.js';
import {UserService} from './app/services/user.service.js';
import {UserServiceInterface} from './app/services/interfaces/user-service.interface.js';
import {UserEntity, UserModel} from './app/models/entities/db/user.entity.js';
import {types} from '@typegoose/typegoose';
import {CommentEntity, CommentModel} from './app/models/entities/db/comment.entity.js';
import {CommentService} from './app/services/comment.service.js';
import {CommentServiceInterface} from './app/services/interfaces/comment-service.interface.js';
import {PostServiceInterface} from './app/services/interfaces/post-service.interface.js';
import {PostService} from './app/services/post.service.js';
import {PostEntity, PostModel} from './app/models/entities/db/post.entity.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();
applicationContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
applicationContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
applicationContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService);
applicationContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
applicationContainer.bind<PostServiceInterface>(Component.PostServiceInterface).to(PostService);
applicationContainer.bind<types.ModelType<PostEntity>>(Component.PostModel).toConstantValue(PostModel);


const application = applicationContainer.get<Application>(Component.Application);
await application.init();
