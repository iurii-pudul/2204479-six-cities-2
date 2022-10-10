#!/usr/bin/env node

import 'reflect-metadata';
import CLIApplication from './cli-application.js';
import HelpCommand from './app/services/command/help-command.js';
import VersionCommand from './app/services/command/version-command.js';
import ImportCommand from './app/services/command/import-command.js';
import GenerateCommand from './app/services/command/generate-command.js';


const myManager = new CLIApplication();
myManager.registerCommands([
  new HelpCommand,
  new VersionCommand,
  new ImportCommand,
  new GenerateCommand
]);
myManager.processCommand(process.argv);
