import {CliCommandInterface} from '../interfaces/cli-command.interface.js';
import TSVFileReader from '../file/tsv-file-reader.js';
import chalk from 'chalk';
import {createPost, getErrorMessage} from '../../utils/common.js';
import {getURI} from '../../utils/db.js';
import ConsoleLoggerService from '../logger/console-logger.service.js';
import {LoggerInterface} from '../interfaces/logger.interface.js';
import {DatabaseInterface} from '../interfaces/database-client/database.interface.js';
import {PostServiceInterface} from '../interfaces/post-service.interface.js';
import {UserServiceInterface} from '../interfaces/user-service.interface.js';
import {PostService} from '../post.service.js';
import {UserService} from '../user.service.js';
import {PostModel} from '../../models/entities/db/post.entity.js';
import {UserModel} from '../../models/entities/db/user.entity.js';
import DatabaseService from '../database-client/database.service.js';
import generator from 'generate-password';
import {CommentService} from '../comment.service.js';
import {CommentModel} from '../../models/entities/db/comment.entity.js';
import {CommentServiceInterface} from '../interfaces/comment-service.interface.js';
import {FavoriteModel} from '../../models/entities/db/favorite.entity.js';
import {FavoriteServiceInterface} from '../interfaces/favorite-service.interface.js';
import {FavoriteService} from '../favorite.service.js';
import {PostRatingsServiceInterface} from '../interfaces/post-ratings-service.interface.js';
import {PostRatingsService} from '../post-ratings.service.js';
import {PostRatingsModel} from '../../models/entities/db/post-ratings.entity.js';
import CreateCommentDto from '../../models/dto/create-comment.dto.js';
import CreatePostImportDto from '../../models/dto/create-post-import.dto.js';

const DEFAULT_DB_PORT = 27017;

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private userService!: UserServiceInterface;
  private postService!: PostServiceInterface;
  private commentService!: CommentServiceInterface;
  private favoriteService!: FavoriteServiceInterface;
  private postRatingService!: PostRatingsServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.postService = new PostService(this.logger, PostModel);
    this.userService = new UserService(this.logger, UserModel);
    this.favoriteService = new FavoriteService(this.logger, FavoriteModel);
    this.commentService = new CommentService(this.logger, CommentModel);
    this.postRatingService = new PostRatingsService(this.logger, PostRatingsModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    console.log(chalk.green('IMPORT COMMAND HAS BEEN STARTED WITH PARAMS:'));
    console.log(chalk.blue(`FILENAME, LOGIN, PASSWORD, HOST, DBNAME, SALT ${filename}, ${login}, ${host}, ${dbname}, ${salt}`));
    const uri = getURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);


    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      console.log(chalk.green(`${filename} HAS BEEN FOUND`));
      await fileReader.read();
      console.log(chalk.green('IMPORT COMMAND HAS BEEN DONE!'));
    } catch(err) {
      console.log(chalk.red(`Can't read the file: ${getErrorMessage(err)}`));
    }
  }

  private async onLine(line: string, resolve: () => void) {
    const post = createPost(line);
    await this.savePost(post);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  private async savePost(post: CreatePostImportDto) {
    console.log(post);
    const userEntity = await this.userService.findOrCreate({
      ...post.author,
      password: post.author?.password ? post.author.password : generator.generate({ length: 12, numbers: true }),
    }, this.salt);

    const postEntity = await this.postService.create({
      ...post,
      author: userEntity.id,
    });

    if (post.favorite) {
      await this.favoriteService.addToFavorites({userId: userEntity.id, postId: postEntity.id});
    }

    if (post.rating) {
      await this.postRatingService.create({rating: post.rating, author: userEntity.id, post: postEntity.id});
    }

    if (post.comments && post.comments.length > 0) {
      const comments: CreateCommentDto[] = [];
      post.comments.forEach((c: CreateCommentDto) => {
        if (c.text) {
          c.author = userEntity.id;
          c.post = postEntity.id;
          comments.push(c);
        }
      });
      await this.createComments(comments);
    }
  }

  private async createComments(comments: CreateCommentDto[]) {
    for (const comment of comments) {
      await this.createComment(comment);
    }
  }

  private async createComment(c: CreateCommentDto) {
    await this.commentService.create(c);
    await this.postService.incCommentCount(c.post);
  }
}
