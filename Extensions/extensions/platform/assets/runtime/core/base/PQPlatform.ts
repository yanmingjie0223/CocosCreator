import {
	IPQPlatform,
	PQGetClipboard,
	PQLifeCycle,
	PQSetClipboard,
	PQShareMessage
} from "../interface/IPQPlatform";

export class PQPlatform implements IPQPlatform {
	public onLifeCycle(lifeCycle: PQLifeCycle): void { }
	public offLifeCycle(lifeCycle: PQLifeCycle): void { }
	public exit(): void { }
	public restart(): void { }
	public firstIntoLogin(): void { }
	public checkVersionUpdate(callback: (hasUpdate: boolean) => void): void { }
	public keepScreenOn(isOn: boolean = true): void { }
	public requestSubscribeMessage(): void { }
	public setPreferredFramesPerSecond(fps: number): void { }
	public setShareMessage(shareMsg: PQShareMessage): void { }
	public getSafeArea(stageWidth: number, stageHeight: number): { top: number, left: number, width: number, height: number } {
		return { top: 0, left: 0, width: stageWidth, height: stageHeight };
	}
	public setClipboardData(clipboard: PQSetClipboard): void { }
	public getClipboardData(clipboard: PQGetClipboard): void { }
}
