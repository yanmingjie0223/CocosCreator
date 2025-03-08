import {
	PQGetClipboard,
	PQLanguageType,
	PQLifeCycle,
	PQPlatform,
	pqPlatformSdk,
	PQPlatformType,
	PQSetClipboard,
	PQShareMessage,
	PQSystem
} from "../core/PQIndex";

export class PQWxPlatform extends PQPlatform {

	private _onShowCallback: Function | null;
	private _onHideCallback: Function | null;

	public constructor() {
		super();
		this._onHideCallback = null;
		this._onShowCallback = null;
		this.setSystemInfo();
		wx.onShow(this._onShow.bind(this));
		wx.onHide(this._onHide.bind(this));
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
		wx.exitMiniProgram();
	}

	public keepScreenOn(isOn: boolean = true): void {
		wx.setKeepScreenOn({
			keepScreenOn: isOn
		});
	}

	public setPreferredFramesPerSecond(fps: number): void {
		wx.setPreferredFramesPerSecond(fps);
	}

	public setShareMessage(shareMsg: PQShareMessage): void {
		wx.showShareMenu({
			withShareTicket: true,
		});
		wx.onShareAppMessage(() => {
			return shareMsg;
		});
	}

	public getSafeArea(stageWidth: number, stageHeight: number): { top: number, left: number, width: number, height: number } {
		const system = pqPlatformSdk.platformMananger.system;
		if (system && system.safeArea) {
			const safeArea = system.safeArea;
			const pwidth = system.screenWidth;
			const pheight = system.screenHeight;
			const stop = safeArea.top >= 20 ? safeArea.top - 20 : safeArea.top;
			const swidth = safeArea.width;
			const sleft = safeArea.left;
			let sdheight = pheight - safeArea.top - safeArea.height;
			sdheight = sdheight > 20 ? 20 : sdheight;
			const sheight = pheight - stop - sdheight;

			const left = Math.floor(sleft / pheight * stageWidth);
			const width = Math.floor(swidth / pwidth * stageWidth);
			const top = Math.floor(stop / pheight * stageHeight);
			const height = Math.floor(sheight / pheight * stageHeight);

			return { top, left, width, height };
		}
		else {
			return { top: 0, left: 0, width: stageWidth, height: stageHeight };
		}
	}

	public setClipboardData(clipboard: PQSetClipboard): void {
		wx.setClipboardData(clipboard);
	}

	public getClipboardData(clipboard: PQGetClipboard): void {
		wx.getClipboardData(clipboard);
	}

	private _onShow(result: WechatMinigame.OnShowCallbackResult): void {
		this._onShowCallback && this._onShowCallback(result);
	}

	private _onHide(): void {
		this._onHideCallback && this._onHideCallback();
	}

	private setSystemInfo(): void {
		try {
			const result = wx.getSystemInfoSync();
			const system = new PQSystem();
			system.brand = result.brand;
			system.language = result.language as PQLanguageType;
			system.model = result.model;
			system.platform = result.platform === 'devtools' ? PQPlatformType.PT_DEVTOOLS : PQPlatformType.PT_WX;
			system.screenHeight = result.screenHeight;
			system.screenWidth = result.screenWidth;
			system.system = result.system;
			system.version = result.version;
			system.windowHeight = result.windowHeight;
			system.windowWidth = result.windowWidth;
			system.safeArea = result.safeArea;
			system.benchmarkLevel = result.benchmarkLevel;
			pqPlatformSdk.platformMananger.system = system;
			console.log('systemInfo => ', result);
		} catch (e) {
			// 不做处理，平台控制器系统信息为null
		}
	}

}
