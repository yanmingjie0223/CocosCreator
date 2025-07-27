import { sys } from 'cc';
import Singleton from '../base/Singleton';

export const enum StorageKey {
	/**登录角色名 */
	USER_ACCOUNT = 'user_account',
	/**登录角色名 */
	USER_ROOM = 'user_room',
	/**历史登录服务器 */
	HISTORY_SERVERS = 'history_servers',
}

export default class StorageManager extends Singleton {

	public setItem(key: StorageKey, value: any): void {
		sys.localStorage.setItem(key, `${value}`);
	}

	public getItem(key: StorageKey): string {
		let str = sys.localStorage.getItem(key);
		if (!str) {
			str = "";
		}
		return str;
	}

}
