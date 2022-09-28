#!/usr/bin/env node

import CLIApplication from './cli-application.js';
import HelpCommand from './app/cli-commands/help-command.js';
import VersionCommand from './app/cli-commands/version-command.js';
import ImportCommand from './app/cli-commands/import-command.js';
import GenerateCommand from './app/cli-commands/generate-command.js';


const myManager = new CLIApplication();
myManager.registerCommands([
  new HelpCommand,
  new VersionCommand,
  new ImportCommand,
  new GenerateCommand
]);
myManager.processCommand(process.argv);
