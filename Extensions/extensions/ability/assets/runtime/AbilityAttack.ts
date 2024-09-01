import { Vec3 } from 'cc';
import { Status } from '../../../core/assets/runtime/status/Status';
import { AbilitySystem } from './AbilitySystem';
import { abilityGobal } from './interface/Const';
import {
	IAbility,
	IAbilityAttack,
	IAbilityEffect,
	IAbilityGameObject,
	IAbilitySound
} from './interface/IBase';
import { AttackDamage, AttackStatus } from './interface/IStruct';

export class AbilityAttack implements IAbilityAttack {
	private _ability: IAbility = null!;
	private _targets: IAbilityGameObject[] = [];
	private _invDt: number = 0;
	private _rate: number = 1;
	private _attackStatus: Status<AttackStatus> = new Status();

	/**所有声音节点 */
	private _sounds: IAbilitySound[] = [];
	/**所有特效 */
	private _effects: IAbilityEffect[] = [];
	/**攻击伤害数值体 */
	private _damages: AttackDamage[] = [];

	/**当前node逻辑位置 */
	private _logicPosition: Vec3 = new Vec3();
	/**当前伤害体击杀数量 */
	private _skillCount: number = 0;
	/**是否伤害特效托管 */
	private _isDamageEffectTrust: boolean = false;
	/**是否进入间隔伤害触发时候，立即触发一次 */
	private _firstIntervalAttack: boolean = false;
	/**是否已经间隔攻击 */
	private _isIntervalAttack: boolean = false;

	public get ability(): IAbility {
		return this._ability;
	}

	public get system(): AbilitySystem {
		return this._ability.system;
	}

	public get owner(): IAbilityGameObject {
		return this._ability.owner;
	}

	public set targets(value: IAbilityGameObject[]) {
		this._targets = value;
	}

	public get targets(): IAbilityGameObject[] {
		return this._targets;
	}

	public get damages(): AttackDamage[] {
		return this._damages;
	}

	public get logicPosition(): Vec3 {
		return this._logicPosition;
	}

	public set rate(value: number) {
		this._rate = value;
		this._sounds.forEach((sound) => {
			sound.rate = value;
		});
		this._effects.forEach((effect) => {
			effect.rate = value;
		});
	}

	public get rate(): number {
		return this._rate;
	}

	public get invDt(): number {
		return this._invDt;
	}

	public get skillCount(): number {
		return this._skillCount;
	}

	public initialize(ability: IAbility, targets: IAbilityGameObject[]): void {
		this._ability = ability;
		this._targets = targets;
		this._firstIntervalAttack = !!ability.getAttributeValue('firstIntervalAttack');
	}

	public getDamageByTarget(go: IAbilityGameObject): AttackDamage | null {
		for (let i = 0, len = this._damages.length; i < len; ++i) {
			const damage = this._damages[i];
			if (damage.target === go) {
				return damage;
			}
		}
		return null;
	}

	public getFirstDamage(): AttackDamage | null {
		const damage = this._damages[0];
		if (damage) {
			return damage;
		}

		return null;
	}

	public getFirstTarget(): IAbilityGameObject | null {
		const target = this._targets[0];
		if (target) {
			return target;
		}

		return null;
	}

	public isEnd(): boolean {
		return this._attackStatus.isStatus(AttackStatus.end);
	}

	public addEffect(effect: IAbilityEffect): void {
		this._effects.push(effect);
		this._isDamageEffectTrust = true;
	}

	public addSound(sound: IAbilitySound): void {
		this._sounds.push(sound);
	}

	public getEffects(): IAbilityEffect[] {
		return this._effects;
	}

	public async stepStart(): Promise<void> {}
	public async stepPause(): Promise<void> {}
	public async stepResume(): Promise<void> {}
	public async stepClose(): Promise<void> {}

	public preditUpdate(dt: number): void {
		this._effects.forEach((effect) => {
			effect.preditUpdate(dt);
		});
	}

	public renderUpdate(dt: number): void {
		this._sounds.forEach((sound) => {
			sound.renderUpdate(dt);
		});
		this._effects.forEach((effect) => {
			effect.renderUpdate(dt);
		});
	}

	public logicUpdate(dt: number): void {
		if (this._attackStatus.isStatus(AttackStatus.end)) {
			return;
		}
		// effect
		let len = this._effects.length;
		for (let i = 0; i < len; ++i) {
			const effect = this._effects[i];
			effect.logicUpdate(dt);
		}
		for (let i = len - 1; i > -1; i--) {
			const effect = this._effects[i];
			if (effect.isEnd()) {
				this._effects.splice(i, 1);
				abilityGobal.pool.freeEffect(effect);
			}
		}
		// sound
		len = this._sounds.length;
		for (let i = 0; i < len; ++i) {
			const sound = this._sounds[i];
			sound.logicUpdate(dt);
		}
		for (let i = len - 1; i > -1; i--) {
			const sound = this._sounds[i];
			if (sound.isEnd()) {
				this._sounds.splice(i, 1);
				abilityGobal.pool.freeSound(sound);
			}
		}
		// logic update
		if (this._isDamageEffectTrust) {
			this.logicEffect(dt);
		} else {
			this.logicNoEffect(dt);
		}
	}

	public forceAttack(): void {
		this._invDt = 0;
		this.calculateAttack();
	}

	public calculateAttack(): void {
		this.packAttack();
		const system = this._ability.system;
		const acb = system.abilityCallback;
		acb.onAttackStart(this);
		acb.onAttackedStart(this);
		acb.onWorldAttackStart(this);
		acb.onAttack(this);
		acb.onAttacked(this);
		acb.onWorldAttack(this);
		acb.onAttackEnd(this);
		acb.onAttackedEnd(this);
		acb.onWorldAttackEnd(this);
		acb.onAttackSettlement(this);
		this._skillCount = abilityGobal.parse.parseSettlement(this.damages);
		if (this._skillCount > 0) {
			acb.onDie(this);
			acb.onWorldDie(this);
		}
		acb.onCalculateEnd(this);
		acb.onCalculateedEnd(this);
	}

	public packAttack(): void {
		this._skillCount = 0;
		// 回收上一次的伤害实体
		this._damages.forEach((damage) => {
			abilityGobal.pool.freeDamage(damage);
		});
		this._damages.length = 0;
		// 当前伤害对象
		this._targets.forEach((target) => {
			if (!target.isDeath()) {
				const damage = abilityGobal.pool.allocDamage(this, target);
				this._damages.push(damage);
			}
		});
	}

	public freeAttack(): void {
		this._damages.forEach((damage) => {
			abilityGobal.pool.freeDamage(damage);
		});
		this._damages.length = 0;
	}

	public clear(): void {
		this._ability = null!;
		this._targets.length = 0;
		this._invDt = 0;
		this._rate = 1;
		this._attackStatus.clear();

		this._sounds.forEach((sound) => {
			abilityGobal.pool.freeSound(sound);
		});
		this._effects.forEach((effect) => {
			abilityGobal.pool.freeEffect(effect);
		});
		this._damages.forEach((damage) => {
			abilityGobal.pool.freeDamage(damage);
		});
		this._sounds.length = 0;
		this._effects.length = 0;
		this._damages.length = 0;

		this._skillCount = 0;
		this._isDamageEffectTrust = false;
		this._isIntervalAttack = false;
	}

	public destroy(): void {
		this.clear();
	}

	private logicEffect(dt: number): void {
		if (this._effects.length === 0) {
			this._attackStatus.setStatus(AttackStatus.end);
		} else {
			const inv = this.ability.getAttributeValue('interval')!;
			if (inv !== undefined) {
				if (this._firstIntervalAttack && !this._isIntervalAttack) {
					this.calculateAttack();
					this._isIntervalAttack = true;
				}
				this._invDt += dt;
				if (this._invDt >= inv) {
					this._invDt -= inv;
					this.calculateAttack();
				}
			}
		}
	}

	private logicNoEffect(dt: number): void {
		const attribute = this.ability.getDefineSetValue('attribute')!;
		const totalDt = this.ability.totalDt;
		const shakeBefore = attribute.shakeBefore ? attribute.shakeBefore : 0;
		const duration = attribute.duration;
		const inv = this.ability.getAttributeValue('interval')!;
		if (inv === undefined) {
			if (totalDt >= shakeBefore + duration) {
				this.calculateAttack();
				this._attackStatus.setStatus(AttackStatus.end);
			}
		} else {
			if (this._firstIntervalAttack && !this._isIntervalAttack) {
				this.calculateAttack();
				this._isIntervalAttack = true;
			}
			this._invDt += dt;
			if (this._invDt >= inv) {
				this._invDt -= inv;
				this.calculateAttack();
			}
		}
	}
}
