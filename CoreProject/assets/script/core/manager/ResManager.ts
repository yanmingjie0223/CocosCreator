import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 19:19:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-17 15:22:01
 */
export default class ResManager extends Singleton {

    public constructor() {
        super();
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