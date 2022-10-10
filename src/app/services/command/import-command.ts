import {CliCommandInterface} from '../interfaces/cli-command.interface.js';
import TSVFileReader from '../file/tsv-file-reader.js';
import chalk from 'chalk';
import {createPost, getErrorMessage} from '../../utils/common.js';
import {getURI} from '../../utils/db.js';
import ConsoleLoggerService from '../logger/console-logger.service.js';
import {LoggerInterface} from '../interfaces/logger.interface.js';
import {DatabaseInterface} from '../interfaces/database-client/database.interface.js';
import {PostServiceInterface} from '../interfaces/post-service.interface.js';
import {CommentServiceInterface} from '../interfaces/comment-service.interface.js';
import {UserServiceInterface} from '../interfaces/user-service.interface.js';
import {PostService} from '../post.service.js';
import {UserService} from '../user.service.js';
import {CommentService} from '../comment.service.js';
import {CommentModel} from '../../models/entities/db/comment.entity.js';
import {PostModel} from '../../models/entities/db/post.entity.js';
import {UserModel} from '../../models/entities/db/user.entity.js';
import DatabaseService from '../database-client/database.service.js';
import generator from 'generate-password';
import CreateCommentDto from '../../models/dto/user/create-comment.dto.js';
import CreatePostDto from '../../models/dto/user/create-post.dto.js';

const DEFAULT_DB_PORT = 27017;

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private userService!: UserServiceInterface;
  private commentService!: CommentServiceInterface;
  private postService!: PostServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.postService = new PostService(this.logger, PostModel);
    this.commentService = new CommentService(this.logger, CommentModel);
    this.userService = new UserService(this.logger, UserModel);
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

  private async savePost(post: CreatePostDto) {
    console.log(post);
    const comments = [];
    const user = await this.userService.findOrCreate({
      ...post.author,
      password: post.author?.password ? post.author.password : generator.generate({ length: 10, numbers: true }),
    }, this.salt);

    if (post.comments) {
      for (const comment of post.comments) {
        const createCommentDto = new CreateCommentDto();
        createCommentDto.text = comment;
        createCommentDto.author = user;
        createCommentDto.rating = Math.floor(Math.random() * (5 - 1 + 1) + 1);
        const createdComment = await this.commentService.create(createCommentDto);
        comments.push(createdComment.id);
      }
      post.commentCount = comments.length;
    }

    await this.postService.create({
      ...post,
      comments,
      author: user.id,
    });
  }
}
