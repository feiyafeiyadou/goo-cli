"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.end = exports.installFeature = exports.installDevEnviroment = exports.installTypesNode = exports.installTSAndInit = exports.changePackageInfo = exports.initProjectDir = exports.selectFeature = exports.isFileExist = void 0;
/**
 * create 命令需要用到的所有方法
 */
const common_1 = require("../utils/common");
const fs_1 = require("fs");
const inquirer_1 = require("inquirer");
const chalk_1 = require("chalk");
const shell = require("shelljs");
const installFeatureMethod = require("./installFeature");
/**
 * 验证当前目录下是否已经存在指定文件，如果存在则退出进行
 * @param filename 文件名
 */
function isFileExist(filename) {
    // 文件路径
    const file = (0, common_1.getProjectPath)(filename);
    // 验证文件是否已经存在，存在则推出进程
    if ((0, fs_1.existsSync)(file)) {
        (0, common_1.printMsg)(chalk_1.default.red(`${file} 已经存在`));
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
    (0, common_1.printMsg)(chalk_1.default.blue(`TS CLI v${require('../../package.json').version}`));
    (0, common_1.printMsg)('Start initializing the project:');
    (0, common_1.printMsg)('');
    // 选择功能，这里配合 下面的 installFeature 方法 和 ./installFeature.ts 文件为脚手架提供了良好的扩展机制
    // 将来扩展其它功能只需要在 choices 数组中增加配置项，然后在 ./installFeature.ts 文件中增加相应的安装方法即可
    const { feature } = await (0, inquirer_1.prompt)([
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
function end(projectName) {
    (0, common_1.printMsg)(`Successfully created project ${chalk_1.default.yellow(projectName)}`);
    (0, common_1.printMsg)('Get started with the following commands:');
    (0, common_1.printMsg)('');
    (0, common_1.printMsg)(`${chalk_1.default.gray('$')} ${chalk_1.default.cyan('cd ' + projectName)}`);
    (0, common_1.printMsg)(`${chalk_1.default.gray('$')} ${chalk_1.default.cyan('npm run dev')}`);
    (0, common_1.printMsg)('');
}
exports.end = end;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2NyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7R0FFRztBQUNILDRDQVF5QjtBQUN6QiwyQkFBZ0M7QUFDaEMsdUNBQWtDO0FBQ2xDLGlDQUEwQjtBQUMxQixpQ0FBaUM7QUFDakMseURBQXlEO0FBRXpEOzs7R0FHRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxRQUFnQjtJQUMxQyxPQUFPO0lBQ1AsTUFBTSxJQUFJLEdBQUcsSUFBQSx1QkFBYyxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLHFCQUFxQjtJQUNyQixJQUFJLElBQUEsZUFBVSxFQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3BCLElBQUEsaUJBQVEsRUFBQyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7QUFDSCxDQUFDO0FBUkQsa0NBUUM7QUFFRDs7O0dBR0c7QUFDSSxLQUFLLFVBQVUsYUFBYTtJQUNqQyxRQUFRO0lBQ1IsSUFBQSxxQkFBWSxHQUFFLENBQUM7SUFDZixPQUFPO0lBQ1AsdURBQXVEO0lBQ3ZELElBQUEsaUJBQVEsRUFBQyxlQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLElBQUEsaUJBQVEsRUFBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQzVDLElBQUEsaUJBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQztJQUNiLHlFQUF5RTtJQUN6RSx1RUFBdUU7SUFDdkUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sSUFBQSxpQkFBTSxFQUFDO1FBQy9CO1lBQ0UsSUFBSSxFQUFFLFNBQVM7WUFDZixJQUFJLEVBQUUsVUFBVTtZQUNoQixPQUFPLEVB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