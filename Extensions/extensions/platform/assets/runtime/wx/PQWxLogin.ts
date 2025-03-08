import { IPQButtonInfo, IPQLoginSucc, PQLanguageType, PQLogin, pqPlatformSdk, PQUser } from "../core/PQIndex";

export class PQWxLogin extends PQLogin {

	private _userInfoButton: WechatMinigame.UserInfoButton | null = null;

	public constructor() {
		super();
		this.getUserInfo();
	}

	public authorize(
		success: () => void,
		fail: () => void
	): void {
		wx.getSetting({
			'success': (result: WechatMinigame.GetSettingSuccessCallbackResult) => {
			}
		});
	}

	public getUserInfo(
		success?: (user: PQUser) => void,
		fail?: () => void
	): void {
		wx.getUserInfo({
			"withCredentials": true,
			"success": (result: WechatMinigame.GetUserInfoSuccessCallbackResult) => {
				const user = this.createUser(result.userInfo);
				pqPlatformSdk.platformMananger.user = user;
				success && success(user);
			},
			"fail": () => {
				fail && fail();
			}
		});
	}

	public createLoginButton(
		btnInfo: IPQButtonInfo,
		onClick: (user: PQUser | null) => void
	): boolean {
		let btn = this._userInfoButton;
		if (!btn) {
			btn = wx.createUserInfoButton({
				withCredentials: btnInfo.withCredentials,
				type: 'image',
				image: btnInfo.imageUrl,
				style: {
					left: btnInfo.left,
					top: btnInfo.top,
					width: btnInfo.width,
					height: btnInfo.height,
				} as any
			});
			this._userInfoButton = btn;
		}
		btn.onTap((result: WechatMinigame.OnTapCallbackResult) => {
			const userInfo = result.userInfo;
			if (userInfo) {
				this._userInfoButton = null;
				const user = this.createUser(userInfo);
				pqPlatformSdk.platformMananger.user = user;
				onClick && onClick(user);
				btn!.destroy();
			}
			else {
				onClick && onClick(null);
			}
		});
		return true;
	}

	public hideLoginButton(): void {
		if (this._userInfoButton) {
			this._userInfoButton.hide();
		}
	}

	public showLoginButton(): void {
		if (this._userInfoButton) {
			this._userInfoButton.show();
		}
	}

	public login(
		success: (loginSuc: IPQLoginSucc) => void,
		fail: (errorMsg: string) => void
	): void {
		wx.login({
			'success': (result: WechatMinigame.LoginSuccessCallbackResult) => {
				if (!result || !result.code) {
					fail && fail(result.errMsg);
				}
				else {
					success && success({ token: result.code });
				}
			},
			'fail': (result) => {
				if (result) {
					fail && fail(result.errMsg);
				}
				else {
					fail && fail('');
				}
			}
		});
	}

	private createUser(userInfo: WechatMinigame.UserInfo): PQUser {
		const user = new PQUser();
		user.avatarUrl = userInfo.avatarUrl;
		user.city = userInfo.city;
		user.country = userInfo.country;
		user.gender = userInfo.gender;
		user.language = userInfo.language as PQLanguageType;
		user.nickName = userInfo.nickName;
		user.province = userInfo.province;
		return user;
	}

}
