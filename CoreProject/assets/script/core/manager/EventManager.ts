/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:07:44
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-09 16:33:51
 */
export default class EventManager extends cc.EventTarget {

    // 单例获取
    private static _instance: EventManager;
    public static getInstance(): EventManager {
        if (!this._instance) {
            this._instance = new EventManager();
        }
        return this._instance;
    }

    public constructor() {
        super();
    }

}