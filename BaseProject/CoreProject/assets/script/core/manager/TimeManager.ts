import Singleton from "../base/Singleton";
import DebugUtils from "../utils/DebugUtils";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-21 11:38:12
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-03-01 16:56:42
 */
export default class TimeManager extends Singleton {

    /**服务端时间(s) */
    private _serverTime: number = null!;
    /**服务端和客户端时间差(s) */
    private _diffTime: number = null!;
    /**是否同步过时间 */
    private _isSyncTime: boolean = null!;

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
     * @param dt 服务器时间(s)
     */
    public onUpdate(dt: number): void {
        if (!this._isSyncTime) return;
        this._serverTime = this.localTime + this._diffTime;
    }

    /**
     * 获取服务器时间(s)
     */
    public get serverTime(): number {
        if (this._serverTime === void 0) {
            const debugUtils = DebugUtils.getInstance<DebugUtils>();
            debugUtils.warn('服务器时间还未同步，请先同步时间！');
            return 0;
        }
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