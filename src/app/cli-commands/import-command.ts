import {CliCommandInterface} from './interfaces/cli-command.interface.js';
import TSVFileReader from './tsv-file-reader.js';
import chalk from 'chalk';
import {createPost, getErrorMessage} from '../utils/common.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  public async execute(filename: string): Promise<void> {
    console.log(chalk.green('IMPORT COMMAND HAS BEEN STARTED WITH PARAMS:'));
    console.log(chalk.blue('FILENAME', filename));

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

  private onLine(line: string) {
    const offer = createPost(line);
    console.log(offer);
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
  }
}
