import BaseView from "../../core/mvc/view/BaseView";
import App from "../../core/App";
import BagCtrl from "../bag/BagCtrl";
import BagView from "../bag/BagView";
import { ViewShowType } from "../../core/const/ViewShowType";
import { ViewType } from "../../core/const/ViewType";
import { ViewLayerType } from "../../core/const/ViewLayer";
import { ViewEvent } from "../../core/event/ViewEvent";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-21 16:21:50
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-09-01 22:45:35
 */
export default class MainView extends BaseView {

    public static key: string = 'MainView';

    private _bagBtn: fgui.GButton = null;

    public constructor() {
        super('main', 'MainView', ViewType.VIEW, ViewLayerType.MIDDLE_LAYER);
    }

    protected onShown(): void {

    }

    protected onInit(): void {
        this.initEvent();
    }

    public destroy() {
        if (this.isInit) {
            this.removeEvent();
        }
        super.destroy();
    }

    private onClickBtn(): void {
        App.ViewManager.show(BagCtrl, null, BagView, null, ViewShowType.SINGLETON_VIEW);
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