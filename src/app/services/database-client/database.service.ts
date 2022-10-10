import mongoose from 'mongoose';
import {inject, injectable} from 'inversify';
import {DatabaseInterface} from '../interfaces/database-client/database.interface.js';
import {LoggerInterface} from '../interfaces/logger.interface.js';
import {Component} from '../../types/component.js';

@injectable()
export default class DatabaseService implements DatabaseInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Try to connect to MongoDB…');
    await mongoose.connect(uri);
    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Database connection closed.');
  }
}
