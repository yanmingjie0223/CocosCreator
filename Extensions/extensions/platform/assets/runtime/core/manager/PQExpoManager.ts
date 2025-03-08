import { PQExpo } from "../base/PQExpo";
import { PQExpoType, PQStatus } from "../entity/PQConst";
import { PQErrorCode, PQErrorMessage } from "../entity/PQErrorCode";
import { IPQExpoOptions } from "../interface/IPQExpo";

export class PQExpoManager {
	private _expoMap: { [type: number]: typeof PQExpo | null };
	private _videoExpo: PQExpo | null;

	public constructor() {
		this._videoExpo = null;
		this._expoMap = {};
	}

	public showVideo(
		options: IPQExpoOptions,
		onClose: (isEnded: boolean) => void,
		onError: (errMsg: string, errCode: PQErrorCode) => void
	): void {
		const VideoClass = this._expoMap[PQExpoType.VIDEO];
		if (VideoClass) {
			const video = new VideoClass(options);
			this._videoExpo = video;
			video.onClose(onClose);
			video.onLoad((result: { state: string, status: string }) => {
				if (result.status !== PQStatus.ERROR) {
					video.show();
				}
				else {
					const eCode = PQErrorCode.NO_AD;
					onError && onError(PQErrorMessage[eCode], eCode);
				}
			});
		}
	}

	public closeVideo(): void {
		if (this._videoExpo) {
			this._videoExpo.offClose();
			this._videoExpo.offError();
			this._videoExpo.offLoad();
		}
	}

	public register(type: PQExpoType, expoClass: typeof PQExpo): void {
		this._expoMap[type] = expoClass;
	}

	public unregister(type: PQExpoType): void {
		if (this._expoMap[type]) {
			this._expoMap[type] = null;
			delete this._expoMap[type];
		}
	}

}
