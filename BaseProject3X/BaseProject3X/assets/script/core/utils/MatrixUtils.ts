import { Mat4 } from 'cc';
import { DEBUG } from 'cc/env';

export class MatrixUtils {
	private static _mat4Pool: Mat4[] = [];

	/**
	 * 获取一个矩阵
	 * @returns
	 */
	public static allocMat4(): Mat4 {
		let mat4 = this._mat4Pool.pop();
		if (!mat4) {
			mat4 = new Mat4();
		}
		return mat4;
	}

	/**
	 * 回收一个矩阵
	 * @param mat4
	 */
	public static freeMat4(mat4: Mat4): void {
		if (DEBUG) {
			const index = this._mat4Pool.indexOf(mat4);
			if (index !== -1) {
				console.error('该mat4二次回收, 严重错误!');
			}
		}
		if (mat4) {
			mat4.set();
			this._mat4Pool.push(mat4);
		}
	}

	/**
	 * 清理
	 */
	public static clear(): void {
		this._mat4Pool.length = 0;
	}
}
