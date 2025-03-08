import { PQLoginStatus } from "../entity/PQConst";
import { PQUser } from "../entity/PQUser";

/**
 * 按钮，这里全部使用纹理废弃文本使用
 */
export interface IPQButtonInfo {
	/**按钮纹理 */
	imageUrl: string;
	/**左边距离（单位根据平台） */
	left: number;
	/**顶部距离（单位根据平台） */
	top: number;
	/**宽度 */
	width: number;
	/**高度 */
	height: number;
	/**是否绝对的信任 */
	withCredentials?: boolean;
}

export interface IPQLoginSucc {
	/**code请求码，用来 */
	token: string;
}

/**
 * 登陆类，做登陆相关的操作
 * authorize -> login -> createLoginButton
 */
export interface IPQLogin {

	/**
	 * 创建生成登陆按钮
	 * @param btnInfo 按钮纹理
	 */
	createLoginButton(btnInfo: IPQButtonInfo, onClick: Function, thisObj: any): boolean;
	/**
	 * 隐藏登录授权按钮
	 */
	hideLoginButton(): void;
	/**
	 * 显示登录授权按钮
	 */
	showLoginButton(): void;
	/**
	 * 授权平台
	 */
	authorize(
		success: () => void,
		fail: () => void
	): void;
	/**
	 * 登陆平台
	 * @param success
	 * @param fail
	 */
	login(
		success: (loginSuc: IPQLoginSucc) => void,
		fail: (errorMsg: string) => void
	): void;
	/**
	 * 获取角色信息，当获取到角色信息后就不用再按钮授权进入游戏了
	 * @param success
	 * @param fail
	 */
	getUserInfo(
		success?: (user: PQUser) => void,
		fail?: () => void
	): void;
	/**
	 * 添加状态，位状态
	 * @param status
	 */
	addStatus(status: PQLoginStatus): void;
	/**
	 * 移除状态
	 * @param status
	 */
	removeStatus(status: PQLoginStatus): void;
	/**
	 * 判断状态
	 * @param status
	 */
	isStatus(status: PQLoginStatus): boolean;

}
