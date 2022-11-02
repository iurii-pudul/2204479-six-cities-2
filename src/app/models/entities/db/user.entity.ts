import {UserType} from '../../enums/user-type.js';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import {createSHA256} from '../../../utils/common.js';
import {USER_NAME_MAX, USER_NAME_MIN} from '../../constants/constants.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps {

  constructor(data: { password: string; name: string; photo: string; type: UserType; email: string }) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.type = data.type;
  }

  @prop({required: true, default: '', minlength: USER_NAME_MIN, maxlength: USER_NAME_MAX})
  public name!: string;

  @prop({unique: true, required: true})
  public email!: string;

  @prop({required: true})
  private password!: string;

  @prop({required: true, default: ''})
  public photo?: string;

  @prop({required: true, enum: UserType, default: UserType.COMMON})
  public type!: UserType;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
