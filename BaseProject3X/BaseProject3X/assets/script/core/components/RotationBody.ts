import { _decorator, Component, Quat, Vec3 } from 'cc';
import MathUtils from '../utils/MathUtils';
import { VecUtils } from '../utils/VecUtils';
const { ccclass, property } = _decorator;

@ccclass('RotationBody')
export class RotationBody extends Component {
	@property({ tooltip: '转身速度' })
	private _speed: number = 700;

	private _axis: Vec3 = new Vec3(0, 0, 1);
	private _curRotationVec: Vec3 = new Vec3();
	private _endRotationVec: Vec3 = new Vec3(0, 0, 1);

	private _startQuat: Quat = new Quat();
	private _curQuat: Quat = new Quat();
	private _endQuat: Quat = new Quat();

	/**旋转累计时间 */
	private _dt: number = 0;
	/**旋转到目标方向所需时间 */
	private _rTime: number = 0;
	/**是否平滑旋转结束 */
	private _isEnd: boolean = true;

	@property({ tooltip: '转身速度' })
	public get speed(): number {
		return this._speed;
	}
	public set speed(value: number) {
		if (this._speed !== value) {
			this._speed = value;
		}
	}

	/**
	 * 设置旋转轴
	 * @param axis
	 */
	public setAxis(axis: Vec3): void {
		this._axis.set(axis);
	}

	/**
	 * 通过四元数信息设置旋转方向
	 * 注：默认基础朝向(0, 0, 1)
	 * @param quat
	 */
	public setRotationByQuat(quat: Quat): void {
		const tempVec = VecUtils.allocVec3(0, 0, 1);
		Vec3.transformQuat(tempVec, tempVec, quat);
		this.setRotationByVec(tempVec);
		VecUtils.freeVec3(tempVec);
	}

	/**
	 * 通过朝向向量设置旋转方向
	 * 注：默认基础朝向(0, 0, 1)
	 * @param x
	 * @param y
	 * @param z
	 */
	public setRotationByVec3f(x: number, y: number, z: number): void {
		const tempVec = VecUtils.allocVec3(x, y, z);
		this.setRotationByVec(tempVec);
		VecUtils.freeVec3(tempVec);
	}

	/**
	 * 通过朝向向量设置旋转方向
	 * 注：默认基础朝向(0, 0, 1)
	 * @param vec
	 * @returns
	 */
	public setRotationByVec(vec: Vec3): void {
		if (vec.equals(Vec3.ZERO)) {
			return;
		}

		vec.normalize();
		const tempVec = VecUtils.allocVec3();
		Vec3.transformQuat(tempVec, this._axis, this.node.getWorldRotation());
		if (tempVec.equals(vec)) {
			this.setRealTimeRotationByVec3f(tempVec.x, tempVec.y, tempVec.z);
			VecUtils.freeVec3(tempVec);
			return;
		}

		this._startQuat.set(this._curQuat);
		tempVec.set(vec.x, vec.y, vec.z);
		tempVec.normalize();
		Quat.rotationTo(this._endQuat, this._axis, tempVec);

		const curVec = this.getCurRotationVec();
		const mathUtils = MathUtils.getInstance<MathUtils>();
		const angle = mathUtils.getAngleTwoVec3(curVec, tempVec);
		this._rTime = angle / this._speed;
		this._dt = 0;
		this._isEnd = false;
		this._endRotationVec.set(tempVec);

		VecUtils.freeVec3(tempVec);
	}

	/**
	 * 通过朝向向量设置即时旋转方向
	 * 注：默认基础朝向(0, 0, 1)
	 * @param x
	 * @param y
	 * @param z
	 */
	public setRealTimeRotationByVec3f(x: number, y: number, z: number): void {
		this._isEnd = true;
		const tempVec = VecUtils.allocVec3(x, y, z);
		tempVec.normalize();
		Quat.rotationTo(this._startQuat, this._axis, tempVec);
		this._curQuat.set(this._startQuat);
		this._endQuat.set(this._startQuat);
		this._dt = this._rTime = 0;
		this._endRotationVec.set(tempVec);
		VecUtils.freeVec3(tempVec);
		this.node.setWorldRotation(this._endQuat);
	}

	public getCurRotationVec(): Vec3 {
		Vec3.transformQuat(this._curRotationVec, this._axis, this._curQuat);
		return this._curRotationVec;
	}

	public getCurQuat(): Quat {
		return this._curQuat;
	}

	public getEndRotationVec(): Vec3 {
		return this._endRotationVec;
	}

	public clear(): void {
		const tempVec = VecUtils.allocVec3(0, 0, 1);
		Quat.rotationTo(this._startQuat, this._axis, tempVec);
		this._curQuat.set(this._startQuat);
		this._endQuat.set(this._startQuat);
		this._dt = this._rTime = 0;
	}

	protected update(dt: number): void {
		if (this._isEnd) {
			return;
		}

		this._dt += dt;
		Quat.lerp(this._curQuat, this._startQuat, this._endQuat, this._dt / this._rTime);
		if (this._dt >= this._rTime) {
			this._isEnd = true;
		}

		this.node.setWorldRotation(this._curQuat);
	}
}
