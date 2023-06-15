"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installBuild = exports.installHusky = exports.installCZ = exports.installPrettier = exports.installESLint = void 0;
/**
 * 实现各个功能的安装方法
 */
const shell = require("shelljs");
const fs_1 = require("fs");
const common_1 = require("./common");
// import chalk from 'chalk';
/**
 * 安装 ESLint
 */
async function installESLint() {
    shell.exec('npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -D');
    // 添加 .eslintrc.js
    const eslintrc = `module.exports = {
    "env": {
      "es2021": true,
      "node": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "plugins": [
      "@typescript-eslint"
    ],
    "rules": {
    }
  };
    `;
    const chalk = (await Promise.resolve().then(() => require('chalk'))).default;
    try {
        (0, fs_1.writeFileSync)('./.eslintrc.js', eslintrc, { encoding: 'utf-8' });
    }
    catch (err) {
        (0, common_1.printMsg)(`${chalk.red('Failed to write .eslintrc.js file content')}`);
        (0, common_1.printMsg)(`${chalk.red('Please add the following content in .eslintrc.js')}`);
        (0, common_1.printMsg)(`${chalk.red(eslintrc)}`);
    }
    // 改写 package.json
    const packageJson = (0, common_1.readJsonFile)('./package.json');
    packageJson.scripts['eslint:comment'] =
        '使用 ESLint 检查并自动修复 src 目录下所有扩展名为 .ts 的文件';
    packageJson.scripts['eslint'] = 'eslint --fix src --ext .ts --max-warnings=0';
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installESLint = installESLint;
/**
 * 安装 Prettier
 */
async function installPrettier() {
    shell.exec('npm i prettier -D');
    // 添加 .prettierrc.js
    const prettierrc = `module.exports = {
    // 一行最多 80 字符
    printWidth: 80,
    // 使用 2 个空格缩进
    tabWidth: 2,
    // 不使用 tab 缩进，而使用空格
    useTabs: false,
    // 行尾需要有分号
    semi: true,
    // 使用单引号代替双引号
    singleQuote: true,
    // 对象的 key 仅在必要时用引号
    quoteProps: 'as-needed',
    // jsx 不使用单引号，而使用双引号
    jsxSingleQuote: false,
    // 末尾使用逗号
    trailingComma: 'all',
    // 大括号内的首尾需要空格 { foo: bar }
    bracketSpacing: true,
    // jsx 标签的反尖括号需要换行
    jsxBracketSameLine: false,
    // 箭头函数，只有一个参数的时候，也需要括号
    arrowParens: 'always',
    // 每个文件格式化的范围是文件的全部内容
    rangeStart: 0,
    rangeEnd: Infinity,
    // 不需要写文件开头的 @prettier
    requirePragma: false,
    // 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    // 使用默认的折行标准
    proseWrap: 'preserve',
    // 根据显示样式决定 html 要不要折行
    htmlWhitespaceSensitivity: 'css',
    // 换行符使用 lf
    endOfLine: 'lf'
  };
    `;
    const chalk = (await Promise.resolve().then(() => require('chalk'))).default;
    try {
        (0, fs_1.writeFileSync)('./.prettierrc.js', prettierrc, { encoding: 'utf-8' });
    }
    catch (err) {
        (0, common_1.printMsg)(`${chalk.red('Failed to write .prettierrc.js file content')}`);
        (0, common_1.printMsg)(`${chalk.red('Please add the following content in .prettierrc.js')}`);
        (0, common_1.printMsg)(`${chalk.red(prettierrc)}`);
    }
    // 改写 package.json
    const packageJson = (0, common_1.readJsonFile)('./package.json');
    packageJson.scripts['prettier:comment'] =
        '自动格式化 src 目录下的所有 .ts 文件';
    packageJson.scripts['prettier'] = 'prettier --write "src/**/*.ts"';
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installPrettier = installPrettier;
/**
 * 安装 CZ，规范 git 提交信息
 */
async function installCZ() {
    shell.exec('npx commitizen init cz-conventional-changelog --save --save-exact');
    shell.exec('npm i @commitlint/cli @commitlint/config-conventional -D');
    // 添加 commitlint.config.js
    const commitlint = `module.exports = {
    extends: ['@commitlint/config-conventional']
  };
    `;
    const chalk = (await Promise.resolve().then(() => require('chalk'))).default;
    try {
        (0, fs_1.writeFileSync)('./commitlint.config.js', commitlint, { encoding: 'utf-8' });
    }
    catch (err) {
        (0, common_1.printMsg)(`${chalk.red('Failed to write commitlint.config.js file content')}`);
        (0, common_1.printMsg)(`${chalk.red('Please add the following content in commitlint.config.js')}`);
        (0, common_1.printMsg)(`${chalk.red(commitlint)}`);
    }
    // 改写 package.json
    const packageJson = (0, common_1.readJsonFile)('./package.json');
    packageJson.scripts['commit:comment'] = '引导设置规范化的提交信息';
    packageJson.scripts['commit'] = 'cz';
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installCZ = installCZ;
/**
 * 安装 husky 和 lint-staged，以实现 git commit 时自动化校验
 * @param hooks，需要自动执行的钩子
 * @param lintStaged，需要钩子运行的命令
 */
function installHusky(hooks, lintStaged) {
    // 初始化 git 仓库
    shell.exec('git init');
    // 在安装 husky 和 lint-staged
    shell.exec('npm i husky lint-staged -D');
    // 设置 package.json
    const packageJson = (0, common_1.readJsonFile)('./package.json');
    packageJson['husky'] = {
        hooks: {
            'pre-commit': 'lint-staged',
            ...hooks,
        },
    };
    packageJson['lint-staged'] = {
        '*.ts': lintStaged.map((item) => `npm run ${item}`),
    };
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installHusky = installHusky;
/**
 * 安装构建工具，目前主要用于小项目，所以使用 typescript 原生的构建功能即可
 */
function installBuild(feature) {
    // 设置 package.json
    const packageJson = (0, common_1.readJsonFile)('./package.json');
    packageJson.scripts['build:comment'] = '构建';
    let order = '';
    if (feature.includes('ESLint')) {
        order += 'npm run eslint';
    }
    if (feature.includes('Prettier')) {
        order += ' && npm run prettier';
    }
    order += ' && rm -rf lib && tsc --build';
    packageJson.scripts['build'] = order;
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installBuild = installBuild;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbEZlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvaW5zdGFsbEZlYXR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxpQ0FBaUM7QUFDakMsMkJBQW1DO0FBQ25DLHFDQUE4RTtBQUM5RSw2QkFBNkI7QUFFN0I7O0dBRUc7QUFDSSxLQUFLLFVBQVUsYUFBYTtJQUNqQyxLQUFLLENBQUMsSUFBSSxDQUNSLDRFQUE0RSxDQUM3RSxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ2xCLE1BQU0sUUFBUSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQW9CZCxDQUFDO0lBQ0osTUFBTSxLQUFLLEdBQUcsQ0FBQywyQ0FBYSxPQUFPLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUM5QyxJQUFJO1FBQ0YsSUFBQSxrQkFBYSxFQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ2xFO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixJQUFBLGlCQUFRLEVBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLElBQUEsaUJBQVEsRUFDTixHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsa0RBQWtELENBQUMsRUFBRSxDQUNuRSxDQUFDO1FBQ0YsSUFBQSxpQkFBUSxFQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDcEM7SUFFRCxrQkFBa0I7SUFDbEIsTUFBTSxXQUFXLEdBQUcsSUFBQSxxQkFBWSxFQUFjLGdCQUFnQixDQUFDLENBQUM7SUFDaEUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUNuQyx5Q0FBeUMsQ0FBQztJQUM1QyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLDZDQUE2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