import {CliCommandInterface} from './interfaces/cli-command.interface.js';
import chalk from 'chalk';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';

  /**
   * @param n - задаёт количество генерируемых предложений
   * @param filepath - указывает путь для сохранения файла с предложениями
   * @param url - задаёт адрес сервера, с которого необходимо взять данные
   */
  public execute(n: string, filepath: string, url: string): void {
    console.log(chalk.green('generate command has been started with params:'));
    console.log(chalk.blue('number', n));
    console.log(chalk.blue('filepath', filepath));
    console.log(chalk.blue('url', url));
    console.log(chalk.red('generate command not supported yet!'));
  }
}
