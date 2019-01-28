import Singleton from "../base/Singleton";
import BaseModel from "../mvc/model/BaseModel";
import App from "../App";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 10:59:30
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-28 11:00:43
 */
export default class ModelManager extends Singleton {

    private _modelCache: any;

    public constructor() {
        super()
    }

    public init(): void {
        this._modelCache = {};
        // todo: 初始化所有model数据源对象
    }

    /**
     * 注册model对象源
     * @param modelClass model类
     */
    public register(modelClass: {new(): BaseModel}): void {
        const key: string = (modelClass as any).key;
        if (key && !this._modelCache[key]) {
            const model: BaseModel = new modelClass();
            this._modelCache[key] = model;
        }
        else {
            if (!key) {
                App.DebugUtils.error('注册的该model不存在key');
            }
            else {
                App.DebugUtils.warn('注册的该model已存在，请使用统一数据源！');
            }
        }
    }

    /**
     * 获取model对象源
     * @param modelClass model类
     */
    public getModel(modelClass: {new(): BaseModel}): BaseModel {
        if (!modelClass) return;
        const key: string = (modelClass as any).key;
        if (this._modelCache && this._modelCache[key]) {
            return this._modelCache[key];
        }
        else {
            App.DebugUtils.warn('获取model数据源对象不存在！');
        }
        return null;
    }

    /**
     * 是否存在该model源
     * @param modelClass model类
     */
    public isExist(modelClass: {new(): BaseModel}): boolean {
        const key: string = (modelClass as any).key;
        if (this._modelCache && this._modelCache[key]) {
            return true;
        }
        return false;
    }

}