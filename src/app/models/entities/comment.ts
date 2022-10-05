import {User} from './user.js';

export type Comment = {
  // min 5 max 1024
  text: string;
  releaseDate: Date;
  // Число от 1 до 5
  rating: string;
  author: User;
}
