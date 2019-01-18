import App from "../../core/App";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-22 21:31:34
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-23 14:23:32
 */
export default class GlobalModalWaiting extends fgui.GComponent {

    private _loadBg: fgui.GImage;

    public constructor() {
        super();
    }

    protected onConstruct(): void {
        this.setSize(App.StageManager.viewWidth, App.StageManager.viewHeight);
        this._loadBg = this.getChild('loadBg').asImage;
    }

    protected onUpdate(): void {
        let i: number = this._loadBg.rotation;
        i += 10;
        if(i > 360) {
            i = i % 360;
        }
        this._loadBg.rotation = i;
    }

}