import {Expose} from 'class-transformer';

export default class UploadUserPhotoResponse {
  @Expose()
  public filepath!: string;
}
