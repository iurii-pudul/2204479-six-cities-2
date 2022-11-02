import {Expose} from 'class-transformer';

export default class LoggedUserResponse {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;

  @Expose()
  public photo!: string;

  @Expose()
  public name!: string;
}
