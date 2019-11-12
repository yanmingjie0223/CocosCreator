import App from "../../core/App";
import BComponent from "../../core/base/BComponent";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-22 21:31:34
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-25 14:56:00
 */
export default class GlobalModalWaiting extends BComponent {

    private hideTime: number = 1;
    private _showTime: number;
    private _isShow: boolean;
    private _bar: fgui.GImage;
    private _barBg: fgui.GImage;

    public constructor() {
        super();
    }

    protected onConstruct(): void {
        this.setSize(App.StageManager.viewWidth, App.StageManager.viewHeight);

        this._barBg = this.getChild('barBg').asImage;
        this._bar = this.getChild('bar').asImage;

        this.hideUI();
    }

    protected onDisable(): void {
        super.onDisable();

        this._showTime = null;
        this._isShow = null;
    }

    protected onUpdate(dt: number): void {
        this._showTime += dt;
        if (this._showTime >= this.hideTime && !this._isShow) {
            this.showUI();
        }

        let rotation: number = this._bar.rotation;
        rotation += 10;
        if(rotation > 360) {
            rotation = rotation % 360;
        }
        this._bar.rotation = rotation;
    }

    private hideUI(): void {
        this._showTime = 0;
        this._isShow = false;

        this._bar.visible = false;
        this._barBg.visible = false;
    }

    private showUI(): void {
        this._isShow = true;

        this._bar.visible = true;
        this._barBg.visible = true;
    }

}