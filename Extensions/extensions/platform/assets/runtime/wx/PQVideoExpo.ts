import { PQErrorCode, PQExpo, PQStatus } from "../core/PQIndex";

export interface PQVideoExpoOptions {
	adUnitId: string;
	/**是否启用多例模式 默认false v2.8.0 */
	multiton?: boolean;
}

export class PQVideoExpo extends PQExpo {

	private _videoExpo: WechatMinigame.RewardedVideoAd;
	private _onCloseCallback: Function | null;
	private _onLoadCallback: Function | null;
	private _onErrorCallback: Function | null;

	public constructor(options: PQVideoExpoOptions) {
		super(options);
		this._onLoadCallback = null;
		this._onCloseCallback = null;
		this._onErrorCallback = null;
		this._videoExpo = wx.createRewardedVideoAd(options);
	}

	public load(): void {
		this._videoExpo.load();
	}

	public show(): void {
		this._videoExpo.show();
	}

	public onLoad(success: (res: { state: string, status: string }) => void): void {
		this._onLoadCallback = success;
		this._videoExpo.onLoad(this._onLoad);
	}

	public onClose(success: (isEnded: boolean) => void): void {
		this._onCloseCallback = success;
		this._videoExpo.onClose(this._onClose);
	}

	public onError(callback: (errMsg: string, errCode: PQErrorCode) => void): void {
		this._onErrorCallback = callback;
		this._videoExpo.onError(this._onError);
	}

	public offLoad(): void {
		this._onLoadCallback = null;
		this._videoExpo.offLoad(this._onLoad);
	}

	public offClose(): void {
		this._onCloseCallback = null;
		this._videoExpo.offClose(this._onClose);
	}

	public offError(): void {
		this._onErrorCallback = null;
		this._videoExpo.offError(this._onError);
	}

	private _onClose(result: { isEnded: boolean }): void {
		if (!this._onCloseCallback) {
			return;
		}
		if (!result) {
			this._onCloseCallback(true);
		}
		else {
			this._onCloseCallback(result.isEnded);
		}
	}

	private _onError(result: { errCode: PQErrorCode, errMsg: string }): void {
		if (!this._onErrorCallback) {
			return;
		}
		if (!result) {
			this._onErrorCallback('', 0);
		}
		else {
			this._onErrorCallback(result.errMsg, result.errCode);
		}
	}

	private _onLoad(res: { errMsg: string }): void {
		if (!this._onLoadCallback) {
			return;
		}
		if (res.errMsg) {
			this._onLoadCallback({ status: PQStatus.ERROR });
		}
		else {
			this._onLoadCallback({ status: PQStatus.OK });
		}
	}

}
