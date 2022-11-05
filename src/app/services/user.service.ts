import {UserServiceInterface} from './interfaces/user-service.interface.js';
import {UserEntity} from '../models/entities/db/user.entity.js';
import {DocumentType, types} from '@typegoose/typegoose';
import CreateUserDto from '../models/dto/create-user.dto.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';
import {LoggerInterface} from './interfaces/logger.interface.js';
import chalk from 'chalk';
import UpdateUserDto from '../models/dto/update-user.dto.js';
import LoginUserDto from '../models/dto/login-user.dto.js';
import {DEFAULT_PHOTO_FILE_NAME} from '../models/constants/user-constants.js';

@injectable()
export class UserService implements UserServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, photo: DEFAULT_PHOTO_FILE_NAME});
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(chalk.green(`New user created: ${user.email}`));

    return result;
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId).exec();
  }

  public async exists(postId: string): Promise<boolean> {
    return (await this.userModel.exists({_id: postId})) !== null;
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (! user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }
}
