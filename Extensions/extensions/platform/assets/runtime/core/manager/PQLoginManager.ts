import { PQLogin } from "../base/PQLogin";

export class PQLoginManager {
	private _login: PQLogin | null;

	public constructor() {
		this._login = null;
	}

	public set login(login: PQLogin | null) {
		this._login = login;
	}

	public get login(): PQLogin | null {
		return this._login;
	}

}
