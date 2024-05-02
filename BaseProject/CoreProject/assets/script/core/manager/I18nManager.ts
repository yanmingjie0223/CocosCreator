import Singleton from "../base/Singleton";
import I18n from "../i18n/I18n";
import { I18nType } from "../const/CoreConst";

/*
 * @Author: yanmingjie
 * @Date: 2019-09-01 22:47:12
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-07-01 22:23:56
 */
export default class I18nManager extends Singleton {

    private i18n: I18n;

    public constructor() {
        super();
    }

    public init(language: I18nType = I18nType.ZH): void {
        this.i18n = new I18n();
        this.language = language;
    }

    /**
     * 获取对应的文本
     * @param key 文本对应key
     * @param values 对应的取代值 例如：[1] ${name}来了 结果是：1来了
     */
    public getText(key: string, values?: Array<string>): string {
        return this.i18n.getText(key, values);
    }

    public get language(): I18nType {
        return this.i18n.language;
    }

    public set language(language: I18nType) {
        this.i18n.language = language;
    }

}