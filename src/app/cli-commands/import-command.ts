import {CliCommandInterface} from './interfaces/cli-command.interface.js';
import TSVFileReader from './tsv-file-reader.js';
import chalk from 'chalk';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  public execute(filename: string): void {
    console.log(chalk.green('IMPORT COMMAND HAS BEEN STARTED WITH PARAMS:'));
    console.log(chalk.blue('FILENAME', filename));

    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(chalk.green(`${filename} HAS BEEN FOUND`));
      fileReader.toArray().forEach((d) => console.log(d));
      console.log(chalk.green('IMPORT COMMAND HAS BEEN DONE!'));
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      console.log(chalk.red(`Не удалось импортировать данные из файла по причине: «${err.message}»`));
    }
  }
}
