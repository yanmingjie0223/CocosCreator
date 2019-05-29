import BaseView from "../../core/mvc/view/BaseView";
import ViewType from "../../core/const/ViewType";
import ViewLayer from "../../core/const/ViewLayer";
import App from "../../core/App";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-22 17:00:28
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-05-29 20:33:56
 */
export default class BagView extends BaseView {

    public static key: string = 'BagView';

    private _closeBtn: fgui.GButton = null;
    private _tf: fgui.GRichTextField = null;

    public constructor() {
        super('bag', 'BagView', ViewType.WINDOW, ViewLayer.WINDOW_LAYER);
    }

    public destroy() {
        if (this.isInit) {
            this.removeEvent();
        }
        super.destroy();
    }

    protected onInit(): void {
        this.initEvent();
    }

    protected onShown(): void {
        App.EffectUtils.startTyperEffect(this._tf, '[color=#009900]你好[/color]嗯嗯嗯嗯', 300, this, () => {
            console.log('==========> 打字机完成！');
        });
    }

    protected onUpdate(dt: number): void {

    }

    protected onClickMatte(): void {
        this.onClickBtn();
    }

    private onClickBtn(): void {
        App.ViewManager.close(BagView);
    }

    private initEvent(): void {
        this._closeBtn.onClick(this.onClickBtn, this);
    }

    private removeEvent(): void {
        this._closeBtn.offClick(this.onClickBtn, this);
    }

}