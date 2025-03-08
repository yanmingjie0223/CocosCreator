import { PQLoginStatus } from "../entity/PQConst";
import { PQUser } from "../entity/PQUser";
import { IPQButtonInfo, IPQLogin, IPQLoginSucc } from "../interface/IPQLogin";

export class PQLogin implements IPQLogin {
	private _status: number = 1 << PQLoginStatus.DEFAULT;

	public createLoginButton(
		btnInfo: IPQButtonInfo,
		onClick: (user: PQUser | null) => void
	): boolean {
		return false;
	}

	public hideLoginButton(): void { }

	public showLoginButton(): void { }

	public authorize(
		success: () => void,
		fail: () => void
	): void { }

	public login(
		success: (loginSuc: IPQLoginSucc) => void,
		fail: (errorMsg: string) => void
	): void { }

	public getUserInfo(
		success?: (user: PQUser) => void,
		fail?: () => void
	): void { }

	public addStatus(status: PQLoginStatus): void {
		this._status |= 1 << status;
	}
	public removeStatus(status: PQLoginStatus): void {
		this._status &= ~(1 << status);
	}
	public isStatus(status: PQLoginStatus): boolean {
		const code = this._status & (1 << status);
		return code !== 0;
	}
}
