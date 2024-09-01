import { Node, Quat, Vec3 } from 'cc';
import { Status } from '../../../core/assets/runtime/status/Status';
import { VecUtils } from '../../../core/assets/runtime/utils/VecUtils';
import { AbilitySystem } from './AbilitySystem';
import { abilityGobal } from './interface/Const';
import { IAbilityAttack, IAbilityEffect } from './interface/IBase';
import { AttackStatus, EffectType, IAbilityEffectDefine } from './interface/IStruct';

export class AbilityEffect implements IAbilityEffect {
	public type: EffectType = EffectType.default;

	protected _nodeUrl: string = '';
	protected _node: Node | null = null;
	protected _attack: IAbilityAttack | null = null!;
	protected _data: IAbilityEffectDefine = null!;
	protected _totalDt: number = 0;

	private _attackStatus: Status<AttackStatus> = new Status();
	private _rate: number = 1;

	private _rotationDir: Vec3 = new Vec3(0, 0, 1);
	private _position: Vec3 = new Vec3();
	private _scale: Vec3 = new Vec3(1, 1, 1);

	public set rate(value: number) {
		this._rate = value;
	}

	public get rate(): number {
		return this._rate;
	}

	public get node(): Node | null {
		return this._node;
	}

	public get system(): AbilitySystem | null {
		if (this._attack) {
			return this._attack.system;
		}
		return null;
	}

	public get attackStatus(): Status<AttackStatus> {
		return this._attackStatus;
	}

	public get attack(): IAbilityAttack | null {
		return this._attack;
	}

	public initialize(attack: IAbilityAttack | null, data: IAbilityEffectDefine): void {
		this._attack = attack;
		this._data = data;
		this._nodeUrl = data.url;
		// initialize sound
		const soundDefines = data.sounds;
		if (soundDefines) {
			soundDefines.forEach((soundDefine) => {
				const sound = abilityGobal.pool.allocSound();
				sound.initialize(attack, soundDefine);
				if (attack) {
					attack.addSound(sound);
				}
			});
		}
	}

	public isEnd(): boolean {
		return this._attackStatus.isStatus(AttackStatus.end);
	}

	public addEffectNode(node: Node | null): void {
		if (node && !node.parent && this._attack) {
			const ability = this._attack.ability;
			ability.system.node.addChild(node);
		}
	}

	public setAspect(dir: Vec3): void {
		if (!this.node) {
			return;
		}

		if (this._rotationDir.equals(dir)) {
			return;
		}

		dir.normalize();
		this._rotationDir.set(dir);
		const quat = this.node.rotation;
		const rvec = VecUtils.allocVec3();
		rvec.set(dir);
		if (this._data.transform && this._data.transform.rotation) {
			const r = this._data.transform.rotation;
			rvec.set(r.x, r.y, r.z);
			Quat.rotationTo(quat, Vec3.UNIT_Z, rvec.normalize());
			Vec3.transformRTS(rvec, dir, quat, Vec3.ZERO, Vec3.ONE);
			rvec.normalize();
		}
		Quat.rotationTo(quat, Vec3.UNIT_Z, rvec);
		this.node.setRotation(quat);
		VecUtils.freeVec3(rvec);
	}

	public setPosition(x: number, y: number, z: number): void {
		if (this._node) {
			if (this._position.equals3f(x, y, z)) {
				return;
			}

			this._position.set(x, y, z);
			if (this._data.transform && this._data.transform.offset) {
				const offset = this._data.transform.offset;
				x += offset.x;
				y += offset.y;
				z += offset.z;
			}
			this._node.setPosition(x, y, z);
		}
	}

	public setScale(x: number, y: number, z: number): void {
		if (this._node) {
			if (this._scale.equals3f(x, y, z)) {
				return;
			}

			this._scale.set(x, y, z);
			if (this._data.transform && this._data.transform.scale) {
				const scale = this._data.transform.scale;
				x *= scale.x;
				y *= scale.y;
				z *= scale.z;
			}
			this._node.setScale(x, y, z);
		}
	}

	public setActive(isActive: boolean): void {
		if (this.node) {
			this.node.active = isActive;
		}
	}

	public async stepStart(): Promise<void> {}
	public async stepPause(): Promise<void> {}
	public async stepResume(): Promise<void> {}
	public async stepClose(): Promise<void> {}
	public preditUpdate(dt: number): void {}
	public logicUpdate(dt: number): void {
		this._totalDt += dt;
	}

	public renderUpdate(dt: number): void {}
	public playAttack(): void {}

	public clear(): void {
		this._data = null!;
		this._attack = null!;
		this._attackStatus.clear();
		abilityGobal.pool.freeNode(this._nodeUrl, this._node);
		this._node = null;
		this._nodeUrl = '';
		this._rotationDir.set(0, 0, 1);
		this._scale.set(1, 1, 1);
		this._position.set(Vec3.ZERO);
		this._totalDt = 0;
	}

	public destroy(): void {
		this.clear();
	}
}
