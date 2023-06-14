import { program } from 'commander';
import create from './order/create';

/* eslint-disable @typescript-eslint/no-var-requires */
program
  .version(`${require('../package.json').version}`, '-v --version')
  .usage('<command> [options]');

program
  .command('create <app-name>')
  .description('Create new project from => goo-cli create yourProjectName')
  .action(async (name: string) => {
    // 创建命令具体做的事情都在这里，name 是你指定的 newPro
    await create(name);
  });

program.parse(process.argv);
