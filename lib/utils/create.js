"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.end = exports.installFeature = exports.installDevEnviroment = exports.installTypesNode = exports.installTSAndInit = exports.changePackageInfo = exports.initProjectDir = exports.selectFeature = exports.isFileExist = void 0;
/**
 * create 命令需要用到的所有方法
 */
const common_1 = require("../utils/common");
const fs_1 = require("fs");
const installFeatureMethod = require("./installFeature");
// import chalk from 'chalk';
const shell = require("shelljs");
/**
 * 验证当前目录下是否已经存在指定文件，如果存在则退出进行
 * @param filename 文件名
 */
async function isFileExist(filename) {
    // 文件路径
    const file = (0, common_1.getProjectPath)(filename);
    // 验证文件是否已经存在，存在则推出进程
    if ((0, fs_1.existsSync)(file)) {
        const chalk = (await Promise.resolve().then(() => require('chalk'))).default;
        (0, common_1.printMsg)(chalk.red(`${file} 已经存在`));
        process.exit(1);
    }
}
exports.isFileExist = isFileExist;
/**
 * 交互式命令行，让用户自己选择需要的功能
 * return ['ESLint', 'Prettier', 'CZ']
 */
async function selectFeature() {
    // 清空命令行
    (0, common_1.clearConsole)();
    // 输出信息
    /* eslint-disable @typescript-eslint/no-var-requires */
    const chalk = (await Promise.resolve().then(() => require('chalk'))).default;
    (0, common_1.printMsg)(chalk.blue(`TS CLI v${require('../../package.json').version}`));
    (0, common_1.printMsg)('Start initializing the project:');
    (0, common_1.printMsg)('');
    // 选择功能，这里配合 下面的 installFeature 方法 和 ./installFeature.ts 文件为脚手架提供了良好的扩展机制
    // 将来扩展其它功能只需要在 choices 数组中增加配置项，然后在 ./installFeature.ts 文件中增加相应的安装方法即可
    const { prompt } = (await Promise.resolve().then(() => require('inquirer'))).default;
    const { feature } = await prompt([
        {
            name: 'feature',
            type: 'checkbox',
            message: 'Check the features needed for your project',
            choices: [
                { name: 'ESLint', value: 'ESLint' },
                { name: 'Prettier', value: 'Prettier' },
                { name: 'CZ', value: 'CZ' },
            ],
        },
    ]);
    return feature;
}
exports.selectFeature = selectFeature;
/**
 * 初始化项目目录
 */
function initProjectDir(projectName) {
    shell.exec(`mkdir ${projectName}`);
    shell.cd(projectName);
    shell.exec('npm init -y');
}
exports.initProjectDir = initProjectDir;
/**
 * 改写项目中 package.json 的 name、description
 */
function changePackageInfo(projectName) {
    const packageJSON = (0, common_1.readJsonFile)('./package.json');
    packageJSON.name = packageJSON.description = projectName;
    (0, common_1.writeJsonFile)('./package.json', packageJSON);
}
exports.changePackageInfo = changePackageInfo;
/**
 * 安装 typescript 并初始化
 */
function installTSAndInit() {
    // 安装 typescript 并执行命令 tsc --init 生成 tsconfig.json
    shell.exec('npm i typescript -D && npx tsc --init');
    // 覆写 tsconfig.json
    const tsconfigJson = {
        compileOnSave: true,
        compilerOptions: {
            target: 'ES2018',
            module: 'commonjs',
            moduleResolution: 'node',
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            inlineSourceMap: true,
            noImplicitThis: true,
            noUnusedLocals: true,
            stripInternal: true,
            pretty: true,
            declaration: true,
            outDir: 'lib',
            baseUrl: './',
            paths: {
                '*': ['src/*'],
            },
        },
        exclude: ['lib', 'node_modules'],
    };
    (0, common_1.writeJsonFile)('./tsconfig.json', tsconfigJson);
    // 创建 src 目录和 /src/index.ts
    shell.exec('mkdir src && touch src/index.ts');
}
exports.installTSAndInit = installTSAndInit;
/**
 * 安装 @types/node
 * 这是 node.js 的类型定义包
 */
function installTypesNode() {
    shell.exec('npm i @types/node -D');
}
exports.installTypesNode = installTypesNode;
/**
 * 安装开发环境，支持实时编译
 */
function installDevEnviroment() {
    shell.exec('npm i ts-node-dev -D');
    /**
     * 在 package.json 的 scripts 中增加如下内容
     * "dev:comment": "启动开发环境",
     * "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
     */
    const packageJson = (0, common_1.readJsonFile)('./package.json');
    packageJson.scripts['dev:comment'] = '启动开发环境';
    packageJson.scripts['dev'] =
        'ts-node-dev --respawn --transpile-only src/index.ts';
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installDevEnviroment = installDevEnviroment;
/**
 * 安装用户选择的功能
 * @param feature 功能列表
 */
function installFeature(feature) {
    feature.forEach((item) => {
        const func = installFeatureMethod[`install${item}`];
        func();
    });
    // 安装 husky 和 lint-staged
    installHusky(feature);
    // 安装构建工具
    installFeatureMethod.installBuild(feature);
}
exports.installFeature = installFeature;
/**
 * 安装 husky 和 lint-staged，并根据功能设置相关命令
 * @param feature 用户选择的功能列表
 */
function installHusky(feature) {
    // feature 副本
    const featureBak = JSON.parse(JSON.stringify(feature));
    // 设置 hook
    const hooks = {};
    // 判断用户是否选择了 CZ，有则设置 hooks
    if (featureBak.includes('CZ')) {
        hooks['commit-msg'] = 'commitlint -E HUSKY_GIT_PARAMS';
    }
    // 设置 lintStaged
    const lintStaged = [];
    if (featureBak.includes('ESLint')) {
        lintStaged.push('eslint');
    }
    if (featureBak.includes('Prettier')) {
        lintStaged.push('prettier');
    }
    installFeatureMethod.installHusky(hooks, lintStaged);
}
/**
 * 整个项目安装结束，给用户提示信息
 */
async function end(projectName) {
    const chalk = (await Promise.resolve().then(() => require('chalk'))).default;
    (0, common_1.printMsg)(`Successfully created project ${chalk.yellow(projectName)}`);
    (0, common_1.printMsg)('Get started with the following commands:');
    (0, common_1.printMsg)('');
    (0, common_1.printMsg)(`${chalk.gray('$')} ${chalk.cyan('cd ' + projectName)}`);
    (0, common_1.printMsg)(`${chalk.gray('$')} ${chalk.cyan('npm run dev')}`);
    (0, common_1.printMsg)('');
}
exports.end = end;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2NyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7R0FFRztBQUNILDRDQVF5QjtBQUN6QiwyQkFBZ0M7QUFDaEMseURBQXlEO0FBQ3pELDZCQUE2QjtBQUM3QixpQ0FBaUM7QUFFakM7OztHQUdHO0FBQ0ksS0FBSyxVQUFVLFdBQVcsQ0FBQyxRQUFnQjtJQUNoRCxPQUFPO0lBQ1AsTUFBTSxJQUFJLEdBQUcsSUFBQSx1QkFBYyxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLHFCQUFxQjtJQUNyQixJQUFJLElBQUEsZUFBVSxFQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLENBQUMsMkNBQWEsT0FBTyxFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDOUMsSUFBQSxpQkFBUSxFQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtBQUNILENBQUM7QUFURCxrQ0FTQztBQUVEOzs7R0FHRztBQUNJLEtBQUssVUFBVSxhQUFhO0lBQ2pDLFFBQVE7SUFDUixJQUFBLHFCQUFZLEdBQUUsQ0FBQztJQUNmLE9BQU87SUFDUCx1REFBdUQ7SUFDdkQsTUFBTSxLQUFLLEdBQUcsQ0FBQywyQ0FBYSxPQUFPLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUM5QyxJQUFBLGlCQUFRLEVBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN6RSxJQUFBLGlCQUFRLEVBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUM1QyxJQUFBLGlCQUFRLEVBQUMsRUFBRSxDQUFDLENBQUM7SUFDYix5RUFBeUU7SUFDekUsdUVB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