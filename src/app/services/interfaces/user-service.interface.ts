import {UserEntity} from '../../models/entities/db/user.entity.js';
import {DocumentType} from '@typegoose/typegoose';
import CreateUserDto from '../../models/dto/create-user.dto.js';
import UpdateUserDto from '../../models/dto/update-user.dto.js';
import LoginUserDto from '../../models/dto/login-user.dto.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  login(loginDTO: LoginUserDto): Promise<string | null>
  logout(): Promise<void>
  isActive(userId: string): Promise<string | null>
}
