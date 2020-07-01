import Singleton from "../base/Singleton";
import BaseView from "../mvc/view/BaseView";
import App from "../App";
import BaseViewData from "../mvc/view/BaseViewData";
import BaseCtrl from "../mvc/ctrl/BaseCtrl";
import BaseModel from "../mvc/model/BaseModel";
import { ViewShowType, ViewEvent } from "../const/CoreConst";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 10:54:16
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-07-01 21:53:02
 */
export default class ViewManager extends Singleton {

    // 所有正在显示view集
    private _views: any;

    // 将要逐个显示view集，二维数组：[[ctrlClass, modelClass, viewClass, viewData, layer]]
    private _willViews: any[];
    // 当前显示单个view
    private _currView: {new(): BaseView};
    // 是否暂停逐个显示view功能
    private _isPause: boolean;

    public constructor() {
        super();
    }

    public init(): void {
        this._views = {};
        this._willViews = [];
    }

    /**
     * 显示view
     * @param ctrlClass view控制类 new () => BaseCtrl or typeof BaseCtrl
     * @param modelClass model类，该数据源是单例
     * @param viewClass view类
     * @param viewData view类数据
     * @param showType 显示类型，显示在单还是多窗体
     * @param layer 显示在那一层中，默认使用view本身层中，一般不使用
     */
    public show(ctrlClass: {new(): BaseCtrl}, modelClass: {new(): BaseModel}, viewClass: {new(): BaseView}, viewData: BaseViewData, showType: number = ViewShowType.MULTI_VIEW, layer?: string): BaseView {
        const key: string = (viewClass as any).key;
        if (!key) {
            App.DebugUtils.error('该view未存在key，请在检查一下遗漏！');
        }
        // 单个窗体显示
        if (showType === ViewShowType.SINGLETON_VIEW) {
            this._willViews.push([ctrlClass, modelClass, viewClass, viewData, layer]);
            return this.nextShow();
        }
        // 多个窗体显示
        let view: BaseView = this._views[key];
        if (view && !view.isDestroy) {
            view.viewData = viewData;
        }
        else {
            const ctrl: BaseCtrl = ctrlClass ? new ctrlClass() : null;
            const model: BaseModel = App.ModelManager.getModel(modelClass);
            view = new viewClass();
            view.viewData = viewData;
            view.ctrl = ctrl;
            view.model = model;
            this._views[key] = view;
        }

        if (layer) { view.layer = layer; }
        if (!view.layer) {
            App.DebugUtils.error('该view未设置显示layer层！');
        }

        const layerCom: fgui.GComponent = App.LayerManager.getLayerComponent(view.layer);
        layerCom.addChild(view);
        view.show();

        App.EventManager.emitEvent(ViewEvent.VIEW_SHOW, key);

        return view;
    }

    /**
     * 关闭view
     * @param viewClass view类
     * @param isDestroy 是否销毁，默认消耗
     */
    public close(viewClass: {new(): BaseView}, isDestroy: boolean = true): void {
        const key: string = (viewClass as any).key;
        if (!this._views || !this._views[key]) {
            return;
        }

        const view: BaseView = this._views[key];
        view.node.parent = null;
        if (isDestroy) {
            delete this._views[key];
            view.destroy();
        }

        App.EventManager.emitEvent(ViewEvent.VIEW_CLOSE, key);
        // 继续下一个view显示
        if (this._currView === viewClass) {
            this._currView = null;
            this.nextShow();
        }
    }

    /**
     * 获取view
     * @param viewClass view类
     */
    public getView<T extends BaseView>(viewClass: {new(): BaseView}): T {
        const key: string = (viewClass as any).key;
        if (!this._views || !this._views[key]) {
            return null;
        }
        return this._views[key];
    }

    /**
     * 是否存在该view
     * @param viewClass view类
     */
    public isExist(viewClass: {new(): BaseView}): boolean {
        const key: string = (viewClass as any).key;
        if (this._views && this._views[key]) {
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
    private nextShow(): BaseView {
        if (this._currView || this._isPause) {
            return null;
        }
        if (this._willViews.length === 0) {
            App.EventManager.emit(ViewEvent.WINDOW_CLOSE);
            return null;
        }

        const willArr: any[] = this._willViews.shift();
        const ctrlClass: {new(): BaseCtrl} = willArr[0];
        const modelClass: {new(): BaseModel} = willArr[1];
        const viewClass: {new(): BaseView} = willArr[2];
        const viewData: BaseViewData = willArr[3];
        const layer: string = willArr[4];
        this._currView = viewClass;
        const view: BaseView = this.show(ctrlClass, modelClass, viewClass, viewData, ViewShowType.MULTI_VIEW, layer);
        return view;
    }

}