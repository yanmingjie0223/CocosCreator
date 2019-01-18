import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-21 11:38:12
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-21 14:09:00
 */
export default class TimeManager extends Singleton {

    // 服务端时间(s)
    private _serverTime: number;
    // 服务端和客户端时间差(s)
    private _diffTime: number;
    // 是否同步过时间
    private _isSyncTime: boolean;

    public constructor() {
        super();
    }

    /**
     * 初始化服务器时间(s)
     * @param time 获取同步的服务器时间
     */
    public initSeverTime(time: number): void {
        this._serverTime = time;
        this._diffTime = this.serverTime - this.localTime;
        this._isSyncTime = true;
    }

    /**
     * 更新时间
     * @param dt 服务器时间(ms)
     */
    public updateTime(dt: number): void {
        if (!this._isSyncTime) return;
        this._serverTime = this.localTime + this._diffTime;
    }

    /**
     * 获取服务器时间(s)
     */
    public get serverTime(): number {
        return this._serverTime;
    }

    /**
     * 获取本地时间(s)
     */
    public get localTime(): number {
        const time: number = (Date.now() / 1000) | 0;
        return time;
    }

}