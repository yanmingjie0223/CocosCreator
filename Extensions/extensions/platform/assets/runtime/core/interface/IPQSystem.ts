import { PQLanguageType, PQPlatformType } from "../entity/PQConst";

export interface PQSafeArea {
	left: number;
	right: number;
	top: number;
	bottom: number;
	width: number;
	height: number;
}

export interface IPQSystem {
	/**
	 * 操作系统及版本
	 */
	system: string;
	/**
	 * 设备品牌，也可是平台
	 */
	brand: string;
	/**
	 * 设置型号，也可是平台
	 */
	model: string;
	/**
	 * 屏幕宽度
	 */
	screenWidth: number;
	/**
	 * 屏幕高度
	 */
	screenHeight: number;
	/**
	 * 屏幕可使用宽度
	 */
	windowWidth: number;
	/**
	 * 屏幕可使用高度
	 */
	windowHeight: number;
	/**
	 * 平台语言
	 */
	language: PQLanguageType;
	/**
	 * 平台版本号
	 */
	version: string;
	/**
	 * 平台
	 */
	platform: PQPlatformType;
	/**
	 * 安全区域
	 */
	safeArea: PQSafeArea;
}
