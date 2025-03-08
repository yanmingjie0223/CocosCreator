import { PQExpoManager } from "./PQExpoManager";
import { PQLoginManager } from "./PQLoginManager";
import { PQPlatformManager } from "./PQPlatformManager";

export class PQPlatformSDK {

	private _platformManager: PQPlatformManager;
	private _loginMananger: PQLoginManager;
	private _expoManager: PQExpoManager;

	public constructor() {
		this._expoManager = new PQExpoManager();
		this._platformManager = new PQPlatformManager();
		this._loginMananger = new PQLoginManager();
	}

	/**
	 * 登陆管理
	 */
	public get loginMananger(): PQLoginManager {
		return this._loginMananger;
	}

	/**
	 * 平台管理
	 */
	public get platformMananger(): PQPlatformManager {
		return this._platformManager;
	}

	/**
	 * 广告管理
	 */
	public get expoMananger(): PQExpoManager {
		return this._expoManager;
	}

}
