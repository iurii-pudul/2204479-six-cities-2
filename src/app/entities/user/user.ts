import {UserType} from '../enums/user-type.js';

export type User = {
  // min 1 max 15
  name: string;
  email: string;
  // Изображение пользователя в формате .jpg или .png
  photo: string;
   // min 6 max 12
  password: string;
  type: UserType;
}
