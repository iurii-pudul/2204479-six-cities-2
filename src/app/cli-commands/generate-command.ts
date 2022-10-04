import {CliCommandInterface} from './interfaces/cli-command.interface.js';
import {MockData} from '../entities/MockData.js';
import {PostGenerator} from './post-generator.js';
import chalk from 'chalk';
import got from 'got';
import {TSVFileWriter} from './tsv-file-writer.js';

export default class GenerateCommand implements CliCommandInterface {

  public readonly name = '--generate';
  private initialData!: MockData;

  /**
   * @param parameters список параметров
   * n - задаёт количество генерируемых предложений
   * filepath - указывает путь для сохранения файла с предложениями
   * url - задаёт адрес сервера, с которого необходимо взять данные
   */
  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    console.log(chalk.green('GENERATE COMMAND HAS BEEN STARTED WITH PARAMS:'));
    console.log(chalk.blue('COUNT OF POST', count));
    console.log(chalk.blue('FILEPATH TO FOLDER STORAGE', filepath));
    console.log(chalk.blue('URL TO SERVER', url));
    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
      console.log(chalk.green(`POSTS HAVE BEEN GENERATED, COUNT OF POSTS ${offerCount}, initialData ${JSON.stringify(this.initialData)}`));
    } catch {
      return console.log(chalk.red(`CAN'T FETCH DATA FROM ${url}.`));
    }

    const offerGeneratorString = new PostGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGeneratorString.generate());
    }

    console.log(chalk.blue(`FILE ${filepath} WAS CREATED!`));
  }
}
