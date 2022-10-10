import {LoggerInterface} from './services/interfaces/logger.interface.js';
import {ConfigInterface} from './services/interfaces/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from './types/component.js';

@injectable()
export default class Application {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
  ) {}

  public async init() {
    this.logger.info('Application initialization…');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
