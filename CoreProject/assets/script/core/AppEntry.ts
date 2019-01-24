import App from "./App";
import MainCtrl from "../module/main/MainCtrl";
import MainView from "../module/main/MainView";
import { ViewShowType } from "./const/ViewShowType";
const {ccclass} = cc._decorator;

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:05:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-24 21:52:00
 */
@ccclass
export default class AppEntry extends cc.Component {

    protected onLoad(): void {
        this.loadJson();
    }

    protected update(dt: number): void {
        App.TimeManager.updateTime(dt);
    }

    private loadJson(): void {
        const resJson: Array<string> = [
            'data/systemConfig.json',
            'resource.json'
        ]
        App.ResManager.loadArray(resJson, this.onJson, this.onJsonError, null, this);
    }

    private onJson(): void {
        App.DebugUtils.isDebug = true;
        App.DebugUtils.init();

        App.ResManager.initResJson();
        App.SystemManager.init();
        App.StageManager.init();
        App.LayerManager.init();
        App.ModelManager.init();
        App.ViewManager.init();

        App.ResManager.loadPackage('Preload', this.onPreload, null, this);
    }

    private onJsonError(): void {
        App.DebugUtils.error('加载错误重新加载游戏！');
    }

    private onPreload(): void {
        App.FguiManager.initConfig();
        App.FguiManager.init();

        App.ResManager.loadPackage('UiShare', this.onShare, null, this);
    }

    private onShare(): void {
        App.ViewManager.show(MainCtrl, null, MainView, null, ViewShowType.MULTI_VIEW);
    }

}
