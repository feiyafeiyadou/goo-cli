/**
 * create 命令的具体任务
 */

import {
  changePackageInfo,
  end,
  initProjectDir,
  installDevEnviroment,
  installFeature,
  installTSAndInit,
  installTypesNode,
  isFileExist,
  selectFeature,
} from '../utils/create';

// create 命令
export default async function create(projecrName: string): Promise<void> {
  // 判断文件是否已经存在
  await isFileExist(projecrName);
  // 选择需要的功能
  const feature = await selectFeature();
  console.log(1);
  // 初始化项目目录
  initProjectDir(projecrName);
  console.log(2);
  // 改写项目的 package.json 基本信息，比如 name、description
  changePackageInfo(projecrName);
  console.log(3);
  // 安装 typescript 并初始化
  console.log(4);
  installTSAndInit();
  console.log(5);
  // 安装 @types/node
  installTypesNode();
  console.log(6);
  // 安装开发环境，支持实时编译
  installDevEnviroment();
  console.log(7);
  // 安装 feature
  installFeature(feature);
  console.log(8);
  // 结束
  end(projecrName);
  console.log(9);
}
