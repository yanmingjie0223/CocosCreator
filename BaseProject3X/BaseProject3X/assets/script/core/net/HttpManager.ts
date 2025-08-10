import { sys } from 'cc';
import Singleton from '../base/Singleton';
import DebugUtils from '../utils/DebugUtils';
import { HttpEvent, HttpRequest, HttpType, ResponseType } from './HttpRequest';

export interface HttpData {
	/**请求地址 */
	url: string;
	/**请求方式 默认: 'GET' */
	method?: HttpType;
	/**请求类型 默认: json */
	responseType?: ResponseType;
	/**post上传数据 默认: null|{} */
	data?: { [key: string]: any };
	/**请求头 默认: null */
	headers?: string[];
}

export default class HttpManager extends Singleton {

	private _https: Array<HttpRequest> = [];

	/**
	 * 请求数据
	 * @param httpData
	 * @param onComplete
	 * @param onError
	 * @param thisObj
	 * @returns 返回http勿随意使用，因为该http会自动回收
	 */
	public send(httpData: HttpData, onComplete: Function, onError: Function, thisObj: any): HttpRequest {
		const method = httpData.method ? httpData.method : HttpType.GET;
		const debug = DebugUtils.getInstance<DebugUtils>();
		debug.log(
			`%c ↑↑↑ [${method}]${httpData.url} ↑↑↑ `,
			'padding: 2px; background-color: #1094e3; color: #dddd22; border: 2px solid #dddd22; font-family: consolas;',
			httpData.data
		);
		const http = this.obtain();
		http.on(HttpEvent.COMPLETE, (res: any) => {
			debug.log(
				`%c ↓↓↓ [${method}]${httpData.url} ↓↓↓ `,
				'padding: 2px; background-color: #333; color: #22dd22; border: 2px solid #22dd22; font-family: consolas;',
				res
			);
			this.free(http);
			onComplete && onComplete.apply(thisObj, [res]);
		}, this);
		http.on(HttpEvent.ERROR, () => {
			this.free(http);
			onError && onError.apply(thisObj);
		}, this);

		const url = httpData.url;
		const data = httpData.data ? httpData.data : null;
		const responseType = httpData.responseType ? httpData.responseType : ResponseType.JSON;
		const headers = httpData.headers ? httpData.headers : null;
		http.send(url, data, method, responseType, headers);

		return http;
	}

	/**
	 * 获取协议请求对象
	 * @returns
	 */
	private obtain(): HttpRequest {
		let http: HttpRequest | undefined = this._https.pop();
		if (!http) {
			http = new HttpRequest();
		}

		return http;
	}

	/**
	 * 回收协议请求对象
	 * @param http
	 * @returns
	 */
	private free(http: HttpRequest): void {
		if (!http) {
			return;
		}

		http.removeAll(http);
		if (
			sys.platform === sys.Platform.VIVO_MINI_GAME ||
			sys.platform === sys.Platform.HUAWEI_QUICK_GAME
		) {
			// 注：这些平台复用会存在xmlhttprequest的bug，所以不回收
			return;
		}

		this._https.push(http);
	}

}
