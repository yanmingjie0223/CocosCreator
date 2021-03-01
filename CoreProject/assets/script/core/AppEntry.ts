import MainCtrl from "../module/main/MainCtrl";
import MainView from "../module/main/MainView";
import App from "./App";
import { ResFile, ViewShowType } from "./const/CoreConst";
const {ccclass, executionOrder} = cc._decorator;

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:05:01
 * @Last Modified by: yanmingjie.jack@shengqugames.com
 * @Last Modified time: 2021-03-01 17:24:47
 */
@ccclass
@executionOrder(-1)
export default class AppEntry extends cc.Component {

    protected onLoad(): void {
        this.initManager();
        this.loadJson();
    }

    protected update(dt: number): void {
        App.TimeManager.onUpdate(dt);
        App.ResManager.onUpdate(dt);
    }

    private loadJson(): void {
        const resJson: Array<ResFile> = [
            {
                url: 'data/systemConfig',
                type: cc.JsonAsset
            },
            {
                url: 'resource',
                type: cc.JsonAsset
            }
        ]
        App.LoadManager.loadArray(resJson, this.onJson, this.onJsonError, null, this);
    }

    private initManager(): void {
        App.DebugUtils.isDebug = true;
        App.DebugUtils.init();
        App.SoundManager.init();
        App.I18nManager.init();
        App.ResManager.init();
        App.StageManager.init();
        App.PlatformManager.init();
        App.LayerManager.init();
        App.ModelManager.init();
        App.ViewManager.init();
    }

    private initModel(): void {
        // todo: 初始化model
    }

    private onJson(): void {
        App.LoadManager.init();
        App.SystemManager.init();

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
        App.ViewManager.show(MainView, null, MainCtrl, null, ViewShowType.MULTI_VIEW);
    }

}
