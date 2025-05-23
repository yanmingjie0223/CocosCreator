import { Node } from "cc";
import Singleton from "../base/Singleton";
import { ViewEvent, ViewLayerType, ViewShowType } from "../const/ViewConst";
import BaseCtrl from "../mvc/BaseCtrl";
import BaseModel from "../mvc/BaseModel";
import { BaseView } from "../mvc/BaseView";
import BaseViewData from "../mvc/BaseViewData";
import DebugUtils from "../utils/DebugUtils";
import EventManager from "./EventManager";
import LayerManager from "./LayerManager";
import ModelManager from "./ModelManager";

export default class ViewManager extends Singleton {
	/**所有正在显示view集 */
	private _viewMap: Map<string, BaseView> = new Map();
	/**将要逐个显示view集，二维数组：[[ctrlClass, modelClass, viewClass, viewData, layer]] */
	private _willViews: any[] = [];
	/**当前显示单个view */
	private _currView: { new(): BaseView } = null!;
	/**是否暂停逐个显示view功能 */
	private _isPause: boolean = null!;

	/**
	 * 显示view
	 * @param ctrlClass view控制类 new () => BaseCtrl or typeof BaseCtrl
	 * @param modelClass model类，该数据源是单例
	 * @param viewClass view类
	 * @param viewData view类数据
	 * @param showType 显示类型，显示在单还是多窗体
	 * @param layer 显示在那一层中，默认使用view本身层中，一般不使用
	 */
	public show(
		viewClass: { new(): BaseView },
		modelClass: { new(): BaseModel } | null = null!,
		ctrlClass: { new(): BaseCtrl } | null = null,
		viewData: BaseViewData | null = null,
		showType: number = ViewShowType.MULTI_VIEW,
		layer: ViewLayerType = null!
	): BaseView | null {
		const key: string = (viewClass as any).key;
		const debugUtils = DebugUtils.getInstance<DebugUtils>();
		if (!key) {
			debugUtils.error(
				`该${viewClass.name}未存在static key, 请在检查一下遗漏! `
			);
		}
		// 单个窗体显示
		if (showType === ViewShowType.SINGLETON_VIEW) {
			this._willViews.push([
				ctrlClass,
				modelClass,
				viewClass,
				viewData,
				layer,
			]);
			return this.nextShow();
		}
		// 多个窗体显示
		let view: BaseView | undefined = this._viewMap.get(key);
		if (view && !view.isDestroy) {
			view.viewData = viewData;
		} else {
			const modelManager = ModelManager.getInstance<ModelManager>();
			const ctrl: BaseCtrl | null = ctrlClass ? new ctrlClass() : null;
			const model: BaseModel | null = modelManager.getModel(modelClass);
			view = new viewClass();
			view.viewData = viewData;
			view.ctrl = ctrl;
			view.model = model;
			this._viewMap.set(key, view);
		}

		if (layer) {
			view.layer = layer;
		}
		if (!view.layer) {
			debugUtils.error("该view未设置显示layer层!");
		}

		const layerManager = LayerManager.getInstance<LayerManager>();
		const eventManager = EventManager.getInstance<EventManager>();
		const layerNode: Node = layerManager.getLayerNode(
			view.layer
		);
		view.show();
		layerNode.addChild(view.node);

		eventManager.emitEvent(ViewEvent.VIEW_SHOW, key);

		return view;
	}

	/**
	 * 关闭view
	 * @param viewClass view类
	 * @param isDestroy 是否销毁，默认消耗
	 */
	public close(
		viewClass: { new(): BaseView },
		isDestroy: boolean = true
	): void {
		const key: string = (viewClass as any).key;
		if (!this._viewMap || !this._viewMap.get(key)) {
			return;
		}

		const view: BaseView = this._viewMap.get(key)!;
		view.node.removeFromParent();
		if (isDestroy) {
			this._viewMap.delete(key);
			view.destroy();
		}

		const eventManager = EventManager.getInstance<EventManager>();
		eventManager.emitEvent(ViewEvent.VIEW_CLOSE, key);
		// 继续下一个view显示
		if (this._currView === viewClass) {
			this._currView = null!;
			this.nextShow();
		}
	}

	/**
	 * 关闭所有界面
	 * @param isDestroy
	 */
	public closeAll(isDestroy: boolean = true): void {
		if (!this._viewMap) {
			return;
		}

		for (const key in this._viewMap) {
			const view: BaseView | undefined = this._viewMap.get(key);
			if (view) {
				view.node.removeFromParent();
				if (isDestroy) {
					this._viewMap.delete(key);
					view.destroy();
				}
			}
		}

		this._isPause = false;
		this._willViews.length = 0;
	}

	/**
	 * 获取view
	 * @param viewClass view类
	 */
	public getView<T extends BaseView>(viewClass: { new(): BaseView }): T | null {
		const key: string = (viewClass as any).key;
		if (!this._viewMap || !this._viewMap.get(key)) {
			return null;
		}
		return this._viewMap.get(key) as T;
	}

	/**
	 * 是否存在该view
	 * @param viewClass view类
	 */
	public isExist(viewClass: { new(): BaseView }): boolean {
		const key: string = (viewClass as any).key;
		if (this._viewMap && this._viewMap.get(key)) {
			return true;
		}
		return false;
	}

	/**
	 * 暂停逐个view显示
	 */
	public set isPause(_isPause: boolean) {
		this._isPause = _isPause;
		if (!_isPause) {
			this.nextShow();
		}
	}
	public get isPause(): boolean {
		return this._isPause;
	}

	/**
	 * 显示下个view
	 */
	private nextShow(): BaseView | null {
		if (this._currView || this._isPause) {
			return null;
		}
		if (this._willViews.length === 0) {
			const eventManager = EventManager.getInstance<EventManager>();
			eventManager.emitEvent(ViewEvent.WINDOW_CLOSE);
			return null;
		}

		const willArr: any[] = this._willViews.shift();
		const ctrlClass: { new(): BaseCtrl } = willArr[0];
		const modelClass: { new(): BaseModel } = willArr[1];
		const viewClass: { new(): BaseView } = willArr[2];
		const viewData: BaseViewData = willArr[3];
		const layer: ViewLayerType = willArr[4];
		this._currView = viewClass;
		const view: BaseView | null = this.show(
			viewClass,
			modelClass,
			ctrlClass,
			viewData,
			ViewShowType.MULTI_VIEW,
			layer
		);
		return view;
	}
}
