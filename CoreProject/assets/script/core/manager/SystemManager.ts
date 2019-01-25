import Singleton from "../base/Singleton";
import App from "../App";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-24 15:50:06
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-25 17:25:36
 */
export interface IFitItem {
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

        const resUrl: string = 'data/systemConfig.json';
        this._viewFitJson = App.ResManager.getRes(resUrl).json;
        App.ResManager.clearRes(resUrl);
    }

    /**
     * 获取设备适配信息
     * @param systemName 设备名称
     */
    public getFitInfo(systemName: string = this._systemName): IFitItem {
        if (this._viewFitJson[systemName]) {
            return this._viewFitJson[systemName];
        }
        return null;
    }

    private initSystemName(): void {
        const wx = window['wx'];
        if (wx) {
            wx.getSystemInfo({
                success: (systemInfo: SystemInfo) => {
                    this._systemName = systemInfo.model;
                }
            });
        }
    }

}