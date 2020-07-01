import Singleton from "../base/Singleton";
import App from "../App";
import { PlatformType } from "../const/CoreConst";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-24 15:50:06
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-07-01 21:47:59
 */
export interface IFitItem {
    // 例如 "iPhone X": {"width": 640, "height": 1247, "alignH": "center", "alignV": "middle"}
    width: number,  // 宽
    height: number, // 高
    alignH: string, // 水平适配 center left right
    alignV: string  // 垂直适配 middle top buttom
}

interface IFitInfo {
    [name: string]: IFitItem
}

export default class SystemManager extends Singleton {

    // 设备名字
    private _systemName: string;
    // 适配信息数据
    private _viewFitJson: IFitInfo

    public constructor() {
        super();
    }

    public init(): void {
        this.initSystemName();

        const resUrl: string = 'data/systemConfig';
        this._viewFitJson = App.ResManager.getRes(resUrl, cc.JsonAsset).json;
        App.ResManager.clearRes(resUrl);
    }

    /**
     * 获取设备适配信息
     * @param systemName 设备名称
     */
    public getFitInfo(systemName: string = this._systemName): IFitItem {
        if (systemName && this._viewFitJson[systemName]) {
            return this._viewFitJson[systemName];
        }
        return null;
    }

    private initSystemName(): void {
        let platformMini: any;
        const platName: string = App.PlatformManager.platformName;
        switch (platName) {
            case PlatformType.NATIVE:
            case PlatformType.WEB:
                return;
            case PlatformType.QQ:
                platformMini = window['qq'];
                break
            case PlatformType.WX:
                platformMini = window['wx'];
                break;
            default:
                App.DebugUtils.error(`${platformMini} 平台还未处理！`);
                return;
        }
        // 目前指定微信小游戏和QQ小游戏平台
        if (platformMini && platformMini.getSystemInfo) {
            platformMini.getSystemInfo({
                success: (systemInfo: SystemInfo) => {
                    this._systemName = systemInfo.model;
                }
            });
        }
    }

}