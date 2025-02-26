import EventManager from "../manager/EventManager";
import BaseModel from "./BaseModel";
import BaseView from "./BaseView";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-11 15:21:06
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-03-01 16:53:43
 */
export default class BaseCtrl {

    /**类名key */
    public static key: string = 'BaseCtrl';

    /**数据源 */
    private _model: BaseModel | null = null!;
    /**view界面 */
    private _view: BaseView | null = null!;

    /**
     * 设置和获取model数据源
     */
    public set model(model: BaseModel | null) {
        this._model = model;
    }
    public get model(): BaseModel | null {
        return this._model;
    }

    /**
     * 设置和获取view
     */
    public set view(view: BaseView) {
        this._view = view;
    }
    public get view(): BaseView | null {
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
        const eventMgr = EventManager.getInstance<EventManager>();
        eventMgr.addEventListener.apply(eventMgr, [type, callback, target, useCapture]);
    }
    protected offEventListener(type: string, callback?: Function, target?: any): void {
        const eventMgr = EventManager.getInstance<EventManager>();
        eventMgr.offEventListener.apply(eventMgr, [type, callback, target]);
    }
    protected emitEvent(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        const eventMgr = EventManager.getInstance<EventManager>();
        eventMgr.emitEvent.apply(eventMgr, [type, arg1, arg2, arg3, arg4, arg5]);
    }
    protected hasAddEventListener(type: string): boolean {
        const eventMgr = EventManager.getInstance<EventManager>();
        return eventMgr.hasAddEventListener(type);
    }

}