import Singleton from "../base/Singleton";
import DebugUtils from "../utils/DebugUtils";

export default class TimeManager extends Singleton {

	/**服务端时间(ms) */
	private _serverTime: number = null!;
	/**服务端和客户端时间差(ms) */
	private _diffTime: number = 0;
	/**是否同步过时间 */
	private _isSyncTime: boolean = false;

	/**
	 * 初始化服务器时间(ms)
	 * @param time 获取同步的服务器时间
	 */
	public initSeverTime(time: number): void {
		this._serverTime = time;
		this._diffTime = this.serverTime - this.localTime;
		this._isSyncTime = true;
	}

	/**
	 * 更新时间
	 * @param dt (s)
	 */
	public onUpdate(dt: number): void {
		if (this._isSyncTime) {
			this._serverTime = this.localTime + this._diffTime;
		}
	}

	/**
	 * 获取立即更新的服务器时间
	 * @returns
	 */
	public getUpdateServerTime(): number {
		if (this._serverTime === null) {
			return this.localTime;
		}

		this._serverTime = this.localTime + this._diffTime;
		return this._serverTime;
	}

	/**
	 * 是否同步过服务器时间
	 */
	public get isSyncTime(): boolean {
		return this._isSyncTime;
	}

	/**
	 * 服务器和本地时间差
	 */
	public get diffTime(): number {
		return this._diffTime;
	}

	/**
	 * 获取服务器时间(ms)
	 */
	public get serverTime(): number {
		if (this._serverTime === null) {
			const debugUtils = DebugUtils.getInstance<DebugUtils>();
			debugUtils.warn('服务器时间还未同步，获取的是本地时间！');
			return this.localTime;
		}
		return this._serverTime;
	}

	/**
	 * 获取本地时间(ms)
	 */
	public get localTime(): number {
		return Date.now();
	}

}
