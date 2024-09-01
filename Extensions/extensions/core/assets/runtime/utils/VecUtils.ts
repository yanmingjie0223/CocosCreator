import { Vec3, Vec4, Vec2 } from 'cc';
import { DEBUG } from 'cc/env';

export class VecUtils {
	private static _vec2Pool: Vec2[] = [];
	private static _vec3Pool: Vec3[] = [];
	private static _vec4Pool: Vec4[] = [];

	/**
	 * 获取一个vec2
	 * @returns
	 */
	public static allocVec2(x: number = 0, y: number = 0): Vec2 {
		let vec = this._vec2Pool.pop();
		if (!vec) {
			vec = new Vec2();
		}
		vec.set(x, y);
		return vec;
	}

	/**
	 * 回收一个vec2
	 * @param vec
	 */
	public static freeVec2(vec: Vec2): void {
		if (DEBUG) {
			const index = this._vec2Pool.indexOf(vec);
			if (index !== -1) {
				console.error('该vec二次回收, 严重错误!');
			}
		}
		if (vec) {
			this._vec2Pool.push(vec);
		}
	}

	/**
	 * 获取一个vec3
	 * @returns
	 */
	public static allocVec3(x: number = 0, y: number = 0, z: number = 0): Vec3 {
		let vec = this._vec3Pool.pop();
		if (!vec) {
			vec = new Vec3();
		}
		vec.set(x, y, z);
		return vec;
	}

	/**
	 * 回收一个vec3
	 * @param vec
	 */
	public static freeVec3(vec: Vec3): void {
		if (DEBUG) {
			const index = this._vec3Pool.indexOf(vec);
			if (index !== -1) {
				console.error('该vec二次回收, 严重错误!');
			}
		}
		if (vec) {
			this._vec3Pool.push(vec);
		}
	}

	/**
	 * 获取一个vec3
	 * @returns
	 */
	public static allocVec4(x: number = 0, y: number = 0, z: number = 0, w: number = 0): Vec4 {
		let vec = this._vec4Pool.pop();
		if (!vec) {
			vec = new Vec4();
		}
		vec.set(x, y, z);
		return vec;
	}

	/**
	 * 回收一个vec3
	 * @param vec
	 */
	public static freeVec4(vec: Vec4): void {
		if (DEBUG) {
			const index = this._vec4Pool.indexOf(vec);
			if (index !== -1) {
				console.error('该vec二次回收, 严重错误!');
			}
		}
		if (vec) {
			this._vec4Pool.push(vec);
		}
	}

	/**
	 * 清理
	 */
	public static clear(): void {
		this._vec2Pool.length = 0;
		this._vec3Pool.length = 0;
		this._vec4Pool.length = 0;
	}
}
