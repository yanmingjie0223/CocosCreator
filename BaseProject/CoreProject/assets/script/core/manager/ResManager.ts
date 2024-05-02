import AppConfig from "../../config/AppConfig";
import Singleton from "../base/Singleton";
import { ResFile } from "../const/CoreConst";
import LoadManager from "./LoadManager";
import PathManager from "./PathManager";
interface ResCacheFile {
    count: number;
    type: typeof cc.Asset;
    cacheTime: number;
    isClear: boolean;
}
type ResCache = {
    [url: string]: Array<ResCacheFile>
}

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 19:19:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-03-01 16:13:37
 */
export default class ResManager extends Singleton {

    /**加载资源缓存 */
    private _resCache: ResCache;
    /**资源检查间隔时间(s) */
    private _interval: number = 5;
    /**当前累计时间 */
    private _time: number;

    public constructor() {
        super();
    }

    public init(): void {
        this._resCache = {};
        this._time = 0;
    }

    /**
     * 每帧更新
     * @param dt 更新时间(s)
     */
    public onUpdate(dt: number): void {
        this._time += dt;
        if (this._time < this._interval) {
            return;
        }

        this._time -= this._interval;
        let cacheFile: ResCacheFile;
        let cacheFiles: Array<ResCacheFile>;
        const resCache: ResCache = this._resCache;
        for (let url in resCache) {
            cacheFiles = resCache[url];
            for (let i = 0, len = cacheFiles.length; i < len; i++) {
                cacheFile = cacheFiles[i];
                if (cacheFile.count <= 0 && cacheFile.isClear) {
                    cacheFile.cacheTime += this._interval;
                }
                if (cacheFile.cacheTime >= AppConfig.resCacheTime) {
                    this.release(url, cacheFile.type);
                    cacheFiles.splice(i, 1);
                    --i;
                    --len;
                    if (cacheFiles.length <= 0) {
                        delete this._resCache[url];
                        break;
                    }
                }
            }
        }
    }

    /**
     * 获取资源
     * @param path 资源地址
     * @param type 文件类型
     */
    public getRes(path: string, type?: typeof cc.Asset): any {
        return cc.resources.get(path, type);
    }

    /**
     * 移除资源名
     * @param path
     * @param type
     */
    public release(path: string, type: typeof cc.Asset): void {
        // 移除资源之前移除fgui包
        if (path.indexOf('ui') !== -1) {
            const pkgName: string = path.split('/')[1];
            this.removeUiPackage(pkgName);
        }
        cc.resources.release(path, type);
    }

    /**
     * 添加ui包体
     * @param pkgName 包名
     */
    public addUiPackage(pkgName: string): void {
        const pkg: fgui.UIPackage = fgui.UIPackage.getByName(pkgName);
        if (!pkg) {
            const pathManager = PathManager.getInstance<PathManager>();
            const pkgUrl: string = pathManager.getPkgPath(pkgName);
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
     * @param isTrust 是否托管
     */
    public addGroupUse(groupName: string, isTrust: boolean): void {
        if (!isTrust) return;
        const loadManager = LoadManager.getInstance<LoadManager>();
        const resFile: Array<ResFile> = loadManager.getGroupUrls(groupName);
        this.addUseRes(resFile);
    }

    /**
     * 移除资源组使用
     * @param groupName 资源组名
     * @param isTrust 是否托管
     */
    public removeGroupUse(groupName: string, isTrust: boolean): void {
        if (!isTrust) return;
        const loadManager = LoadManager.getInstance<LoadManager>();
        const resFile: Array<ResFile> = loadManager.getGroupUrls(groupName);
        this.removeUseRes(resFile);
    }

    /**
     * 添加资源引用次数
     * @param files 资源路径，可是数组类型
     * @param isClear 是否能清理默认可清理资源
     */
    public addUseRes(files: Array<ResFile>, isClear: boolean = true): void {
        let file: ResFile;
        let cacheFile: ResCacheFile;
        let cacheFiles: Array<ResCacheFile>;
        for (let i = 0, len = files.length; i < len; i++) {
            file = files[i];
            cacheFiles = this._resCache[file.url];
            let isCache: boolean = false;
            if (cacheFiles) {
                for (let i = 0, len = cacheFiles.length; i < len; i++) {
                    cacheFile = cacheFiles[i];
                    if (file.type === cacheFile.type) {
                        cacheFile.count += 1;
                        cacheFile.cacheTime = 0;
                        cacheFile.isClear = isClear;
                        isCache = true;
                        break;
                    }
                }
            }
            if (!cacheFiles || !isCache) {
                cacheFile = cc.js.createMap();
                cacheFile.count = 1;
                cacheFile.cacheTime = 0;
                cacheFile.isClear = isClear;
                cacheFile.type = file.type;
                if (cacheFiles) {
                    cacheFiles.push(cacheFile);
                }
                else {
                    this._resCache[file.url] = [cacheFile];
                }
            }
        }
    }

    /**
     * 删除资源引用次数
     * @param files 资源路径，可是数组类型
     */
    public removeUseRes(files: Array<ResFile>): void {
        let file: ResFile;
        let cacheFiles: Array<ResCacheFile>;
        let cacheFile: ResCacheFile;
        for (let i = 0, len = files.length; i < len; i++) {
            file = files[i];
            cacheFiles = this._resCache[file.url];
            if (cacheFiles) {
                for (let i = 0, len = cacheFiles.length; i < len; i++) {
                    cacheFile = cacheFiles[i];
                    if (file.type === cacheFile.type) {
                        cacheFile.count -= 1;
                        break;
                    }
                }
            }
        }
    }

}