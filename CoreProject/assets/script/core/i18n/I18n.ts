import { I18nEnConfig, I18nZhConfig } from "../../config/I18nConfig";
import { I18nType } from "../const/CoreConst";
import DebugUtils from "../utils/DebugUtils";

/*
 * @Author: yanmingjie
 * @Date: 2019-08-19 23:11:05
 * @Last Modified by: yanmingjie.jack@shengqugames.com
 * @Last Modified time: 2021-03-01 16:55:15
 */
export default class I18n {

    private _language: I18nType;

    public constructor() {}

    /**
     * 获取对应的文本
     * @param key 文本对应key
     * @param values 对应的取代值 例如：[1] ${name}来了 结果是：1来了
     */
    public getText(key: string, values?: Array<string>): string {
        let config: any;
        let configName: string;
        const debugUtils = DebugUtils.getInstance<DebugUtils>();
        switch (this.language) {
            case I18nType.EN:
                config = I18nEnConfig;
                configName = 'I18nEnConfig';
                break;
            case I18nType.ZH:
                config = I18nZhConfig;
                configName = 'I18nZhConfig';
                break;
            default:
                debugUtils.error(`${this.language} 无对应语言文本配置！`);
                return '';
        }
        let value: string = config[key];
        if (!value) {
            debugUtils.error(`${configName}中无key为${key}文本配置！`);
            return '';
        }
        // 替换指定值
        if (values && values.length > 0) {
            const valueLen: number = values.length;
            const reg: RegExp = new RegExp('\\${\\w+}', 'g');
            const macths: Array<string> = value.match(reg);
            for (let i = 0, len = macths.length; i < len; i++) {
                if (valueLen > i) {
                    value = value.replace(macths[i], values[i]);
                }
            }
        }
        return value;
    }

    public get language(): I18nType {
        return this._language;
    }

    public set language(language: I18nType) {
        this._language = language;
    }

}