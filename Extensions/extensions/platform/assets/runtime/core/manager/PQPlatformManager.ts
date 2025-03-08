import { PQDotInfo } from '../base/PQDotInfo';
import { PQPay } from '../base/PQPay';
import { PQPlatform } from "../base/PQPlatform";
import { PQPlatformType } from "../entity/PQConst";
import { PQSystem } from "../entity/PQSystem";
import { PQUser } from "../entity/PQUser";

export class PQPlatformManager {
	private _platform: PQPlatform | null;
	private _platformType: PQPlatformType;
	private _user: PQUser | null;
	private _system: PQSystem | null;
	private _dotInfo: PQDotInfo | null;
	private _pay: PQPay | null;

	public constructor() {
		this._platform = null;
		this._user = null;
		this._system = null;
		this._platformType = PQPlatformType.PT_UNKNOWN;
	}

	/**
	 * 设置平台类型
	 * @param platformType
	 */
	public set plarmType(platformType: PQPlatformType) {
		this._platformType = platformType;
	}

	/**
	 * 获取平台类型
	 */
	public get plarmType(): PQPlatformType {
		return this._platformType;
	}

	public get platform(): PQPlatform | null {
		return this._platform;
	}

	public set platform(platform: PQPlatform | null) {
		this._platform = platform;
	}

	public set user(user: PQUser | null) {
		this._user = user;
	}

	public get user(): PQUser | null {
		return this._user;
	}

	public set system(system: PQSystem | null) {
		this._system = system;
	}

	public get system(): PQSystem | null {
		return this._system;
	}

	public set dotInfo(dotInfo: PQDotInfo | null) {
		this._dotInfo = dotInfo;
	}

	public get dotInfo(): PQDotInfo | null {
		return this._dotInfo;
	}

	public set pay(pay: PQPay | null) {
		this._pay = pay;
	}

	public get pay(): PQPay | null {
		return this._pay;
	}

}
