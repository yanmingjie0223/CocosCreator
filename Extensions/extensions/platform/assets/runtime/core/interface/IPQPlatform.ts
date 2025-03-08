export interface PQOnShowResult {
	/**参数：可以是通过链接进入的参数 */
	query: Record<string, any>;
}

export interface PQLifeCycle {
	onShow?: (result: PQOnShowResult) => void;
	onHide?: () => void;
}

export interface PQShareMessage {
	/** 转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。显示图片长宽比是 5:4 */
	imageUrl: string
	/** 查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 wx.getLaunchOptionsSync() 或 wx.onShow() 获取启动参数中的 query。 */
	query: string
	/** 转发标题，不传则默认使用当前小游戏的昵称。 */
	title: string
}

/**
 * 剪切板
 */
export interface PQSetClipboard {
	data: string;
	success?: () => void;
	fail?: () => void;
}

export interface PQGetClipboard {
	success: (result: { data: string }) => void;
}

export interface IPQPlatform {

	/**
	 * 注册生命周期
	 * @param lifeCycle
	 */
	onLifeCycle(lifeCycle: PQLifeCycle): void;
	/**
	 * 取消生命周期
	 * @param lifeCycle
	 */
	offLifeCycle(lifeCycle: PQLifeCycle): void;
	/**
	 * 退出游戏
	 */
	exit(): void;
	/**
	 * 重启游戏
	 */
	restart(): void;
	/**
	 * 第一次进入登录界面，等待进入游戏
	 */
	firstIntoLogin(): void;
	/**
	 * 检查是否有新版本
	 * @param callback
	 */
	checkVersionUpdate(callback: (hasUpdate: boolean) => void): void;
	/**
	 * 保持常亮
	 */
	keepScreenOn(isOn: boolean): void;
	/**
	 * 订阅数据
	 */
	requestSubscribeMessage(): void;
	/**
	 * 设置每秒帧率
	 * @param fps
	 */
	setPreferredFramesPerSecond(fps: number): void;
	/**
	 * 设置分享信息
	 */
	setShareMessage(shareMsg: PQShareMessage): void;
	/**
	 * 获取平台显示安全区域
	 * @param stageWidth 舞台宽
	 * @param stageHeight 舞台高
	 */
	getSafeArea(stageWidth: number, stageHeight: number): { top: number, left: number, width: number, height: number };
	/**
	 * 复制数据到剪切板
	 * @param clipboard
	 */
	setClipboardData(clipboard: PQSetClipboard): void;
	/**
	 * 获取剪切板内容
	 * @param clipboard
	 */
	getClipboardData(clipboard: PQGetClipboard): void;

}
