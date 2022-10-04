import {User} from './user.js';
import {Coordinates} from './coordinates.js';
import {City} from '../enums/city.js';
import {HousingType} from '../enums/housing-type.js';
import {FacilityType} from '../enums/facility-type.js';

export type Post = {

  // min 10 max 100
  title: string;
  // min 20 max 1024
  description: string;
  releaseDate: Date;
  city: City;
  // Ссылка на изображение, которое используется в качестве превью
  preview: string;
  // 6 штук
  photos: string[];
  // Признак премиальности предложения
  premium: boolean;
  // Признак того, что предложение принадлежит списку избранных предложений пользователя
  favorite: boolean;
  // Число от 1 до 5. Допускаются числа с запятой (1 знак после запятой)
  rating: number;
  type: HousingType;
  // min 1 max 8
  roomCount: number;
  // min 1 max 10
  guestCount: number;
  // min 100 max 100000
  price: number;
  facilities: FacilityType[];
  author: User;
  commentCount?: number;
  coordinates: Coordinates;
}
