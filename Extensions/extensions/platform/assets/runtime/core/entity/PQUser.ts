import { IPQUser } from "../interface/IPQUser";
import { PQLanguageType, PQSexType } from "./PQConst";

export class PQUser implements IPQUser {
	public nickName: string;
	public avatarUrl: string;
	public gender: PQSexType;
	public country: string;
	public province: string;
	public city: string;
	public language: PQLanguageType;

	public constructor() {
		this.nickName = '';
		this.avatarUrl = '';
		this.gender = PQSexType.UNKNOWN;
		this.country = '';
		this.province = '';
		this.city = '';
		this.language = PQLanguageType.UNKNOWN;
	}

}
