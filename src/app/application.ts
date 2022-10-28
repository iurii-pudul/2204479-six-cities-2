import {LoggerInterface} from './services/interfaces/logger.interface.js';
import {ConfigInterface} from './services/interfaces/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from './types/component.js';
import {getURI} from './utils/db.js';
import {DatabaseInterface} from './services/interfaces/database-client/database.interface.js';

@injectable()
export default class Application {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private database: DatabaseInterface,
    // @inject(Component.PostServiceInterface) private postService: PostServiceInterface,
    // @inject(Component.PostRatingsServiceInterface) private postRatings: PostRatingsService,
    // @inject(Component.CommentRatingsServiceInterface) private commentRatingsService: CommentRatingsService,
    // @inject(Component.CommentServiceInterface) private commentService: CommentServiceInterface,
    // @inject(Component.FavoriteServiceInterface) private favoriteService: FavoriteServiceInterface,
    // @inject(Component.UserServiceInterface) private userService: UserServiceInterface,
  ) {}

  public async init() {
    this.logger.info('Application initialization…');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(this.config.get('DB_USER'), this.config.get('DB_PASSWORD'), this.config.get('DB_HOST'), this.config.get('DB_PORT'), this.config.get('DB_NAME'));
    await this.database.connect(uri);

    //2.1. Создание нового предложения. +
    // 2.2. Редактирование предложения. +
    // 2.3. Удаление предложения. +
    // 2.4. Получение списка предложений по аренде. +
    // 2.5. Получение детальной информации о предложении. +

    // 2.6. Получение списка комментариев для предложения. +
    // 2.7. Добавление комментария для предложения. +

    // 2.8. Создание нового пользователя. +
    // 2.9. Вход в закрытую часть приложения. -
    // 2.10. Выход из закрытой части приложения. -
    // 2.11. Проверка состояния пользователя. +

    // 2.12. Получение списка премиальных предложений для города. +
    // 2.13. Получения списка предложений, добавленных в избранное. +
    // 2.14. Добавление/удаление предложения в/из избранное. +

    // const post = await this.postService.find();
    // console.log(post);
    // console.log('-------------------------------------');
    // const postRating = await this.postRatings.findByPostId('635b964515b2c8caf1ea64fc');
    // console.log(postRating);
    // console.log('-------------------------------------');
    // const commentRating = await this.commentRatingsService.findByCommentId('635b98a4f329c34c70856de4');
    // console.log(commentRating);
    // const createPostRatingDto = new CreatePostRatingDto();
    // createPostRatingDto.rating = 3;
    // createPostRatingDto.author = '634332a3013ff8fdbf7d4126';
    // createPostRatingDto.post = '635b964515b2c8caf1ea64fc';
    // const rating = await this.postRatings.create(createPostRatingDto);
    // console.log(rating);
    // console.log('-------------------------------------');
    // const createCommentRating = new CreateCommentRatingDto();
    // createCommentRating.rating = 4;
    // createCommentRating.author = '634332a3013ff8fdbf7d4126';
    // createCommentRating.comment = '635b98a4f329c34c70856de4';
    // const commentRating = await this.commentRatingsService.create(createCommentRating);
    // console.log(commentRating);
    // console.log('-------------------------------------');
    // console.log('-------------------------------------');
    // const favorite = await this.favoriteService.addToFavorites(new CreateFavoriteDto('634332a3013ff8fdbf7d4126', '6343f1fc886434cb05ff8cbb')); // '634332a3013ff8fdbf7d4126' userId
    // console.log(favorite);
    // console.log('-------------------------------------');
    // const favorites = await this.favoriteService.findFavorites('634332a3013ff8fdbf7d4126'); // '634332a3013ff8fdbf7d4126' userId
    // console.log(favorites);
    // console.log('-------------------------------------');
    // const createCommentDto = new CreateCommentDto();
    // createCommentDto.text ='comment2222' ;
    // createCommentDto.post ='635b964515b2c8caf1ea64fc';
    // createCommentDto.author = '634332a3013ff8fdbf7d4126';
    // const comment = await this.commentService.create(createCommentDto);
    // console.log(comment);
    // console.log('-------------------------------------');
    // const updateCommentDto = new UpdateCommentDto();
    // updateCommentDto.text = 'comment123123';
    // const commentUpd = await this.commentService.updateById('635acd9a7e748c6aaf48fa43', updateCommentDto);
    // console.log(commentUpd);
    // console.log('-------------------------------------');
    // const comments = await this.commentService.deleteById('635acd9a7e748c6aaf48fa43'); // '634332a3013ff8fdbf7d4126' userId
    // console.log(comments);
    // const comments = await this.commentService.find(); // '634332a3013ff8fdbf7d4126' userId
    // console.log(comments);

    // const createUserDto = new CreateUserDto();
    // createUserDto.name = 'Iurii Pudul';
    // createUserDto.email = 'iuriipudul@gmail.com';
    // createUserDto.password = 'qweqweqwe';
    // createUserDto.photo = '/photo.png';
    // createUserDto.type = UserType.PRO;
    // const user = await this.userService.create(createUserDto, '123123123');
    // console.log(user); // 635aced356e6d6b48b443a72

    // const userUpd = new UpdateUserDto();
    // userUpd.name = 'Iurii Pudul111';
    // userUpd.photo = '/photo1.png';
    // userUpd.type = UserType.COMMON;
    // const user = await this.userService.updateById('635aced356e6d6b48b443a72', userUpd);
    // console.log(user); // 635aced356e6d6b48b443a72

    // const user = await this.userService.findById('635aced356e6d6b48b443a72');
    // console.log(user); // 635aced356e6d6b48b443a72
  }
}
