import Singleton from "../base/Singleton";
import App from "../App";
type ResJson = {
    groups: Array<{keys: string, name: string}>,
    resources: Array<{name: string, type: string, url: string}>
};

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 19:19:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-24 17:33:52
 */
export default class ResManager extends Singleton {

    // 加载资源配置
    private _resJson: ResJson;
    // 加载资源缓存
    private _resCache: any;

    public constructor() {
        super();
    }

    public initResJson(): void {
        const resUrl: string = 'resource.json';
        this._resJson = cc.loader.getRes(resUrl).json;
        this.clearRes(resUrl);
    }

    /**
     * 加载资源组
     * @param groupName 资源组名
     * @param completeFun 加载成功
     * @param errorFun 加载失败
     * @param progressFun 加载进度
     * @param thisObj 函数this对象
     */
    public loadGroup(groupName: string, completeFun: Function, errorFun: Function, progressFun: Function, thisObj: any): void {
        const urls: Array<string> = this.getGroupUrls(groupName);
        this.loadArray(urls, completeFun, errorFun, progressFun, thisObj);
    }

    /**
     * 加载单个资源
     * @param url 资源地址
     * @param completeFun 加载完成返回
     * @param errorFun 加载错误返回
     * @param progressFun 加载进度返回
     * @param thisObj 加载this对象
     */
    public load(url: string, completeFun: Function, errorFun: Function, progressFun: Function, thisObj: any): void {
        cc.loader.loadRes(url,
            function(completedCount: number, totalCount: number, item: any) {
                progressFun && progressFun.apply(thisObj, arguments)
            },
            function(error: Error, resource: any) {
                if (error) {
                    errorFun && errorFun.apply(thisObj, arguments);
                }
                else {
                    completeFun && completeFun.apply(thisObj);
                }
            }
        );
    }

    /**
     * 加载多个资源
     * @param url 资源地址
     * @param completeFun 加载完成返回
     * @param errorFun 加载错误返回
     * @param progressFun 加载进度返回
     * @param thisObj 加载this对象
     */
    public loadArray(url: Array<string>, completeFun: Function, errorFun: Function, progressFun: Function, thisObj: any): void {
        cc.loader.loadResArray(url,
            function(completedCount: number, totalCount: number, item: any) {
                progressFun && progressFun.apply(thisObj, arguments)
            },
            function(error: Error, resource: any) {
                if (error) {
                    errorFun && errorFun.apply(thisObj, arguments);
                }
                else {
                    completeFun && completeFun.apply(thisObj);
                }
            }
        );
    }

    /**
     * 加载包
     * @param pkgName 包名
     * @param completeFun 加载完成函数
     * @param errorFun 加载出错函数
     * @param thisObj 加载函数this对象
     */
    public loadPackage(pkgName: string, completeFun: Function, errorFun: Function, thisObj: any): void {
        const url: string = App.PathManager.getPkgPath(pkgName);
        fgui.UIPackage.loadPackage(url, function(err: any) {
            if (err) {
                errorFun && errorFun.apply(thisObj, err);
            }
            else {
                completeFun && completeFun.apply(thisObj);
            }
        });
    }

    /**
     * 销毁缓存资源
     * @param url 销毁资源
     */
    public clearRes(url: string | Array<string>): void {
        cc.loader.release(url);
    }

    /**
     * 获取资源组中所有资源url
     * @param groupName 资源组
     */
    public getGroupUrls(groupName: string): Array<string> {
        const urls: Array<string> = [];
        const groups: Array<{keys: string, name: string}> = this._resJson['groups'];
        const resources: Array<{name: string, type: string, url: string}> = this._resJson['resources'];
        let group: {keys: string, name: string};
        for (let i = 0, len = groups.length; i < len; i++) {
            if (groups[i].name === groupName) {
                group = groups[i];
                break;
            }
        }
        const keys: string = group.keys;
        const keyLen: number = keys.split(',').length;
        for (let i = 0, len = resources.length; i < len; i++) {
            if (keys.indexOf(resources[i].name) !== -1) {
                urls.push(resources[i].url);
                if (urls.length >= keyLen) {
                    break;
                }
            }
        }
        return urls;
    }

    /**
     * 添加ui包体
     * @param pkgUrl 包资源地址
     * @param pkgName 包名
     */
    public addUiPackage(pkgUrl: string, pkgName: string): void {
        const pkg: fgui.UIPackage = fgui.UIPackage.getByName(pkgName);
        if (!pkg) {
            fgui.UIPackage.addPackage(pkgUrl);
        }
    }

    /**
     * 删除ui包体
     * @param pkgIdOrName 包id或者包名
     */
    public removeUiPackage(pkgIdOrName: string): void {
        const pkg: fgui.UIPackage = fgui.UIPackage.getByName(pkgIdOrName);
        if (pkg) {
            fgui.UIPackage.removePackage(pkgIdOrName);
        }
    }

}