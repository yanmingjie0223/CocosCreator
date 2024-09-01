import { v3, Vec3 } from 'cc';
import Singleton from '../base/Singleton';

export class RandomUtils extends Singleton {
	/**
	 * 获取一个区间的随机数 [min, max)
	 * @param {number} from 最小值
	 * @param {number} end 最大值
	 * @returns {number}
	 */
	public random(from: number, end: number): number {
		const min: number = Math.min(from, end);
		const max: number = Math.max(from, end);
		const range: number = max - min;
		return min + Math.random() * range;
	}

	/**
	 * 获取一个区间的随机数 [min, max)
	 * @param {number} from 最小值
	 * @param {number} end 最大值
	 * @returns {number}
	 */
	public randomInt(from: number, end: number): number {
		return Math.floor(this.random(from, end));
	}

	/**
	 * 获取数组中随机一个单元
	 * @param arr 数组数据源
	 * @param isPutback 是否随机后放回 默认放回
	 */
	public randomArray<T>(arr: Array<T>, isPutback: boolean = true): T | null {
		if (!arr || arr.length === 0) {
			return null;
		}
		const index: number = Math.floor(this.random(0, arr.length));
		if (isPutback) {
			return arr[index];
		} else {
			return arr.splice(index, 1)[0];
		}
	}

	/**
	 * 获取半径为1的球体内的一个随机点
	 * @returns 返回球内随机点
	 */
	public getRandomPointInUnitSphere(): Vec3 {
		let x: number, y: number, z: number, magnitude: number;
		do {
			x = Math.random() * 2 - 1;
			y = Math.random() * 2 - 1;
			z = Math.random() * 2 - 1;
			magnitude = x * x + y * y + z * z;
		} while (magnitude > 1 || magnitude === 0);
		const scale = Math.cbrt(Math.random() * magnitude);
		return v3(x * scale, y * scale, z * scale);
	}
}
