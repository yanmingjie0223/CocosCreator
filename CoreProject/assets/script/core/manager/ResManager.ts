import Singleton from "../base/Singleton";
import App from "../App";
import AppConfig from "../../config/AppConfig";
type ResCache = {
    [url: string]: {count: number, cacheTime: number, isClear: boolean}
}

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 19:19:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-25 21:05:12
 */
export default class ResManager extends Singleton {

    // 加载资源缓存
    private _resCache: ResCache;

    public constructor() {
        super();
    }

    public init(): void {
        this._resCache = {};
    }

    /**
     * 每帧更新
     * @param dt 更新时间(s)
     */
    public onUpdate(dt: number): void {
        let res: {count: number, cacheTime: number, isClear: boolean};
        const resCache: ResCache = this._resCache;
        for (let url in resCache) {
            res = resCache[url];
            if (res.count <= 0 && res.isClear) {
                res.cacheTime += dt;
            }
            if (res.cacheTime >= AppConfig.resCacheTime) {
                this.release(url);
                delete this._resCache[url];
            }
        }
    }

    /**
     * 获取资源
     * @param url 资源地址
     */
    public getRes(url: string): any {
        return cc.loader.getRes(url);
    }

    /**
     * 销毁缓存资源
     * @param url 销毁资源
     */
    public clearRes(url: string | Array<string>): void {
        this.removeUseRes(url);
    }

    /**
     * 添加ui包体
     * @param pkgName 包名
     */
    public addUiPackage(pkgName: string): void {
        const pkg: fgui.UIPackage = fgui.UIPackage.getByName(pkgName);
        if (!pkg) {
            const pkgUrl: string = App.PathManager.getPkgPath(pkgName);
            fgui.UIPackage.addPackage(pkgUrl);
        }
    }

    /**
     * 删除ui包体
     * @param pkgName 包名
     */
    public removeUiPackage(pkgName: string): void {
        const pkg: fgui.UIPackage = fgui.UIPackage.getByName(pkgName);
        if (pkg) {
            fgui.UIPackage.removePackage(pkgName);
        }
    }

    /**
     * 添加资源组使用
     * @param groupName 资源组名
     */
    public addGroupUse(groupName: string): void {
        const urls: Array<string> = App.LoadManager.getGroupUrls(groupName);
        this.addUseRes(urls);
    }

    /**
     * 移除资源组使用
     * @param groupName 资源组名
     */
    public removeGroupUse(groupName: string): void {
        const urls: Array<string> = App.LoadManager.getGroupUrls(groupName);
        this.removeUseRes(urls);
    }

    /**
     * 添加资源引用次数
     * @param url 资源路径，可是数组类型
     * @param isClear 是否能清理默认可清理资源
     */
    public addUseRes(url: string | Array<string>, isClear: boolean = true): void {
        let urls: Array<string>;
        if (typeof(url) === 'string') {
            urls = [url];
        }
        else {
            urls = url;
        }

        let resName: string;
        let res: {count: number, cacheTime: number, isClear: boolean};
        for (let i = 0, len = urls.length; i < len; i++) {
            resName = urls[i];
            res = this._resCache[resName];
            if (!res) {
                res = {} as any;
                res.count = 1;
                res.cacheTime = 0;
                res.isClear = isClear;
                this._resCache[resName] = res;
            }
            else {
                res.count += 1;
                res.cacheTime = 0;
                res.isClear = isClear;
            }
        }
    }

    /**
     * 删除资源引用次数
     * @param url 资源路径，可是数组类型
     */
    public removeUseRes(url: string | Array<string>): void {
        let urls: Array<string>;
        if (typeof(url) === 'string') {
            urls = [url];
        }
        else {
            urls = url;
        }

        let resName: string;
        let res: {count: number, cacheTime: number, isClear: boolean};
        for (let i = 0, len = urls.length; i < len; i++) {
            resName = urls[i];
            res = this._resCache[resName];
            if (res && res.count > 0) {
                res.count -= 1;
            }
        }
    }

    /**
     * 移除资源名
     */
    private release(resUrl: string): void {
        // 移除资源之前移除fgui包
        if (resUrl.indexOf('ui') !== -1) {
            const pkgName: string = resUrl.split('/')[1];
            this.removeUiPackage(pkgName);
        }
        cc.loader.release(resUrl);
    }

}