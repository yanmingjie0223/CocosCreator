import { Mat4, Quat, Vec2, Vec3 } from 'cc';
import Singleton from '../base/Singleton';
import { MatrixUtils } from './MatrixUtils';
import { VecUtils } from './VecUtils';

export default class MathUtils extends Singleton {
	public static RADIAN_TO_ANGLE_FACTOR: number = 57.29577951308232;
	public static ANGLE_TO_RADIAN_FACTOR: number = 0.017453292519943295;

	/**
	 * 弧度制转换为角度值
	 * @param {number} radian
	 * @returns {number}
	 */
	public getAngle(radian: number): number {
		return radian * MathUtils.RADIAN_TO_ANGLE_FACTOR;
	}

	/**
	 * 角度值转换为弧度制
	 * @param {number} angle
	 */
	public getRadian(angle: number): number {
		return angle * MathUtils.ANGLE_TO_RADIAN_FACTOR;
	}

	/**
	 * 获取两点间弧度
	 * @param {Vec2} p1
	 * @param {Vec2} p2
	 * @returns {number}
	 */
	public getRadianTwoPoint(p1: Vec2, p2: Vec2): number {
		const xdis: number = p2.x - p1.x;
		const ydis: number = p2.y - p1.y;
		return Math.atan2(ydis, xdis);
	}

	/**
	 * 获取两点的中点
	 * @param p1
	 * @param p2
	 * @param out
	 * @returns
	 */
	public getCentrePoint(p1: Vec2, p2: Vec2, out: Vec2): Vec2 {
		const centerx: number = (p1.x + p2.x) / 2;
		const centery: number = (p1.y + p2.y) / 2;
		if (!out) {
			out = new Vec2(centerx, centery);
		} else {
			out.set(centerx, centery);
		}
		return out;
	}

	/**
	 * 获取两点的中点
	 * @param p1
	 * @param p2
	 * @param out
	 * @returns
	 */
	public getCentreVec(p1: Vec3, p2: Vec3, out?: Vec3): Vec3 {
		if (!out) {
			out = VecUtils.allocVec3();
		}

		const centerx: number = (p1.x + p2.x) / 2;
		const centery: number = (p1.y + p2.y) / 2;
		const centerz: number = (p1.z + p2.z) / 2;
		out.set(centerx, centery, centerz);

		return out;
	}

	/**
	 * 获取两点间旋转角度（水平(1,0,0)逆时针）、和cocos旋转角度一致
	 * @param {Vec2} p1
	 * @param {Vec2} p2
	 * @returns {number}
	 */
	public getAngleTwoPoint(
		p1: Vec2 | { x: number; y: number },
		p2: Vec2 | { x: number; y: number }
	): number {
		const vy: number = p2.y - p1.y;
		const vx: number = p2.x - p1.x;
		let ang: number = 0;

		if (vy === 0) {
			if (vx < 0) {
				return 180;
			}
			return 0;
		}

		if (vx === 0) {
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
	 * 获取向量b逆时针旋转到a向量的角度
	 * @param aVec
	 * @param bVec
	 * @returns
	 */
	public getAngleTwoVec2(
		aVec: Vec2 | { x: number; y: number },
		bVec: Vec2 | { x: number; y: number }
	): number {
		const aAngle = this.getAngleTwoPoint({ x: 0, y: 0 }, aVec);
		const bAngle = this.getAngleTwoPoint({ x: 0, y: 0 }, bVec);
		return aAngle - bAngle;
	}

	/**
	 * 获取两向量夹角
	 * @param aVec
	 * @param bVec
	 * @returns
	 */
	public getAngleTwoVec3(aVec: Vec3, bVec: Vec3): number {
		const radius = Vec3.angle(aVec, bVec);
		const angle = radius * MathUtils.RADIAN_TO_ANGLE_FACTOR;
		return angle;
	}

	/**
	 * 获取已axis旋转轴start到aim向量的旋转弧度
	 * @param start
	 * @param aim
	 * @param axis
	 * @returns
	 */
	public getRotationRadianTwoVec3(start: Vec3, aim: Vec3, axis: Vec3): number {
		const radian = Vec3.angle(start, aim);
		const temp = VecUtils.allocVec3();
		const mat = MatrixUtils.allocMat4();
		mat.rotate(Math.PI / 2, axis);
		Vec3.transformMat4(temp, aim, mat);
		const dot = Vec3.dot(temp, start);
		MatrixUtils.freeMat4(mat);
		VecUtils.freeVec3(temp);
		if (dot > 0) {
			return -radian;
		} else {
			return radian;
		}
	}

	/**
	 * 获取一个向量旋转四元数后的向量
	 * @param vec
	 * @param quat
	 * @param out
	 * @returns
	 */
	public getVecRotationQuat(
		vec: Vec3 | { x: number; y: number; z: number },
		quat: Quat,
		out?: Vec3
	): Vec3 {
		if (!out) {
			out = VecUtils.allocVec3();
		}
		const temp = VecUtils.allocVec3(vec.x, vec.y, vec.z);
		const mat = MatrixUtils.allocMat4();
		mat.fromQuat(quat);
		temp.transformMat4(mat);
		out.set(temp);
		VecUtils.freeVec3(temp);
		MatrixUtils.freeMat4(mat);

		return out;
	}

	/**
	 * 获取向量旋转后的向量
	 * @param vec
	 * @param radian
	 * @param axis 旋转轴向量
	 * @param out
	 * @returns
	 */
	public getVecRotation(
		vec: Vec3 | { x: number; y: number; z: number },
		radian: number,
		axis: Vec3,
		out?: Vec3 | { x: number; y: number; z: number }
	): Vec3 | { x: number; y: number; z: number } {
		if (!out) {
			out = VecUtils.allocVec3();
		}

		const tempVec = VecUtils.allocVec3(vec.x, vec.y, vec.z);
		const mat = MatrixUtils.allocMat4();
		mat.rotate(radian, axis);
		tempVec.transformMat4(mat);
		out.x = tempVec.x;
		out.y = tempVec.y;
		out.z = tempVec.z;
		VecUtils.freeVec3(tempVec);
		MatrixUtils.freeMat4(mat);

		return out;
	}

	/**
	 * 获取坐标轴旋转后的坐标
	 * @param vec
	 * @param orientation
	 * @param out
	 * @returns
	 */
	public getAxisRotation(
		vec: Vec3 | { x: number; y: number; z: number },
		orientation: Vec3 | { x: number; y: number; z: number },
		out?: Vec3 | { x: number; y: number; z: number }
	): Vec3 | { x: number; y: number; z: number } {
		if (!out) {
			out = VecUtils.allocVec3();
		}

		const tempVec = VecUtils.allocVec3(vec.x, vec.y, vec.z);
		const tempDir = VecUtils.allocVec3(orientation.x, orientation.y, orientation.z);
		const rquat = new Quat();
		Quat.rotationTo(rquat, Vec3.UNIT_Z, tempDir.normalize());
		const mat = new Mat4();
		mat.fromQuat(rquat);
		mat.invert();
		tempVec.transformMat4(mat);
		out.x = tempVec.x;
		out.y = tempVec.y;
		out.z = tempVec.z;
		VecUtils.freeVec3(tempVec);
		VecUtils.freeVec3(tempDir);

		return out;
	}

	/**
	 * 获取p1和p2跨立长度
	 * @param p1
	 * @param p2
	 * @param p
	 * @returns
	 */
	public getVecCrossLen(p1: Vec3, p2: Vec3, p: Vec3): number {
		return (p2.x - p1.x) * (p.y - p1.y) - (p.x - p1.x) * (p2.y - p1.y);
	}

	/**
	 * 检测p点是否在p1 p2 p3 p4点矩形内
	 * @param p1
	 * @param p2
	 * @param p3
	 * @param p4
	 * @param p
	 * @returns
	 */
	public isRectContain(p1: Vec3, p2: Vec3, p3: Vec3, p4: Vec3, p: Vec3): boolean {
		return (
			this.getVecCrossLen(p1, p2, p) * this.getVecCrossLen(p3, p4, p) >= 0 &&
			this.getVecCrossLen(p2, p3, p) * this.getVecCrossLen(p4, p1, p) >= 0
		);
	}

	/**
	 * 检测平面矩形是否和线段存在交集
	 * @param linePointX1
	 * @param linePointY1
	 * @param linePointX2
	 * @param linePointY2
	 * @param rectangleLeftTopX
	 * @param rectangleLeftTopY
	 * @param rectangleRightBottomX
	 * @param rectangleRightBottomY
	 * @returns
	 */
	public isRectangleCrossLine(
		linePointX1: number,
		linePointY1: number,
		linePointX2: number,
		linePointY2: number,
		rectangleLeftTopX: number,
		rectangleLeftTopY: number,
		rectangleRightBottomX: number,
		rectangleRightBottomY: number
	) {
		const lineHeight = linePointY1 - linePointY2;
		const lineWidth = linePointX2 - linePointX1; // 计算叉乘
		const c = linePointX1 * linePointY2 - linePointX2 * linePointY1;
		if (
			(lineHeight * rectangleLeftTopX + lineWidth * rectangleLeftTopY + c >= 0 &&
				lineHeight * rectangleRightBottomX + lineWidth * rectangleRightBottomY + c <= 0) ||
			(lineHeight * rectangleLeftTopX + lineWidth * rectangleLeftTopY + c <= 0 &&
				lineHeight * rectangleRightBottomX + lineWidth * rectangleRightBottomY + c >= 0) ||
			(lineHeight * rectangleLeftTopX + lineWidth * rectangleRightBottomY + c >= 0 &&
				lineHeight * rectangleRightBottomX + lineWidth * rectangleLeftTopY + c <= 0) ||
			(lineHeight * rectangleLeftTopX + lineWidth * rectangleRightBottomY + c <= 0 &&
				lineHeight * rectangleRightBottomX + lineWidth * rectangleLeftTopY + c >= 0)
		) {
			if (rectangleLeftTopX > rectangleRightBottomX) {
				const temp = rectangleLeftTopX;
				rectangleLeftTopX = rectangleRightBottomX;
				rectangleRightBottomX = temp;
			}
			if (rectangleLeftTopY < rectangleRightBottomY) {
				const temp1 = rectangleLeftTopY;
				rectangleLeftTopY = rectangleRightBottomY;
				rectangleRightBottomY = temp1;
			}
			if (
				(linePointX1 < rectangleLeftTopX && linePointX2 < rectangleLeftTopX) ||
				(linePointX1 > rectangleRightBottomX && linePointX2 > rectangleRightBottomX) ||
				(linePointY1 > rectangleLeftTopY && linePointY2 > rectangleLeftTopY) ||
				(linePointY1 < rectangleRightBottomY && linePointY2 < rectangleRightBottomY)
			) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	/**
	 * 检查盒子是否包含点
	 * @param checkPoint
	 * @param center
	 * @param range
	 * @param orientation
	 * @returns
	 */
	public isCubeContain(
		checkPoint: Vec3 | { x: number; y: number; z: number },
		center: Vec3 | { x: number; y: number; z: number },
		range: Vec3 | { x: number; y: number; z: number },
		orientation?: Vec3 | { x: number; y: number; z: number }
	): boolean {
		const a = VecUtils.allocVec3(
			checkPoint.x - center.x,
			checkPoint.y - center.y,
			checkPoint.z - center.z
		);
		if (orientation) {
			this.getAxisRotation(a, orientation, a);
		}
		const isContain =
			Math.abs(a.x) < range.x / 2 &&
			Math.abs(a.y) < range.y / 2 &&
			Math.abs(a.z) < range.z / 2;
		VecUtils.freeVec3(a);
		return isContain;
	}

	/**
	 * 检测长方体是否和线段相交，非轴对齐使用引擎api lineOBB检测
	 * @param sPos
	 * @param ePos
	 * @param center
	 * @param range
	 * @returns
	 */
	public isCubeCrossLine(
		sPos: Vec3 | { x: number; y: number; z: number },
		ePos: Vec3 | { x: number; y: number; z: number },
		center: Vec3 | { x: number; y: number; z: number },
		range: Vec3 | { x: number; y: number; z: number }
	): boolean {
		// 先粗略排除
		const minx = center.x - range.x / 2;
		const maxx = center.x + range.x / 2;
		const miny = center.y - range.y / 2;
		const maxy = center.y + range.y / 2;
		const minz = center.z - range.z / 2;
		const maxz = center.z + range.z / 2;
		if (
			(sPos.x < minx && ePos.x < minx) ||
			(sPos.x > maxx && ePos.x > maxx) ||
			(sPos.y < miny && ePos.y < miny) ||
			(sPos.y > maxy && ePos.y > maxy) ||
			(sPos.z < minz && ePos.z < minz) ||
			(sPos.z > maxz && ePos.z > maxz)
		) {
			return false;
		}
		// 可能碰撞的进行射线检测
		const d = VecUtils.allocVec3(ePos.x, ePos.y, ePos.z);
		d.subtract3f(sPos.x, sPos.y, sPos.z).normalize();
		const ix = 1 / d.x;
		const iy = 1 / d.y;
		const iz = 1 / d.z;
		VecUtils.freeVec3(d);
		const t1 = (minx - sPos.x) * ix;
		const t2 = (maxx - sPos.x) * ix;
		const t3 = (miny - sPos.y) * iy;
		const t4 = (maxy - sPos.y) * iy;
		const t5 = (minz - sPos.z) * iz;
		const t6 = (maxz - sPos.z) * iz;
		const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
		const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
		if (tmax < 0 || tmin > tmax) {
			return false;
		}
		return true;
	}

	/**
	 * 检测圆柱体是否包含点
	 * @param checkPoint
	 * @param center
	 * @param radius
	 * @param height
	 * @returns
	 */
	public isCylinderContain(
		checkPoint: Vec3 | { x: number; y: number; z: number },
		center: Vec3 | { x: number; y: number; z: number },
		radius: number,
		height: number
	): boolean {
		const half = height / 2;
		if (checkPoint.y > center.y + half || checkPoint.y < center.y - half) {
			return false;
		}

		const diffx = checkPoint.x - center.x;
		const diffz = checkPoint.z - center.z;
		const length = diffx * diffx + diffz * diffz;
		if (length <= radius * radius) {
			return true;
		}

		return false;
	}

	/**
	 * 检测扇形体是否包含点
	 * @param checkPoint
	 * @param center
	 * @param radius
	 * @param height
	 * @param arcDir 扇形中线方向向量
	 * @param angle 扇形角度
	 * @returns
	 */
	public isArcContain(
		checkPoint: Vec3 | { x: number; y: number; z: number },
		center: Vec3 | { x: number; y: number; z: number },
		radius: number,
		height: number,
		arcDir: Vec3 | { x: number; y: number; z: number },
		angle: number
	): boolean {
		const half = height / 2;
		if (checkPoint.y > center.y + half || checkPoint.y < center.y - half) {
			return false;
		}

		const diffx = checkPoint.x - center.x;
		const diffz = checkPoint.z - center.z;
		const length = diffx * diffx + diffz * diffz;
		if (length <= radius * radius) {
			const dir = VecUtils.allocVec3(arcDir.x, 0, arcDir.z);
			const aimDir = VecUtils.allocVec3(diffx, 0, diffz);
			const aimAngle = this.getAngleTwoVec3(dir, aimDir);
			VecUtils.freeVec3(dir);
			VecUtils.freeVec3(aimDir);
			if (aimAngle <= angle / 2) {
				return true;
			}
		}

		return false;
	}

	/**
	 * 检查球体是否包含点
	 * @param checkPoint
	 * @param center
	 * @param radius 点的单位是米（m）
	 * @returns
	 */
	public isSphereContain(
		checkPoint: Vec3 | { x: number; y: number; z: number },
		center: Vec3 | { x: number; y: number; z: number },
		radius: number
	): boolean {
		const diffx = checkPoint.x - center.x;
		const diffy = checkPoint.y - center.y;
		const diffz = checkPoint.z - center.z;
		const length = diffx * diffx + diffy * diffy + diffz * diffz;
		if (length <= radius * radius) {
			return true;
		}
		return false;
	}

	/**
	 * 检查线段和球是否存在交集点
	 * @param sPos
	 * @param ePos
	 * @param center
	 * @param radius
	 * @returns
	 */
	public isSphereCrossLine(
		sPos: Vec3 | { x: number; y: number; z: number },
		ePos: Vec3 | { x: number; y: number; z: number },
		center: Vec3 | { x: number; y: number; z: number },
		radius: number
	): boolean {
		const pos2line = this.getPositionToLineDistance(center, sPos, ePos);
		if (pos2line > radius) {
			return false;
		}

		let isContain = this.isSphereContain(sPos, center, radius);
		if (isContain) {
			return true;
		}

		isContain = this.isSphereContain(ePos, center, radius);
		if (isContain) {
			return true;
		}

		const sVec = VecUtils.allocVec3(ePos.x, ePos.y, ePos.z);
		sVec.subtract3f(sPos.x, sPos.y, sPos.z);
		const crossVec = VecUtils.allocVec3(sVec.x, sVec.y, sVec.z);
		crossVec.normalize().add3f(sPos.x, sPos.y, sPos.z);

		sVec.set(sPos.x, sPos.y, sPos.z);
		sVec.subtract(crossVec);
		const eVec = VecUtils.allocVec3(ePos.x, ePos.y, ePos.z);
		eVec.subtract(crossVec);
		const dot = sVec.dot(eVec);
		VecUtils.freeVec3(sVec);
		VecUtils.freeVec3(crossVec);
		VecUtils.freeVec3(eVec);

		if (dot < 0) {
			return true;
		}

		return false;
	}

	/**
	 * 判断点是否包含在线段中
	 * @param checkPoint
	 * @param sPos
	 * @param ePos
	 * @returns
	 */
	public isLineContain(
		checkPoint: Vec3 | { x: number; y: number; z: number },
		sPos: Vec3 | { x: number; y: number; z: number },
		ePos: Vec3 | { x: number; y: number; z: number }
	): boolean {
		let isContain: boolean = false;
		const sVec = VecUtils.allocVec3();
		sVec.set(checkPoint.x, checkPoint.y, checkPoint.z).subtract3f(sPos.x, sPos.y, sPos.z);
		const sLen = sVec.length();
		sVec.normalize();
		const eVec = VecUtils.allocVec3();
		eVec.set(ePos.x, ePos.y, ePos.z).subtract3f(checkPoint.x, checkPoint.y, checkPoint.z);
		eVec.normalize();
		if (sVec.equals(eVec)) {
			sVec.set(ePos.x, ePos.y, ePos.z).subtract3f(sPos.x, sPos.y, sPos.z);
			const lineLen = sVec.length();
			if (sLen <= lineLen) {
				isContain = true;
			}
		}
		VecUtils.freeVec3(sVec);
		VecUtils.freeVec3(eVec);
		return isContain;
	}

	/**
	 * 判断点在三角型范围内
	 * @param checkPoint
	 * @param a
	 * @param b
	 * @param c
	 * @returns
	 */
	public isTriangleContain(
		checkPoint: Vec3 | { x: number; y: number; z: number },
		a: Vec3 | { x: number; y: number; z: number },
		b: Vec3 | { x: number; y: number; z: number },
		c: Vec3 | { x: number; y: number; z: number }
	): boolean {
		const v0 = VecUtils.allocVec3();
		v0.set(c.x, c.y, c.z).subtract3f(a.x, a.y, a.z);
		const v1 = VecUtils.allocVec3();
		v1.set(b.x, b.y, b.z).subtract3f(a.x, a.y, a.z);
		const v2 = VecUtils.allocVec3();
		v2.set(checkPoint.x, checkPoint.y, checkPoint.z).subtract3f(a.x, a.y, a.z);

		const dot00 = v0.dot(v0);
		const dot01 = v0.dot(v1);
		const dot02 = v0.dot(v2);
		const dot11 = v1.dot(v1);
		const dot12 = v1.dot(v2);
		VecUtils.freeVec3(v0);
		VecUtils.freeVec3(v1);
		VecUtils.freeVec3(v2);

		const inverDeno = 1 / (dot00 * dot11 - dot01 * dot01);

		const u = (dot11 * dot02 - dot01 * dot12) * inverDeno;
		if (u < 0 || u > 1) {
			// if u out of range, return directly
			return false;
		}

		const v = (dot00 * dot12 - dot01 * dot02) * inverDeno;
		if (v < 0 || v > 1) {
			// if v out of range, return directly
			return false;
		}

		return u + v <= 1;
	}

	/**
	 * 排斥实验，对角线行成的矩形相交判断
	 * @param p1
	 * @param p2
	 * @param q1
	 * @param q2
	 */
	public isRectCross(p1: Vec2, p2: Vec2, q1: Vec2, q2: Vec2): boolean {
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
		p1: Vec2 | { x: number; y: number },
		p2: Vec2 | { x: number; y: number },
		q1: Vec2 | { x: number; y: number },
		q2: Vec2 | { x: number; y: number }
	): boolean {
		if (
			((q1.x - p1.x) * (q1.y - q2.y) - (q1.y - p1.y) * (q1.x - q2.x)) *
			((q1.x - p2.x) * (q1.y - q2.y) - (q1.y - p2.y) * (q1.x - q2.x)) <
			0 ||
			((p1.x - q1.x) * (p1.y - p2.y) - (p1.y - q1.y) * (p1.x - p2.x)) *
			((p1.x - q2.x) * (p1.y - p2.y) - (p1.y - q2.y) * (p1.x - p2.x)) <
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
	 */
	public getCrossPoint(p1: Vec2, p2: Vec2, q1: Vec2, q2: Vec2): Vec2 | null {
		if (this.isRectCross(p1, p2, q1, q2) && this.isLineSegmentCross(p1, p2, q1, q2)) {
			//求交点
			const vec = new Vec2();
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
	 * 获取线段和圆跨立相交点
	 * @param sPos
	 * @param ePos
	 * @param center
	 * @param radius
	 */
	public getLineCircleCrossPoint(
		sPos: Vec3 | { x: number; y: number; z: number },
		ePos: Vec3 | { x: number; y: number; z: number },
		center: Vec3 | { x: number; y: number; z: number },
		radius: number
	): Vec3 | null {
		const vec = VecUtils.allocVec3();
		vec.set(center.x, center.y, center.z).subtract3f(sPos.x, sPos.y, sPos.z);
		const dir = VecUtils.allocVec3();
		dir.set(ePos.x, ePos.y, ePos.z).subtract3f(sPos.x, sPos.y, sPos.z);
		dir.normalize();

		const dotValue = Vec3.dot(vec, dir);
		const nearPoint = VecUtils.allocVec3();
		nearPoint.set(dir).multiplyScalar(dotValue).add3f(sPos.x, sPos.y, sPos.z);

		const distanceSquared = Vec3.lengthSqr(
			vec.set(nearPoint).subtract3f(center.x, center.y, center.z)
		);
		const radiusSquared = radius * radius;

		let rVec = VecUtils.allocVec3();
		if (distanceSquared > radiusSquared) {
			VecUtils.freeVec3(rVec);
			rVec = null!;
		} else if (distanceSquared === radiusSquared) {
			rVec.set(nearPoint);
		} else {
			const len = Math.sqrt(radiusSquared - distanceSquared);
			const point1 = VecUtils.allocVec3();
			point1.set(dir).multiplyScalar(len).add(nearPoint);
			const point2 = VecUtils.allocVec3();
			point2.set(dir).multiplyScalar(-len).add(nearPoint);
			const p1Len = Vec3.len(vec.set(point1).subtract3f(ePos.x, ePos.y, ePos.z));
			const p2Len = Vec3.len(vec.set(point2).subtract3f(ePos.x, ePos.y, ePos.z));
			if (p1Len < p2Len) {
				rVec.set(point1);
			} else {
				rVec.set(point2);
			}
			if (!this.isLineContain(rVec, sPos, ePos)) {
				VecUtils.freeVec3(rVec);
				rVec = null!;
			}
			VecUtils.freeVec3(point1);
			VecUtils.freeVec3(point2);
		}

		VecUtils.freeVec3(vec);
		VecUtils.freeVec3(dir);
		VecUtils.freeVec3(nearPoint);

		return rVec;
	}

	/**
	 * 获取从p1->p2移动moveLen后的点
	 * @param startPosition
	 * @param endPosition
	 * @param moveLen
	 * @returns
	 */
	public getMovePosition(startPosition: Vec3, endPosition: Vec3, moveLen: number, out?: Vec3) {
		if (!out) {
			out = VecUtils.allocVec3();
		} else {
			out.set(Vec3.ZERO);
		}

		const tempVec = VecUtils.allocVec3();
		tempVec.add(endPosition).subtract(startPosition).normalize().multiplyScalar(moveLen);
		if (tempVec.equals(Vec3.ZERO)) {
			tempVec.set(startPosition);
		} else {
			tempVec.add(startPosition);
			tempVec.clampf(startPosition, endPosition);
		}
		VecUtils.freeVec3(tempVec);
		out.set(tempVec);

		return out;
	}

	/**
	 * 获取朝向后的本地坐标点，如果获取父节点同级坐标需要加上父节点坐标
	 * @param localPos
	 * @param dirVec
	 * @param out
	 * @returns
	 */
	public getLocalPosByAspectVec(localPos: Vec3, dirVec: Vec3, out?: Vec3): Vec3 {
		if (!out) {
			out = VecUtils.allocVec3();
		}
		// 朝向方向是已y轴为旋转轴所以忽略y轴的值，在后加上即可
		const localY = localPos.y;
		localPos.y = 0;
		dirVec.y = 0;
		const tempVec = VecUtils.allocVec3();
		const rquat = new Quat();
		Quat.rotationTo(rquat, Vec3.UNIT_Y, dirVec.normalize());
		const mat = new Mat4();
		mat.fromQuat(rquat);
		tempVec.set(localPos);
		tempVec.transformMat4(mat);
		tempVec.y += localY;
		out.set(tempVec);
		VecUtils.freeVec3(tempVec);
		return out;
	}

	/**
	 * 获取点到线的最小距离
	 * @param pos
	 * @param sPos
	 * @param ePos
	 * @returns
	 */
	public getPositionToLineDistance(
		pos: Vec3 | { x: number; y: number; z: number },
		sPos: Vec3 | { x: number; y: number; z: number },
		ePos: Vec3 | { x: number; y: number; z: number }
	): number {
		const posVec = VecUtils.allocVec3(pos.x, pos.y, pos.z);
		posVec.subtract3f(sPos.x, sPos.y, sPos.z);
		const lineVec = VecUtils.allocVec3(ePos.x, ePos.y, ePos.z);
		lineVec.subtract3f(sPos.x, sPos.y, sPos.z);
		const dis = posVec.dot(lineVec) / lineVec.length();
		const minDis = Math.sqrt(posVec.lengthSqr() - dis * dis);
		VecUtils.freeVec3(posVec);
		VecUtils.freeVec3(lineVec);
		return minDis;
	}

	/**
	 * 获取到向量最短距离的点
	 * @param pos
	 * @param sPos
	 * @param ePos
	 * @param out
	 * @returns
	 */
	public getToVecMinDistancePosition(
		pos: Vec3 | { x: number; y: number; z: number },
		sPos: Vec3 | { x: number; y: number; z: number },
		ePos: Vec3 | { x: number; y: number; z: number },
		out?: Vec3
	): Vec3 {
		if (!out) {
			out = VecUtils.allocVec3();
		}
		const posVec = VecUtils.allocVec3(pos.x, pos.y, pos.z);
		posVec.subtract3f(sPos.x, sPos.y, sPos.z);
		const lineVec = VecUtils.allocVec3(ePos.x, ePos.y, ePos.z);
		lineVec.subtract3f(sPos.x, sPos.y, sPos.z);
		const dis = posVec.dot(lineVec) / lineVec.length();
		out.set(ePos.x, ePos.y, ePos.z).subtract3f(sPos.x, sPos.y, sPos.z);
		out.normalize().multiplyScalar(dis);
		out.add3f(sPos.x, sPos.y, sPos.z);
		VecUtils.freeVec3(posVec);
		VecUtils.freeVec3(lineVec);
		return out;
	}

	/**
	 * 获取点到线段最近点
	 * @param pos
	 * @param sPos
	 * @param ePos
	 * @returns
	 */
	public getLineMinDistancePoint(
		pos: Vec3 | { x: number; y: number; z: number },
		sPos: Vec3 | { x: number; y: number; z: number },
		ePos: Vec3 | { x: number; y: number; z: number },
		out?: Vec3
	): Vec3 {
		if (!out) {
			out = VecUtils.allocVec3();
		}
		const posVec = VecUtils.allocVec3(pos.x, pos.y, pos.z);
		posVec.subtract3f(sPos.x, sPos.y, sPos.z);
		const lineVec = VecUtils.allocVec3(ePos.x, ePos.y, ePos.z);
		lineVec.subtract3f(sPos.x, sPos.y, sPos.z);
		const lineLen = lineVec.length();
		const dotLen = posVec.dot(lineVec) / lineVec.length();
		if (dotLen < 0) {
			out.set(sPos.x, sPos.y, sPos.z);
		} else if (dotLen >= lineLen) {
			out.set(ePos.x, ePos.y, ePos.z);
		} else {
			out.set(lineVec).normalize().multiplyScalar(dotLen);
			out.add3f(sPos.x, sPos.y, sPos.z);
		}
		VecUtils.freeVec3(posVec);
		VecUtils.freeVec3(lineVec);
		return out;
	}

	/**
	 * 获取两点间距离
	 * @param {Vec2} p1
	 * @param {Vec2} p2
	 * @returns {number}
	 */
	public getDistance(
		p1: Vec2 | { x: number; y: number },
		p2: Vec2 | { x: number; y: number }
	): number {
		const disX: number = p2.x - p1.x;
		const disY: number = p2.y - p1.y;
		const disQ: number = Math.pow(disX, 2) + Math.pow(disY, 2);
		return Math.sqrt(disQ);
	}

	/**
	 * 获取3d两点距离
	 * @param p1
	 * @param p2
	 * @returns
	 */
	public get3DDistance(
		p1: Vec3 | { x: number; y: number; z: number },
		p2: Vec3 | { x: number; y: number; z: number }
	): number {
		const disX: number = p2.x - p1.x;
		const disY: number = p2.y - p1.y;
		const disZ: number = p2.z - p1.z;
		return Math.sqrt(disX * disX + disY * disY + disZ * disZ);
	}

	/**
	 * 精确到小数点后多少位（舍尾）
	 * @param {number} exactValue 精确值
	 * @param {number} count 精确位数 默认0位小数
	 * @return {number}
	 */
	public exactCount(exactValue: number, count: number = 0): number {
		const num: number = Math.pow(10, count);
		const absExactValue = Math.abs(exactValue);
		let value: number = Math.floor(absExactValue * num);
		if (exactValue < 0) {
			value = -value;
		}
		return value / num;
	}

	/**
	 * [0-1]区间获取二次贝塞尔曲线点切线角度
	 * @param {Vec2} p0 起点
	 * @param {Vec2} p1 控制点
	 * @param {Vec2} p2 终点
	 * @param {number} t [0-1]区间
	 * @return {number}
	 */
	public getBezierCutAngle(p0: Vec2, p1: Vec2, p2: Vec2, t: number): number {
		const _x: number = 2 * (p0.x * (t - 1) + p1.x * (1 - 2 * t) + p2.x * t);
		const _y: number = 2 * (p0.y * (t - 1) + p1.y * (1 - 2 * t) + p2.y * t);
		const angle: number = this.getAngle(Math.atan2(_y, _x));
		return angle;
	}

	/**
	 * [0-1]区间获取二次贝塞尔曲线上某点坐标
	 * @param {Vec2} p0 起点
	 * @param {Vec2} p1 控制点
	 * @param {Vec2} p2 终点
	 * @param {number} t [0-1]区间
	 * @param {Vec2} out 缓存的点对象，如不存在则生成新的点对象
	 * @return {Vec2}
	 */
	public getBezierPoint(
		p0: Vec2 | { x: number; y: number },
		p1: Vec2 | { x: number; y: number },
		p2: Vec2 | { x: number; y: number },
		t: number,
		out: Vec2 | null = null
	): Vec2 {
		if (!out) {
			out = new Vec2();
		}
		out.x = (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
		out.y = (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;
		return out;
	}

	/**
	 * 获取贝塞尔曲线长度（切割积分求近似值）
	 * @param p0
	 * @param p1
	 * @param p2
	 * @param t
	 * @param inv 切割曲线递进时间
	 * @returns
	 */
	public getBezierLength(
		p0: Vec2 | { x: number; y: number },
		p1: Vec2 | { x: number; y: number },
		p2: Vec2 | { x: number; y: number },
		t: number = 1,
		inv: number = 0.01
	): number {
		let length = 0;
		const segment = Math.floor(t / inv);
		const curPos = new Vec2(p0.x, p0.y);
		const nextPos = new Vec2();
		for (let i = 1; i < segment; i++) {
			this.getBezierPoint(p0, p1, p2, inv * i, nextPos);
			length += this.getDistance(curPos, nextPos);
			curPos.set(nextPos);
		}
		return length;
	}

	/**
	 * [0-1]区间获取二次贝塞尔曲线点切线方向
	 * @param {Vec2} p0 起点
	 * @param {Vec2} p1 控制点
	 * @param {Vec2} p2 终点
	 * @param {number} t [0-1]区间
	 * @param {Vec3} out 缓存的点对象，如不存在则生成新的点对象
	 * @return {Vec3}
	 */
	public get3DBezierCutVec(
		p0: Vec3 | { x: number; y: number; z: number },
		p1: Vec3 | { x: number; y: number; z: number },
		p2: Vec3 | { x: number; y: number; z: number },
		t: number,
		out: Vec3 | null = null
	): Vec3 {
		if (!out) {
			out = VecUtils.allocVec3();
		}

		out.x = 2 * (p0.x * (t - 1) + p1.x * (1 - 2 * t) + p2.x * t);
		out.y = 2 * (p0.y * (t - 1) + p1.y * (1 - 2 * t) + p2.y * t);
		out.z = 2 * (p0.z * (t - 1) + p1.z * (1 - 2 * t) + p2.z * t);
		out.normalize();

		return out;
	}

	/**
	 * [0-1]区间获取二次贝塞尔曲线上某点坐标
	 * @param {Vec3} p0 起点
	 * @param {Vec3} p1 控制点
	 * @param {Vec3} p2 终点
	 * @param {number} t [0-1]区间
	 * @param {Vec3} out 缓存的点对象，如不存在则生成新的点对象
	 * @return {Vec3}
	 */
	public get3DBezierPoint(
		p0: Vec3 | { x: number; y: number; z: number },
		p1: Vec3 | { x: number; y: number; z: number },
		p2: Vec3 | { x: number; y: number; z: number },
		t: number,
		out: Vec3 | null = null
	): Vec3 {
		if (!out) {
			out = VecUtils.allocVec3();
		}
		out.x = (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
		out.y = (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;
		out.z = (1 - t) * (1 - t) * p0.z + 2 * t * (1 - t) * p1.z + t * t * p2.z;
		return out;
	}

	/**
	 * 获取贝塞尔曲线长度（切割积分求近似值）
	 * @param p0
	 * @param p1
	 * @param p2
	 * @param t
	 * @param inv 切割曲线递进时间
	 * @returns
	 */
	public get3DBezierLength(
		p0: Vec3 | { x: number; y: number; z: number },
		p1: Vec3 | { x: number; y: number; z: number },
		p2: Vec3 | { x: number; y: number; z: number },
		t: number = 1,
		inv: number = 0.01
	): number {
		let length = 0;
		const segment = Math.floor(t / inv);
		const curPos = VecUtils.allocVec3(p0.x, p0.y, p0.z);
		const nextPos = VecUtils.allocVec3();
		for (let i = 1; i < segment; i++) {
			this.get3DBezierPoint(p0, p1, p2, inv * i, nextPos);
			length += this.get3DDistance(curPos, nextPos);
			curPos.set(nextPos);
		}
		VecUtils.freeVec3(curPos);
		VecUtils.freeVec3(nextPos);
		return length;
	}

	/**
	 * 获取点到贝塞尔曲线最短距离点
	 * @param p0
	 * @param p1
	 * @param p2
	 * @param aimPos
	 * @param inv
	 * @returns
	 */
	public get3DBezierMinDistancePoint(
		p0: Vec3 | { x: number; y: number; z: number },
		p1: Vec3 | { x: number; y: number; z: number },
		p2: Vec3 | { x: number; y: number; z: number },
		aimPos: Vec3 | { x: number; y: number; z: number },
		inv: number = 0.01
	): { p: Vec3; t: number } {
		let distance = Number.MAX_VALUE;
		let time = 0;
		const out = VecUtils.allocVec3();
		const curPos = VecUtils.allocVec3();
		const segment = 1 / inv;
		for (let i = 0; i < segment; i++) {
			this.get3DBezierPoint(p0, p1, p2, inv * i, curPos);
			const curDis = this.get3DDistance(aimPos, curPos);
			if (curDis < distance) {
				time = inv * i;
				distance = curDis;
				out.set(curPos);
			}
		}
		VecUtils.freeVec3(curPos);
		return { p: out, t: time };
	}

	/**
	 * [0-1]区间获取三次贝塞尔曲线点切线角度
	 * @param {Vec2} p0 起点
	 * @param {Vec2} p1 控制点
	 * @param {Vec2} p2 控制点
	 * @param {Vec2} p3 终点
	 * @param {number} t [0-1]区间
	 * @return {number}
	 */
	public getBezier3CutAngle(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): number {
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

	/**
	 * [0-1]区间获取三次贝塞尔曲线上某点坐标
	 * @param {Vec2} p0 起点
	 * @param {Vec2} p1 控制点
	 * @param {Vec2} p2 控制点
	 * @param {Vec2} p3 终点
	 * @param {number} t [0-1]区间
	 * @param {Vec2} out 缓存的点对象，如不存在则生成新的点对象
	 * @return {Vec2}
	 */
	public getBezier3Point(
		p0: Vec2,
		p1: Vec2,
		p2: Vec2,
		p3: Vec2,
		t: number,
		out: Vec2 | null = null
	): Vec2 {
		if (!out) {
			out = new Vec2();
		}
		const cx: number = 3 * (p1.x - p0.x);
		const bx: number = 3 * (p2.x - p1.x) - cx;
		const ax: number = p3.x - p0.x - cx - bx;
		const cy: number = 3 * (p1.y - p0.y);
		const by: number = 3 * (p2.y - p1.y) - cy;
		const ay: number = p3.y - p0.y - cy - by;
		out.x = ax * t * t * t + bx * t * t + cx * t + p0.x;
		out.y = ay * t * t * t + by * t * t + cy * t + p0.y;
		return out;
	}
}
