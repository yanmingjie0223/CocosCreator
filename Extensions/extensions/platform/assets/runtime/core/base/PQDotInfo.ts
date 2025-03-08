import { IPQDotInfo } from '../interface/IPQDotInfo';
import { IPQDotUser } from '../interface/IPQDotUser';

export class PQDotInfo implements IPQDotInfo {
	public constructor() { }
	public sendUserInfo(info: IPQDotUser): void { }
	public heartSendUserInfo(
		info: IPQDotUser,
		success: () => void,
		fail: () => void
	): void { }
}
