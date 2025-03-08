/**
 * 展览广告类型
 */
export const enum PQExpoType {
	VIDEO = 0,
	BANNER
}

/**
 * 错误正确状态
 */
export const enum PQStatus {
	ERROR = 'error',
	OK = 'ok'
}

/**
 * 登陆状态
 */
export const enum PQLoginStatus {
	/**默认状态 */
	DEFAULT = 0,
	/**授权状态 */
	AUTHORIZE = 1,
	/**登陆状态 */
	LOGIN = 2
}

/**
 * 平台类型
 */
export enum PQPlatformType {
	PT_UNKNOWN = 0,
	PT_WX,
	PT_QQ,
	PT_IOS,
	PT_ANDROID,
	PT_WEB,
	PT_DEVTOOLS,
	PT_MOSNOW,
	PT_MOSNOW_WEB
}

/**
 * 语言类型
 */
export const enum PQLanguageType {
	/**未知 */
	UNKNOWN = '',
	/**简体中文 */
	ZH_CN = 'zh_CN',
	/**繁体中文 */
	ZH_TW = 'zh_TW',
	/**英文 */
	EN = 'en',
}

/**
 * 性别类型
 */
export const enum PQSexType {
	/**未知 */
	UNKNOWN = 0,
	/**男 */
	BOY,
	/**女 */
	GIRL
}
