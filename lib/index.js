"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const create_1 = require("./order/create");
/* eslint-disable @typescript-eslint/no-var-requires */
commander_1.program
    .version(`${require('../package.json').version}`, '-v --version')
    .usage('<command> [options]');
commander_1.program
    .command('create <app-name>')
    .description('Create new project from => goo-cli create yourProjectName')
    .action(async (name) => {
    // 创建命令具体做的事情都在这里，name 是你指定的 newPro
    await (0, create_1.default)(name);
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBb0M7QUFDcEMsMkNBQW9DO0FBRXBDLHVEQUF1RDtBQUN2RCxtQkFBTztLQUNKLE9BQU8sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLGNBQWMsQ0FBQztLQUNoRSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUVoQyxtQkFBTztLQUNKLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztLQUM1QixXQUFXLENBQUMsMkRBQTJELENBQUM7S0FDeEUsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFZLEVBQUUsRUFBRTtJQUM3QixtQ0FBbUM7SUFDbkMsTUFBTSxJQUFBLGdCQUFNLEVBQUMsSUFBSSxDQUFDLENBQUM7QUFDckIsQ0FBQyxDQUFDLENBQUM7QUFFTCxtQkFBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMifQ==