import {UserType} from '../../enums/user-type.js';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import {createSHA256} from '../../../utils/common.js';
import CreateUserDto from '../../dto/user/create-user.dto.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps {

  constructor(data: CreateUserDto) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.photo = data.photo;
    this.type = data.type;
  }

  @prop({required: true, default: ''})
  public name!: string;
  @prop({unique: true, required: true})
  public email!: string;
  @prop({required: true})
  private password!: string;
  @prop({required: true, default: ''})
  public photo!: string;
  @prop({required: true, enum: UserType, default: UserType.COMMON})
  public type!: UserType;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
