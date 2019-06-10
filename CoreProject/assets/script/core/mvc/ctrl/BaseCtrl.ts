import App from "../../App";
import BaseModel from "../model/BaseModel";
import BaseView from "../view/BaseView";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-11 15:21:06
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-28 11:11:13
 */
export default class BaseCtrl {

    // 类名key
    public static key: string = 'BaseCtrl';

    // 数据源
    private _model: BaseModel;
    // view
    private _view: BaseView

    /**
     * 设置和获取model数据源
     */
    public set model(model: BaseModel) {
        this._model = model;
    }
    public get model(): BaseModel {
        return this._model;
    }

    /**
     * 设置和获取view
     */
    public set view(view: BaseView) {
        this._view = view;
    }
    public get view(): BaseView {
        return this._view;
    }

    /**
     * 销毁对象
     */
    public destroy(): void {
        this._model = null;
        this._view = null;
    }

    /**
     * 全局事件处理
     */
    protected addEventListener(type: string, callback: Function, target?: any, useCapture?: boolean): void {
        App.EventManager.on.apply(App.EventManager, arguments);
    }
    protected offEventListener(type: string, callback?: Function, target?: any): void {
        App.EventManager.off.apply(App.EventManager, arguments);
    }
    protected emitEvent(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        App.EventManager.emit.apply(App.EventManager, arguments);
    }
    protected hasAddEventListener(type: string): boolean {
        return App.EventManager.hasEventListener(type);
    }

}