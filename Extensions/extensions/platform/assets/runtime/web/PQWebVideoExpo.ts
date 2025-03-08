import { PQErrorCode, PQExpo, PQStatus } from "../core/PQIndex";

export interface PQVideoExpoOptions {
	adUnitId: string;
	multiton?: boolean;
}

export class PQWebVideoExpo extends PQExpo {

	private _onCloseCallback: Function | null;
	private _onLoadCallback: Function | null;
	private _onErrorCallback: Function | null;

	public constructor(options: PQVideoExpoOptions) {
		super(options);
		this._onLoadCallback = null;
		this._onCloseCallback = null;
		this._onErrorCallback = null;
	}

	public load(): void {
		// todo: web 对应处理
	}

	public show(): void {
		// todo: web 对应处理
	}

	public onLoad(success: (res: { state: string, status: string }) => void): void {
		this._onLoadCallback = success;
		this._onLoad({ errMsg: '' });
	}

	public onClose(success: (isEnded: boolean) => void): void {
		this._onCloseCallback = success;
		this._onClose({ isEnded: true });
	}

	public onError(callback: (errMsg: string, errCode: PQErrorCode) => void): void {
		this._onErrorCallback = callback;
		this._onError(null!);
	}

	public offLoad(): void {
		this._onLoadCallback = null;
	}

	public offClose(): void {
		this._onCloseCallback = null;
	}

	public offError(): void {
		this._onErrorCallback = null;
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
