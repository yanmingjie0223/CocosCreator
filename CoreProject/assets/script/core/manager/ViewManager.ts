import Singleton from "../base/Singleton";
import BaseView from "../mvc/view/BaseView";
import { ViewShowType } from "../mvc/view/ViewType";
import App from "../App";
import BaseViewData from "../mvc/view/BaseViewData";
import ViewEvent from "../mvc/view/ViewEvent";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 10:54:16
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-18 21:39:56
 */
export default class ViewManager extends Singleton {

    // 所有正在显示view集
    private _views: any;

    // 将要逐个显示view集，二维数组：[[viewClass, viewData, layer]]
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
     * @param viewClass view类
     * @param viewData view类数据
     * @param showType 显示类型，显示在单还是多窗体
     * @param layer 显示在那一层中，默认使用view本身层中，一般不使用
     */
    public show(viewClass: {new(): BaseView}, viewData: BaseViewData, showType: number = ViewShowType.MULTI_VIEW, layer?: string): BaseView {
        const key: string = (viewClass as any).key;
        if (!key) {
            App.DebugUtils.error('该view未存在key，请在检查一下遗漏！');
        }
        // 单个窗体显示
        if (showType === ViewShowType.SINGLETON_VIEW) {
            this._willViews.push([viewClass, viewData, layer]);
            return this.nextShow();
        }
        // 多个窗体显示
        let view: BaseView = this._views[key];
        if (view && !view.isDestroy) {
            view.viewData = viewData;
        }
        else {
            view = new viewClass();
            view.viewData = viewData;
            this._views[key] = view;
        }
        if (layer) { view.layer = layer; }
        if (!view.layer) {
            App.DebugUtils.error('该view未设置显示layer层！');
        }
        const layerNode: cc.Node = App.LayerManager.getLayerNode(view.layer);
        view.node.parent = layerNode;
        App.EventManager.emit(ViewEvent.VIEW_SHOW);
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
        App.EventManager.emit(ViewEvent.VIEW_CLOSE);
        // 继续下一个view显示
        if (this._currView === viewClass) {
            this._currView = null;
            this.nextShow();
        }
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
        this.nextShow();
    }
    public get isPause(): boolean {
        return this._isPause;
    }

    /**
     * 显示下个view
     */
    private nextShow(): BaseView {
        if (this._currView || this._isPause) {
            return;
        }
        if (this._willViews.length === 0) {
            App.EventManager.emit(ViewEvent.WINDOW_CLOSE);
            return;
        }

        const willArr: any[] = this._willViews.shift();
        const viewClass: {new(): BaseView} = willArr[0];
        const viewData: BaseViewData = willArr[1];
        const layer: string = willArr[2];
        this._currView = viewClass;
        const view: BaseView = this.show(viewClass, viewData, ViewShowType.MULTI_VIEW, layer);
        return view;
    }

}