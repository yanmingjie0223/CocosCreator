import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:22:49
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-03-01 15:51:46
 */
export default class MathUtils extends Singleton {

	/**
	 * 弧度制转换为角度值
	 * @param {number} radian
	 * @returns {number}
	 */
	public getAngle(radian: number): number {
		return (180 * radian) / Math.PI;
	}

	/**
	 * 角度值转换为弧度制
	 * @param {number} angle
	 */
	public getRadian(angle: number): number {
		return (angle / 180) * Math.PI;
	}

	/**
	 * 获取两点间弧度
	 * @param {cc.Vec2} p1
	 * @param {cc.Vec2} p2
	 * @returns {number}
	 */
	public getRadianTwoPoint(p1: cc.Vec2, p2: cc.Vec2): number {
		const xdis: number = p2.x - p1.x;
		const ydis: number = p2.y - p1.y;
		return Math.atan2(ydis, xdis);
	}

	/**
	 * 获取两点间旋转角度（顺时针）
	 * @param {cc.Vec2} p1
	 * @param {cc.Vec2} p2
	 * @returns {number}
	 */
	public getAngleTwoPoint(p1: cc.Vec2, p2: cc.Vec2): number {
		const vy: number = p2.y - p1.y;
		const vx: number = p2.x - p1.x;
		let ang: number = 0;

		if (vy == 0) {
			if (vx < 0) {
				return 180;
			}
			return 0;
		}

		if (vx == 0) {
			//正切是vy/vx所以vx==0排除
			if (vy > 0) {
				ang = 90;
			} else if (vy < 0) {
				ang = 270;
			}
			return ang;
		}

		ang = this.getAngle(Math.atan(Math.abs(vy) / Math.abs(vx)));
		if (vx > 0) {
			if (vy < 0) {
				ang = 360 - ang;
			}
		} else {
			if (vy > 0) {
				ang = 180 - ang;
			} else {
				ang = 180 + ang;
			}
		}
		return ang;
	}

	/**
	 * 排斥实验，对角线行成的矩形相交判断
	 * @param p1
	 * @param p2
	 * @param q1
	 * @param q2
	 */
	public isRectCross(
		p1: cc.Vec2,
		p2: cc.Vec2,
		q1: cc.Vec2,
		q2: cc.Vec2
	): boolean {
		const ret: boolean =
			Math.min(p1.x, p2.x) <= Math.max(q1.x, q2.x) &&
			Math.min(q1.x, q2.x) <= Math.max(p1.x, p2.x) &&
			Math.min(p1.y, p2.y) <= Math.max(q1.y, q2.y) &&
			Math.min(q1.y, q2.y) <= Math.max(p1.y, p2.y);
		return ret;
	}

	/**
	 * 跨立判断
	 * @param p1
	 * @param p2
	 * @param q1
	 * @param q2
	 */
	public isLineSegmentCross(
		p1: cc.Vec2,
		p2: cc.Vec2,
		q1: cc.Vec2,
		q2: cc.Vec2
	): boolean {
		if (
			((q1.x - p1.x) * (q1.y - q2.y) - (q1.y - p1.y) * (q1.x - q2.x)) *
				((q1.x - p2.x) * (q1.y - q2.y) -
					(q1.y - p2.y) * (q1.x - q2.x)) <
				0 ||
			((p1.x - q1.x) * (p1.y - p2.y) - (p1.y - q1.y) * (p1.x - p2.x)) *
				((p1.x - q2.x) * (p1.y - p2.y) -
					(p1.y - q2.y) * (p1.x - p2.x)) <
				0
		) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 获取交点
	 * @param p1
	 * @param p2
	 * @param q1
	 * @param q2
	 * @param x
	 * @param y
	 */
	public getCrossPoint(
		p1: cc.Vec2,
		p2: cc.Vec2,
		q1: cc.Vec2,
		q2: cc.Vec2
	): cc.Vec2 | null {
		if (
			this.isRectCross(p1, p2, q1, q2) &&
			this.isLineSegmentCross(p1, p2, q1, q2)
		) {
			//求交点
			const vec = new cc.Vec2();
			let tmpLeft: number, tmpRight: number;
			tmpLeft = (q2.x - q1.x) * (p1.y - p2.y) - (p2.x - p1.x) * (q1.y - q2.y);
			tmpRight =
				(p1.y - q1.y) * (p2.x - p1.x) * (q2.x - q1.x) +
				q1.x * (q2.y - q1.y) * (p2.x - p1.x) -
				p1.x * (p2.y - p1.y) * (q2.x - q1.x);

			vec.x = tmpRight / tmpLeft;

			tmpLeft = (p1.x - p2.x) * (q2.y - q1.y) - (p2.y - p1.y) * (q1.x - q2.x);
			tmpRight =
				p2.y * (p1.x - p2.x) * (q2.y - q1.y) +
				(q2.x - p2.x) * (q2.y - q1.y) * (p1.y - p2.y) -
                q2.y * (q1.x - q2.x) * (p2.y - p1.y);

            vec.y = tmpRight / tmpLeft;

			return vec;
		}
		return null;
	}

	/**
	 * 获取两点间距离
	 * @param {cc.Vec2} p1
	 * @param {cc.Vec2} p2
	 * @returns {number}
	 */
	public getDistance(p1: cc.Vec2, p2: cc.Vec2): number {
		const disX: number = p2.x - p1.x;
		const disY: number = p2.y - p1.y;
		const disQ: number = Math.pow(disX, 2) + Math.pow(disY, 2);
		return Math.sqrt(disQ);
	}

	/**
	 * 精确到小数点后多少位（舍尾）
	 * @param {number} exactValue 精确值
	 * @param {number} count 精确位数
	 * @return {number}
	 * */
	public exactCount(exactValue: number, count: number = 0): number {
		const num: number = Math.pow(10, count);
		const value: number = (exactValue * num) | 0;
		return value / num;
	}

	/**
	 * [0-1]区间获取二次贝塞尔曲线点切线角度
	 * @param {cc.Vec2} p0 起点
	 * @param {cc.Vec2} p1 控制点
	 * @param {cc.Vec2} p2 终点
	 * @param {number} t [0-1]区间
	 * @return {number}
	 * */
	public getBezierCutAngle(
		p0: cc.Vec2,
		p1: cc.Vec2,
		p2: cc.Vec2,
		t: number
	): number {
		const _x: number = 2 * (p0.x * (t - 1) + p1.x * (1 - 2 * t) + p2.x * t);
		const _y: number = 2 * (p0.y * (t - 1) + p1.y * (1 - 2 * t) + p2.y * t);
		const angle: number = this.getAngle(Math.atan2(_y, _x));
		return angle;
	}

	/**
	 * [0-1]区间获取二次贝塞尔曲线上某点坐标
	 * @param {cc.Vec2} p0 起点
	 * @param {cc.Vec2} p1 控制点
	 * @param {cc.Vec2} p2 终点
	 * @param {number} t [0-1]区间
	 * @param {cc.Vec2} 缓存的点对象，如不存在则生成新的点对象
	 * @return {cc.Vec2}
	 * */
	public getBezierPoint(
		p0: cc.Vec2,
		p1: cc.Vec2,
		p2: cc.Vec2,
		t: number,
		point: cc.Vec2 | null = null
	): cc.Vec2 {
		if (!point) {
			point = new cc.Vec2();
		}
		point.x =
			(1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
		point.y =
			(1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;
		return point;
	}

	/**
	 * [0-1]区间获取三次贝塞尔曲线上某点坐标
	 * @param {cc.Vec2} p0 起点
	 * @param {cc.Vec2} p1 控制点
	 * @param {cc.Vec2} p2 控制点
	 * @param {cc.Vec2} p3 终点
	 * @param {number} t [0-1]区间
	 * @param {cc.Vec2} 缓存的点对象，如不存在则生成新的点对象
	 * @return {cc.Vec2}
	 * */
	public getBezier3Point(
		p0: cc.Vec2,
		p1: cc.Vec2,
		p2: cc.Vec2,
		p3: cc.Vec2,
		t: number,
		point: cc.Vec2 | null = null
	): cc.Vec2 {
		if (!point) {
			point = new cc.Vec2();
		}
		const cx: number = 3 * (p1.x - p0.x);
		const bx: number = 3 * (p2.x - p1.x) - cx;
		const ax: number = p3.x - p0.x - cx - bx;
		const cy: number = 3 * (p1.y - p0.y);
		const by: number = 3 * (p2.y - p1.y) - cy;
		const ay: number = p3.y - p0.y - cy - by;
		point.x = ax * t * t * t + bx * t * t + cx * t + p0.x;
		point.y = ay * t * t * t + by * t * t + cy * t + p0.y;
		return point;
	}

	/**
	 * [0-1]区间获取三次贝塞尔曲线点切线角度
	 * @param {cc.Vec2} p0 起点
	 * @param {cc.Vec2} p1 控制点
	 * @param {cc.Vec2} p2 控制点
	 * @param {cc.Vec2} p3 终点
	 * @param {number} t [0-1]区间
	 * @return {number}
	 * */
	public getBezier3CutAngle(
		p0: cc.Vec2,
		p1: cc.Vec2,
		p2: cc.Vec2,
		p3: cc.Vec2,
		t: number
	): number {
		const _x: number =
			p0.x * 3 * (1 - t) * (1 - t) * -1 +
			3 * p1.x * ((1 - t) * (1 - t) + t * 2 * (1 - t) * -1) +
			3 * p2.x * (2 * t * (1 - t) + t * t * -1) +
			p3.x * 3 * t * t;
		const _y: number =
			p0.y * 3 * (1 - t) * (1 - t) * -1 +
			3 * p1.y * ((1 - t) * (1 - t) + t * 2 * (1 - t) * -1) +
			3 * p2.y * (2 * t * (1 - t) + t * t * -1) +
			p3.y * 3 * t * t;
		const angle: number = this.getAngle(Math.atan2(_y, _x));
		return angle;
	}
}
