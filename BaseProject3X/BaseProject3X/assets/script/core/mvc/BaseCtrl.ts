import EventManager from "../manager/EventManager";
import BaseModel from "./BaseModel";
import { BaseView } from "./BaseView";

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
	protected addEventListener(type: string, callback: (...args: Array<any>) => void, target?: any, useCapture?: boolean): void {
		const eventMgr = EventManager.getInstance<EventManager>();
		eventMgr.addEventListener.apply(eventMgr, [type, callback, target, useCapture]);
	}
	protected offEventListener(type: string, callback?: (...args: Array<any>) => void, target?: any): void {
		const eventMgr = EventManager.getInstance<EventManager>();
		eventMgr.offEventListener.apply(eventMgr, [type, callback, target]);
	}
	protected emitEvent(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void {
		const eventMgr = EventManager.getInstance<EventManager>();
		eventMgr.emitEvent.apply(eventMgr, [type, arg1, arg2, arg3, arg4]);
	}
	protected hasAddEventListener(type: string): boolean {
		const eventMgr = EventManager.getInstance<EventManager>();
		return eventMgr.hasAddEventListener(type);
	}

}