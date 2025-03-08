import {
	PQGetClipboard, PQLifeCycle,
	PQPlatform,
	pqPlatformSdk, PQSetClipboard,
	PQSystem
} from "../core/PQIndex";

export class PQWebPlatform extends PQPlatform {

	private _onShowCallback: Function | null;
	private _onHideCallback: Function | null;

	public constructor() {
		super();
		this._onHideCallback = null;
		this._onShowCallback = null;
		this.setSystemInfo();
		if (window) {
			window.addEventListener("focus", () => {
				this._onShow();
			});
			window.addEventListener("blur", () => {
				this._onHide();
			});
		}
	}

	public onLifeCycle(lifeCycle: PQLifeCycle): void {
		if (lifeCycle.onHide) {
			this._onHideCallback = lifeCycle.onHide;
		}
		if (lifeCycle.onShow) {
			this._onShowCallback = lifeCycle.onShow;
		}
	}

	public offLifeCycle(lifeCycle: PQLifeCycle): void {
		if (lifeCycle.onHide) {
			this._onHideCallback = null;
		}
		if (lifeCycle.onShow) {
			this._onShowCallback = null;
		}
	}

	public exit(): void {
		window && window.close();
	}

	public restart(): void {
		if (window && window.location) {
			window.location.reload();
		}
	}

	public checkVersionUpdate(callback: (hasUpdate: boolean) => void): void {
		callback && callback(true);
	}

	public getSafeArea(stageWidth: number, stageHeight: number): { top: number, left: number, width: number, height: number } {
		const pxScale = stageHeight / stageWidth;
		if (pxScale > 2) {
			return { top: 48, left: 0, width: 750, height: 1535 };
		}
		return { top: 0, left: 0, width: stageWidth, height: stageHeight };
	}

	public setClipboardData(clipboard: PQSetClipboard): void {
		// todo: https://github.com/zenorocha/clipboard.js 兼容几乎所有浏览器
		// 目前已微信为主
		const handleCopy = (e: ClipboardEvent) => {
			e.clipboardData && e.clipboardData.setData('text/plain', clipboard.data);
			e.preventDefault();
			document.removeEventListener('copy', handleCopy);
		};
		document.addEventListener('copy', handleCopy);
		document.execCommand('copy');
		clipboard.success && clipboard.success();
	}

	public getClipboardData(clipboard: PQGetClipboard): void {
		clipboard.success && clipboard.success({ data: '' });
	}

	private _onShow(): void {
		if (this._onShowCallback) {
			this._onShowCallback();
		}
	}

	private _onHide(): void {
		this._onHideCallback && this._onHideCallback();
	}

	private setSystemInfo(): void {
		const system = new PQSystem();
		system.benchmarkLevel = 50;
		pqPlatformSdk.platformMananger.system = system;
	}

}
