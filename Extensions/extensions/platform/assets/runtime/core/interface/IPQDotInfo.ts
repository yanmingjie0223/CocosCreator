import { IPQDotUser } from './IPQDotUser';

export interface IPQDotInfo {

	/**
	 * 发送角色状态
	 */
	sendUserInfo(info: IPQDotUser): void;
	/**
	 * 心跳user信息
	 */
	heartSendUserInfo(
		info: IPQDotUser,
		success: () => void,
		fail: () => void
	): void;

}
