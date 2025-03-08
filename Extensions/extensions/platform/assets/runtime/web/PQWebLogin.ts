import { IPQButtonInfo, IPQLoginSucc, PQLogin, PQUser } from "../core/PQIndex";

export class PQWebLogin extends PQLogin {

	public authorize(
		success: () => void,
		fail: () => void
	): void {
		success && success();
	}

	public getUserInfo(
		success?: (user: PQUser) => void,
		fail?: () => void
	): void {
		const user = new PQUser();
		success && success(user);
	}

	public createLoginButton(
		btnInfo: IPQButtonInfo,
		onClick: (user: PQUser | null) => void
	): boolean {
		const user = new PQUser();
		onClick && onClick(user);
		return true;
	}

	public login(
		success: (loginSuc: IPQLoginSucc) => void,
		fail: (errorMsg: string) => void
	): void {
		success && success({ token: '' });
	}

}
