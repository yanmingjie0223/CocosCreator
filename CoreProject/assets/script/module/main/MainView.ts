import App from "../../core/App";
import { ViewEvent, ViewLayerType, ViewShowType, ViewType } from "../../core/const/CoreConst";
import BaseView from "../../core/mvc/BaseView";
import BagCtrl from "../bag/BagCtrl";
import BagView from "../bag/BagView";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-21 16:21:50
 * @Last Modified by: yanmingjie.jack@shengqugames.com
 * @Last Modified time: 2021-03-01 17:06:36
 */
export default class MainView extends BaseView {

    public static readonly key: string = 'MainView';

    private _bagBtn: fgui.GButton = null;

    public constructor() {
        super(['main', 'bag'], 'MainView', ViewType.VIEW, ViewLayerType.MIDDLE_LAYER);
    }

    protected onShown(): void {

    }

    protected onInit(): void {
        this.initEvent();
        App.EventManager.addEventListener(ViewEvent.VIEW_SHOW, () => {
            console.log(`监听事件收到： view_show`);
        }, this)
    }

    public destroy() {
        if (this.isInit) {
            this.removeEvent();
        }
        super.destroy();
    }

    private onClickBtn(): void {
        App.ViewManager.show(BagView, null, BagCtrl, null, ViewShowType.SINGLETON_VIEW);
        // App.ViewManager.show(BagView, null, null, null, ViewShowType.SINGLETON_VIEW);
    }

    private initEvent(): void {
        this._bagBtn.onClick(this.onClickBtn, this);
        this.addEventListener(ViewEvent.VIEW_SHOW, (key: string) => {
            console.log(`show: ${key}`);
        }, this);
    }

    private removeEvent(): void {
        this._bagBtn.offClick(this.onClickBtn, this);
    }

}