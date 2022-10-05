import {User} from '../../models/entities/user.js';
import {Post} from '../../models/entities/post.js';

export interface ValidatorInterface {
  validate(object: Post | User): string[];
}
