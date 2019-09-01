import App from "./App";
import MainCtrl from "../module/main/MainCtrl";
import MainView from "../module/main/MainView";
import { ViewShowType } from "./const/ViewShowType";
const {ccclass, executionOrder} = cc._decorator;

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:05:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-09-01 22:56:48
 */
@ccclass
@executionOrder(-1)
export default class AppEntry extends cc.Component {

    protected onLoad(): void {
        this.loadJson();
    }

    protected update(dt: number): void {
        App.TimeManager.onUpdate(dt);
        App.ResManager.onUpdate(dt);
    }

    private loadJson(): void {
        const resJson: Array<string> = [
            'data/systemConfig',
            'resource'
        ]
        App.LoadManager.loadArray(resJson, this.onJson, this.onJsonError, null, this);
    }

    private onJson(): void {
        App.DebugUtils.isDebug = true;
        App.DebugUtils.init();

        App.I18nManager.init();
        App.ResManager.init();
        App.LoadManager.init();
        App.PlatformManager.init();
        App.SystemManager.init();
        App.StageManager.init();
        App.LayerManager.init();
        App.ModelManager.init();
        App.ViewManager.init();

        App.LoadManager.loadPackage('preload', this.onPreload, null, null, this);
    }

    private onJsonError(): void {
        App.DebugUtils.error('加载错误重新加载游戏！');
    }

    private onPreload(): void {
        App.FguiManager.initConfig();
        App.FguiManager.init();

        App.LoadManager.loadPackage('uiShare', this.onMain, null, null, this);
    }

    private onMain(): void {
        App.ViewManager.show(MainCtrl, null, MainView, null, ViewShowType.MULTI_VIEW);
    }

}
