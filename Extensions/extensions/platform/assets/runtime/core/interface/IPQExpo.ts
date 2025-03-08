import { PQErrorCode } from "../entity/PQErrorCode";

/**
 * 展览接口：视频展览/bar展览等
 * 注：广告单词使用在一些浏览器中会被广告拦截插件给拦截
 * 事件监听放在内部解决
 */
export interface IPQExpo {

	/**
	 * 加载广告
	 */
	load(): void;
	/**
	 * 等待加载完成后显示广告
	 */
	show(): void;
	/**
	 * 隐藏广告
	 */
	hide(): void;
	/**
	 * 广告关闭
	 * @param success 如果是视频广告是否已看完
	 */
	onClose(
		success: (isEnded: boolean) => void
	): void;
	/**
	 * 异常错误监听
	 * @param callback
	 */
	onError(
		callback: (errMsg: string, errCode: PQErrorCode) => void
	): void;
	/**
	 * 加载回调监听
	 * @param success
	 */
	onLoad(
		success: (res: { state: string, status: string }) => void
	): void;
	/**
	 * 取消加载回调监听
	 * @param success
	 */
	offLoad(): void;
	/**
	 * 取消关闭事件监听
	 * @param success
	 */
	offClose(): void;
	/**
	 * 取消错误事件监听
	 * @param callback
	 */
	offError(): void;
	/**
	 * 销毁
	 */
	destroy(): void;

}

/**
 * 广告设置，可选内容
 */
export interface IPQExpoOptions {
	adUnitId: string;
}
