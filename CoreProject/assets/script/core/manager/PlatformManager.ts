import Singleton from "../base/Singleton";
import { PlatformType } from "../const/CoreConst";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-05-30 15:54:08
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-07-01 21:50:21
 */
export default class PlatformManager extends Singleton {

    // 平台名字
    private _platformName: string;

    public constructor() {
        super();
    }

    public init(): void {
        this.initPlatform();
    }

    /**
     * 设置获取平台名字
     */
    public set platformName(name: string) {
        this._platformName = name;
    }
    public get platformName() {
        return this._platformName;
    }

    private initPlatform(): void {
        let platName: string;
        // 这里判断native平台，需要注意
        if (!CC_PREVIEW && CC_JSB) {
            platName = PlatformType.NATIVE;
        }
        else if (window['qq']) {
            platName = PlatformType.QQ;
        }
        else if (window['wx']) {
            platName = PlatformType.WX;
        }
        else {
            platName = PlatformType.WEB;
        }
        this._platformName = platName;
    }

}