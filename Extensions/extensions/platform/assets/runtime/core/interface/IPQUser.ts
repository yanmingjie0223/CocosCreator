import { PQLanguageType, PQSexType } from "../entity/PQConst";

export interface IPQUser {

	/**
	 * 用户昵称
	 */
	nickName: string;
	/**
	 * 头像地址
	 */
	avatarUrl: string;
	/**
	 * 性别
	 * 0：未知
	 * 1：男
	 * 2：女
	 */
	gender: PQSexType;
	/**
	 * 国家
	 */
	country: string;
	/**
	 * 省份
	 */
	province: string;
	/**
	 * 城市
	 */
	city: string;
	/**
	 * 所在地区使用语言
	 */
	language: PQLanguageType;

}
