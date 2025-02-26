import Singleton from "../base/Singleton";
import { ResFile } from "../const/CoreConst";
import ResManager from "./ResManager";
type ResJson = {
    groups: Array<{keys: string, name: string}>,
    resources: Array<{name: string, type: string, url: string}>
};
const fileType: { [type: string]: typeof cc.Asset } = {
    'image': cc.SpriteFrame,
    'bin': cc.BufferAsset,
    'json': cc.JsonAsset
}

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-25 14:15:27
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-12-07 23:32:58
 */
export default class LoadManager extends Singleton {

    /**加载资源配置 */
    private _resJson: ResJson = null!;

    public init(): void {
        const resUrl: string = 'resource';
        const resMgr = ResManager.getInstance<ResManager>();
        this._resJson = resMgr.getRes(resUrl, cc.JsonAsset).json;
        this.removeExtname();
        resMgr.release(resUrl, cc.JsonAsset);
    }

    /**
     * 加载资源组
     * @param groupName 资源组名
     * @param completeFun 加载成功
     * @param errorFun 加载失败
     * @param progressFun 加载进度
     * @param thisObj 函数this对象
     */
    public loadGroup(
		groupName: string,
		completeFun: Function | null,
		errorFun: Function | null,
		progressFun: Function | null,
		thisObj: any | null
	): void {
        if (!groupName) return;
        const resFiles: Array<ResFile> = this.getGroupUrls(groupName);
        this.loadArray(resFiles, completeFun, errorFun, progressFun, thisObj);
    }

    /**
     * 加载资源组
     * @param groupNames 资源组名数组
     * @param completeFun 加载成功
     * @param errorFun 加载失败
     * @param progressFun 加载进度
     * @param thisObj 函数this对象
     */
    public loadArrayGroup(
		groupNames: Array<string>,
		completeFun: Function | null,
		errorFun: Function | null,
		progressFun: Function | null,
		thisObj: any | null
	): void {
        if (!groupNames || groupNames.length <= 0) {
            return;
        }

        let groupName: string;
        let resFiles: Array<ResFile> = [];
        for (let i = 0; i < groupNames.length; i++) {
            groupName = groupNames[i];
            resFiles = resFiles.concat(this.getGroupUrls(groupName));
        }
        this.loadArray(resFiles, completeFun, errorFun, progressFun, thisObj);
    }

    /**
     * 加载单个资源
     * @param resFile 资源信息
     * @param completeFun 加载完成返回
     * @param errorFun 加载错误返回
     * @param progressFun 加载进度返回
     * @param thisObj 加载this对象
     */
    public load(
		resFile: ResFile,
		completeFun: Function | null,
		errorFun: Function | null,
		progressFun: Function | null,
		thisObj: any | null
	): void {
        cc.resources.load(
            resFile.url,
            resFile.type,
            function(completedCount: number, totalCount: number, item: any) {
                progressFun && progressFun.apply(thisObj, arguments);
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
     * @param resFiles 资源地址
     * @param completeFun 加载完成返回
     * @param errorFun 加载错误返回
     * @param progressFun 加载进度返回
     * @param thisObj 加载this对象
     */
    public loadArray(
		resFiles: Array<ResFile>,
		completeFun: Function | null,
		errorFun: Function | null,
		progressFun: Function | null,
		thisObj: any | null
	): void {
        let comCount: number = 0;
        let errCount: number = 0;
        let err: Error;
        let asset: any;
        let resFile: ResFile;
        const resLen: number = resFiles.length;
        for (let i = 0; i < resLen; i++) {
            resFile = resFiles[i];
            this.load(
                resFile,
                () => {
                    ++comCount;
                    deal();
                },
                (error: Error, resource: any) => {
                    ++errCount;
                    err = error;
                    asset = resource;
                    deal();
                },
                null!,
                this
            );
        }
        function deal() {
            progressFun && progressFun.apply(thisObj, [comCount, resLen]);
            if (comCount + errCount < resLen) return;

            if (errCount > 0) {
                errorFun && errorFun.apply(thisObj, [err, asset]);
            }
            else {
                completeFun && completeFun.apply(thisObj);
            }
        }
    }

    /**
     * 加载包名
     * @param pkgName 包名也是资源组名
     * @param completeFun 加载成功
     * @param errorFun 加载失败
     * @param progressFun 加载进度
     * @param thisObj 函数this对象
     */
    public loadPackage(
		pkgName: string,
		completeFun: Function | null,
		errorFun: Function | null,
		progressFun: Function | null,
		thisObj: any | null
	): void {
        this.loadGroup(pkgName, function() {
            const resMgr = ResManager.getInstance<ResManager>();
            resMgr.addUiPackage(pkgName);
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
    public loadArrayPackage(
		pkgNameArr: Array<string>,
		completeFun: Function | null,
		errorFun: Function | null,
		progressFun: Function | null,
		thisObj: any | null
	): void {
        this.loadArrayGroup(pkgNameArr, function() {
            const resMgr = ResManager.getInstance<ResManager>();
            for (let i = 0, len = pkgNameArr.length; i < len; i++) {
                resMgr.addUiPackage(pkgNameArr[i]);
            }
            completeFun && completeFun.apply(thisObj);
        }, errorFun, progressFun, thisObj);
    }

    /**
     * 获取资源组中所有资源url
     * @param groupName 资源组
     */
    public getGroupUrls(groupName: string): Array<ResFile> {
        const resFiles: Array<ResFile> = [];
        const groups: Array<{keys: string, name: string}> = this._resJson.groups;
        const resources: Array<{name: string, type: string, url: string}> = this._resJson.resources;
        let group: {keys: string, name: string} = { keys: "", name: "" };
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
                resFiles.push({
                    url: resources[i].url,
                    type: this.getType(resources[i].type)
                });
                if (resFiles.length >= keyLen) {
                    break;
                }
            }
        }
        return resFiles;
    }

    private getType(type: string): typeof cc.Asset {
        return fileType[type];
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