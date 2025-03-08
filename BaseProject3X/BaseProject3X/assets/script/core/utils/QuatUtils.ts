import { Quat } from 'cc';
import { DEBUG } from 'cc/env';

export class QuatUtils {
	private static _quatPool: Quat[] = [];

	/**
	 * 获取一个矩阵
	 * @returns
	 */
	public static allocQuat(): Quat {
		let quat = this._quatPool.pop();
		if (!quat) {
			quat = new Quat();
		}
		return quat;
	}

	/**
	 * 回收一个矩阵
	 * @param quat
	 */
	public static freeQuat(quat: Quat): void {
		if (DEBUG) {
			const index = this._quatPool.indexOf(quat);
			if (index !== -1) {
				console.error('该quat二次回收, 严重错误!');
			}
		}
		if (quat) {
			quat.set();
			this._quatPool.push(quat);
		}
	}

	/**
	 * 清理
	 */
	public static clear(): void {
		this._quatPool.length = 0;
	}
}
