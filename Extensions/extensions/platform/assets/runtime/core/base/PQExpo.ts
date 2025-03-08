import { PQErrorCode } from "../entity/PQErrorCode";
import { IPQExpo, IPQExpoOptions } from "../interface/IPQExpo";

export class PQExpo implements IPQExpo {
	public constructor(options: IPQExpoOptions) { }
	public load(): void { }
	public show(): void { }
	public hide(): void { }
	public onClose(success: (isEnded: boolean) => void): void { }
	public onError(callback: (errMsg: string, errCode: PQErrorCode) => void): void { }
	public onLoad(success: (res: { state: string, status: string }) => void): void { }
	public offLoad(): void { }
	public offClose(): void { }
	public offError(): void { }
	public destroy(): void { }
}
