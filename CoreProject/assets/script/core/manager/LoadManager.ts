import Singleton from "../base/Singleton";
import App from "../App";
type ResJson = {
    groups: Array<{keys: string, name: string}>,
    resources: Array<{name: string, type: string, url: string}>
};

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-25 14:15:27
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-02-26 11:05:42
 */
export default class LoadManager extends Singleton {

    // 加载资源配置
    private _resJson: ResJson;

    public constructor() {
        super();
    }

    public init(): void {
        const resUrl: string = 'resource.json';
        this._resJson = App.ResManager.getRes(resUrl).json;
        this.removeExtname();
        App.ResManager.clearRes(resUrl);
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
        if (!groupName) return;
        const urls: Array<string> = this.getGroupUrls(groupName);
        this.loadArray(urls, completeFun, errorFun, progressFun, thisObj);
    }

    /**
     * 加载资源组
     * @param groupNames 资源组名数组
     * @param completeFun 加载成功
     * @param errorFun 加载失败
     * @param progressFun 加载进度
     * @param thisObj 函数this对象
     */
    public loadArrayGroup(groupNames: Array<string>, completeFun: Function, errorFun: Function, progressFun: Function, thisObj: any): void {
        if (!groupNames || groupNames.length <= 0) {
            return;
        }

        let groupName: string;
        let urls: Array<string> = [];
        for (let i = 0; i < groupNames.length; i++) {
            groupName = groupNames[i];
            urls = urls.concat(this.getGroupUrls(groupName));
        }
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
     * 加载包名
     * @param pkgName 包名也是资源组名
     * @param completeFun 加载成功
     * @param errorFun 加载失败
     * @param progressFun 加载进度
     * @param thisObj 函数this对象
     */
    public loadPackage(pkgName: string, completeFun: Function, errorFun: Function, progressFun: Function, thisObj: any): void {
        this.loadGroup(pkgName, function() {
            App.ResManager.addUiPackage(pkgName);
            completeFun && completeFun.apply(thisObj);
        }, errorFun, progressFun, thisObj);
    }

    /**
     * 加载包名
     * @param pkgNameArr 包名也是资源组名
     * @param completeFun 加载成功
     * @param errorFun 加载失败
     * @param progressFun 加载进度
     * @param thisObj 函数this对象
     */
    public loadArrayPackage(pkgNameArr: Array<string>, completeFun: Function, errorFun: Function, progressFun: Function, thisObj: any): void {
        this.loadArrayGroup(pkgNameArr, function() {
            for (let i = 0, len = pkgNameArr.length; i < len; i++) {
                App.ResManager.addUiPackage(pkgNameArr[i]);
            }
            completeFun && completeFun.apply(thisObj);
        }, errorFun, progressFun, thisObj);
    }

    /**
     * 获取资源组中所有资源url
     * @param groupName 资源组
     */
    public getGroupUrls(groupName: string): Array<string> {
        const urls: Array<string> = [];
        const groups: Array<{keys: string, name: string}> = this._resJson.groups;
        const resources: Array<{name: string, type: string, url: string}> = this._resJson.resources;
        let group: {keys: string, name: string};
        for (let i = 0, len = groups.length; i < len; i++) {
            if (groups[i].name === groupName) {
                group = groups[i];
                break;
            }
        }
        const keys: Array<string> = group.keys.split(',');
        const keyLen: number = keys.length;
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
     * 移除资源配置数据中的资源拓展名
     */
    private removeExtname(): void {
        let res: {name: string, type: string, url: string}
        const resources: Array<{name: string, type: string, url: string}> = this._resJson.resources;
        for (let i = 0, len = resources.length; i < len; i++) {
            res = resources[i];
            res.url = res.url.split('.')[0];
        }
    }

}