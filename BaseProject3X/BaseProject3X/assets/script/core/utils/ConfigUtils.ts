import { ncb } from "../../luban/code/schema";
import ConfigManager from "../manager/ConfigManager";

/**
 * 根据key获取global全局单例数据
 * @param key
 * @returns
 */
export function getGlobal(): ncb.Global {
	const tables = ConfigManager.getInstance<ConfigManager>().tables;
	return tables.TbGlobal.getDataList()[0];
}
