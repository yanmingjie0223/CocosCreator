import { IPQDotUser } from '../core/interface/IPQDotUser';
import { PQDotInfo } from "../core/PQIndex";

export class PQWxDotInfo extends PQDotInfo {

	public sendUserInfo(info: IPQDotUser): void {

	}

	public heartSendUserInfo(
		info: IPQDotUser,
		success: () => void,
		fail: () => void
	): void {

	}

}
