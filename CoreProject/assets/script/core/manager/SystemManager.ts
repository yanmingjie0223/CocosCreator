import Singleton from "../base/Singleton";
import { PlatformType } from "../const/CoreConst";
import DebugUtils from "../utils/DebugUtils";
import PlatformManager from "./PlatformManager";
import ResManager from "./ResManager";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-24 15:50:06
 * @Last Modified by: yanmingjie.jack@shengqugames.com
 * @Last Modified time: 2021-03-01 16:16:37
 */

/**
 * 例如 "iPhone X": {"width": 640, "height": 1247, "alignH": "center", "alignV": "middle"}
 */
export interface IFitItem {
    /**宽 */
    width: number,
    /**高 */
    height: number,
    /**水平适配 center left right */
    alignH: string,
    /**垂直适配 middle top buttom */
    alignV: string,
}

interface IFitInfo {
    [name: string]: IFitItem
}

export default class SystemManager extends Singleton {

    /**设备名字 */
    private _systemName: string;
    /**适配信息数据 */
    private _viewFitJson: IFitInfo

    public constructor() {
        super();
    }

    public init(): void {
        this.initSystemName();

        const resUrl: string = 'data/systemConfig';
        const resManager = ResManager.getInstance<ResManager>();
        this._viewFitJson = resManager.getRes(resUrl, cc.JsonAsset).json;
        resManager.release(resUrl, cc.JsonAsset);
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
        const platformManager = PlatformManager.getInstance<PlatformManager>();
        const platName: string = platformManager.platformName;
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
                const debugUtils = DebugUtils.getInstance<DebugUtils>();
                debugUtils.error(`${platformMini} 平台还未处理！`);
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