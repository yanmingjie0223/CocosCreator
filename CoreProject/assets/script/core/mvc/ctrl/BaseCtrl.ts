import App from "../../App";
import BaseModel from "../model/BaseModel";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-11 15:21:06
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-18 11:22:37
 */
export default class BaseCtrl {

    // 类名key
    public static key: string = 'BaseCtrl';
    // 数据源
    private _model: BaseModel;

    /**
     * 设置和获取model数据源
     */
    public set model(model: BaseModel) {
        this._model = model;
    }
    public get model(): BaseModel {
        return this._model;
    }

    protected on(type: string, callback: Function, target?: any, useCapture?: boolean): void {
        App.EventManager.on.apply(App.EventManager, arguments);
    }

    protected once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void {
        App.EventManager.once.apply(App.EventManager, arguments);
    }

    protected off(type: string, callback?: Function, target?: any): void {
        App.EventManager.off.apply(App.EventManager, arguments);
    }

    protected hasEventListener(type: string): boolean {
        return App.EventManager.hasEventListener(type);
    }

}