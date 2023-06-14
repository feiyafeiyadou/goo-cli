"use strict";
/**
 * create 命令的具体任务
 */
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = require("../utils/create");
// create 命令
async function create(projecrName) {
    // 判断文件是否已经存在
    (0, create_1.isFileExist)(projecrName);
    // 选择需要的功能
    const feature = await (0, create_1.selectFeature)();
    // 初始化项目目录
    (0, create_1.initProjectDir)(projecrName);
    // 改写项目的 package.json 基本信息，比如 name、description
    (0, create_1.changePackageInfo)(projecrName);
    // 安装 typescript 并初始化
    (0, create_1.installTSAndInit)();
    // 安装 @types/node
    (0, create_1.installTypesNode)();
    // 安装开发环境，支持实时编译
    (0, create_1.installDevEnviroment)();
    // 安装 feature
    (0, create_1.installFeature)(feature);
    // 结束
    (0, create_1.end)(projecrName);
}
exports.default = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL29yZGVyL2NyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsNENBVXlCO0FBRXpCLFlBQVk7QUFDRyxLQUFLLFVBQVUsTUFBTSxDQUFDLFdBQW1CO0lBQ3RELGFBQWE7SUFDYixJQUFBLG9CQUFXLEVBQUMsV0FBVyxDQUFDLENBQUM7SUFDekIsVUFBVTtJQUNWLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBQSxzQkFBYSxHQUFFLENBQUM7SUFDdEMsVUFBVTtJQUNWLElBQUEsdUJBQWMsRUFBQyxXQUFXLENBQUMsQ0FBQztJQUM1Qiw4Q0FBOEM7SUFDOUMsSUFBQSwwQkFBaUIsRUFBQyxXQUFXLENBQUMsQ0FBQztJQUMvQixxQkFBcUI7SUFDckIsSUFBQSx5QkFBZ0IsR0FBRSxDQUFDO0lBQ25CLGlCQUFpQjtJQUNqQixJQUFBLHlCQUFnQixHQUFFLENBQUM7SUFDbkIsZ0JBQWdCO0lBQ2hCLElBQUEsNkJBQW9CLEdBQUUsQ0FBQztJQUN2QixhQUFhO0lBQ2IsSUFBQSx1QkFBYyxFQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hCLEtBQUs7SUFDTCxJQUFBLFlBQUcsRUFBQyxXQUFXLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBbkJELHlCQW1CQyJ9