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
import CreatePostDto from '../../models/dto/create-post.dto.js';

const DEFAULT_DB_PORT = 27017;

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private userService!: UserServiceInterface;
  private postService!: PostServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.postService = new PostService(this.logger, PostModel);
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
    const user = await this.userService.findOrCreate({
      ...post.author,
      password: post.author?.password ? post.author.password : generator.generate({ length: 12, numbers: true }),
    }, this.salt);

    await this.postService.create({
      ...post,
      author: user.id,
    });
  }
}
