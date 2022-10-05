import 'reflect-metadata';
import LoggerService from './app/services/logger/logger.service.js';
import {ConfigService} from './app/services/config/config.service.js';
import Application from './app/application.js';
import {Container} from 'inversify';
import {Component} from './app/types/component.js';
import {LoggerInterface} from './app/services/interfaces/logger.interface.js';
import {ConfigInterface} from './app/services/interfaces/config.interface.js';


const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();


const application = applicationContainer.get<Application>(Component.Application);
await application.init();
