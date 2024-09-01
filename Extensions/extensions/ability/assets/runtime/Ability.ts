import { Vec3 } from 'cc';
import { Status } from '../../../core/assets/runtime/status/Status';
import { deepClone } from '../../../core/assets/runtime/types/Types';
import { FPS_RATE } from './frame/Const';
import { AbilitySystem } from './AbilitySystem';
import { abilityGobal } from './interface/Const';
import { IAbility, IAbilityAttack, IAbilityGameObject } from './interface/IBase';
import {
	AbilityStatus,
	AbilityType,
	IAbilityAttributeDefine,
	IAbilityDefine,
	IAbilityEffectDefine,
	IAbilityScriptDefine,
	IAbilitySetDefine,
	IAbilitySubjoinDefine,
	IAbilityVarDefine,
	RunStatus
} from './interface/IStruct';

export class Ability implements IAbility {
	public system: AbilitySystem = null!;

	private _uId: number = null!;
	private _owner: IAbilityGameObject = null!;
	private _targets: IAbilityGameObject[] = [];

	private _define: IAbilityDefine = null!;
	private _customSet: IAbilitySetDefine = null!;

	private _totalDt: number = 0;
	private _rate: number = 1;
	private _runStatus: Status<RunStatus> = new Status();
	private _status: Status<AbilityStatus> = new Status();
	private _stopStatusValue: number = 0;
	private _attacks: IAbilityAttack[] = [];

	/**共存技能 结束本技能会使共存技能一起结束 */
	private _coexistAbilitys: IAbility[] = [];
	/**释放该技能的主技能id 不存在该id视作自己为主技能 */
	private _exertAbilityId: string = null!;
	/**释放该技能的主技能uId */
	private _exertAbilityUId: number = null!;
	/**释放该技能的玩家uid */
	private _exertPlayerUId: bigint = null!;

	public get uId(): number {
		return this._uId;
	}

	public get id(): string {
		return this._define.id;
	}

	public get name(): string {
		return this._define.name ? this._define.name : '';
	}

	public set targets(value: IAbilityGameObject[]) {
		this._targets = value;
	}

	public get targets(): IAbilityGameObject[] {
		return this._targets;
	}

	public set owner(value: IAbilityGameObject) {
		this._owner = value;
	}

	public get owner(): IAbilityGameObject {
		return this._owner;
	}

	public set rate(value: number) {
		if (this._rate !== value) {
			this._rate = value;
			this._attacks.forEach((attack) => {
				attack.rate = value;
			});
		}
	}

	public get rate(): number {
		return this._rate;
	}

	public set exertAbilityId(value: string) {
		this._exertAbilityId = value;
	}

	public get exertAbilityId(): string {
		return this._exertAbilityId;
	}

	public set exertAbilityUId(value: number) {
		this._exertAbilityUId = value;
	}

	public get exertAbilityUId(): number {
		return this._exertAbilityUId;
	}

	public set exertPlayerUId(value: bigint) {
		this._exertPlayerUId = value;
	}

	public get exertPlayerUId(): bigint {
		return this._exertPlayerUId;
	}

	public get attacks(): IAbilityAttack[] {
		return this._attacks;
	}

	public get coexistAbilitys(): IAbility[] {
		return this._coexistAbilitys;
	}

	public get totalDt(): number {
		return this._totalDt;
	}

	public get define(): IAbilityDefine {
		return this._define;
	}

	public initialize(system: AbilitySystem, define: IAbilityDefine, uId: number): void {
		this.system = system;
		this._uId = uId;
		this._define = define;
		this._customSet = deepClone(define.define);
	}

	public start(): void {
		this._runStatus.setStatus(RunStatus.start);
		this.playScript('onStart');
	}

	public run(): void {
		this._totalDt = 0;
		this._status.clear();
		this._runStatus.addStatus(RunStatus.run);
		this.playScript('onTarget');
		this.playScript('onRun');
	}

	public stop(): void {
		this._stopStatusValue = this._runStatus.status;
		this._runStatus.setStatus(RunStatus.free);
		this._runStatus.addStatus(RunStatus.stop);
		this.playScript('onStop');
	}

	public resume(): void {
		if (this._runStatus.isStatus(RunStatus.stop)) {
			this._runStatus.status = this._stopStatusValue;
			this.playScript('onResume');
		}
	}

	public forceEnd(): void {
		if (this._runStatus.isStatus(RunStatus.run)) {
			this.end();
		} else {
			this._runStatus.addStatus(RunStatus.end);
		}
	}

	public isAI(): boolean {
		return this.getAttributeValue('type') === AbilityType.ai;
	}

	public isBuff(): boolean {
		return this.getAttributeValue('type') === AbilityType.buff;
	}

	public isDebuff(): boolean {
		return this.getAttributeValue('type') === AbilityType.debuff;
	}

	public isBuffOrDebuff(): boolean {
		const type = this.getAttributeValue('type');
		if (type === AbilityType.buff || type === AbilityType.debuff) {
			return true;
		}
		return false;
	}

	public isHiding(): boolean {
		if (this.getSubjoinValue('hiding')) {
			return true;
		}
		return false;
	}

	public isNegative(): boolean {
		const attris: Array<keyof IAbilitySubjoinDefine> = [
			'poison',
			'firing',
			'wound',
			'weakness',
			'bleed',
			'doom',
			'miriness',
			'betray',
			'cold',
			'ecstasy',
			'dizz',
			'silence',
			'disorder',
			'awe',
			'fear',
			'freeze',
			'anesthesia',
			'corrode'
		];
		for (let i = 0, len = attris.length; i < len; ++i) {
			if (this.getSubjoinValue(attris[i])) {
				return true;
			}
		}
		return false;
	}

	public isCanMove(): boolean {
		const attris: Array<keyof IAbilitySubjoinDefine> = [
			'dizz',
			'awe',
			'freeze',
			'exile',
			'anesthesia',
			'enwind'
		];
		for (let i = 0, len = attris.length; i < len; ++i) {
			if (this.getSubjoinValue(attris[i])) {
				return false;
			}
		}
		return true;
	}

	public isEnd(): boolean {
		return this._runStatus.isStatus(RunStatus.end);
	}

	public isCd(): boolean {
		return this._status.isStatus(AbilityStatus.cd);
	}

	public isStart(): boolean {
		return this._runStatus.isStatus(RunStatus.start);
	}

	public isFree(): boolean {
		if (this._runStatus.isStatus(RunStatus.stop)) {
			return false;
		}
		if (this._runStatus.isStatus(RunStatus.end)) {
			return false;
		}

		return this._status.isStatus(AbilityStatus.free);
	}

	public isRun(): boolean {
		return this._runStatus.isStatus(RunStatus.run);
	}

	public isStop(): boolean {
		return this._runStatus.isStatus(RunStatus.stop);
	}

	public isActive(): boolean {
		if (!this.isEnd() && this.isStart()) {
			return true;
		}
		return false;
	}

	public isCanStart(): boolean {
		if (this._status.isStatus(AbilityStatus.free) && this._runStatus.isStatus(RunStatus.free)) {
			return true;
		}
		return false;
	}

	public isCanRun(): boolean {
		if (this._runStatus.isStatus(RunStatus.start) && !this._runStatus.isStatus(RunStatus.run)) {
			return true;
		}
		return false;
	}

	public addAttack(attack: IAbilityAttack): void {
		this._attacks.push(attack);
	}

	public addCoexistAbility(ability: IAbility): void {
		if (this._coexistAbilitys.indexOf(ability) === -1) {
			this._coexistAbilitys.push(ability);
		}
	}

	public removeCoexistAbility(ability: IAbility): void {
		const index = this._coexistAbilitys.indexOf(ability);
		if (index !== -1) {
			this._coexistAbilitys.splice(index, 1);
		}
	}

	public getFirstAttack(): IAbilityAttack | null {
		const attack = this._attacks[0];
		if (attack) {
			return attack;
		}

		return null;
	}

	public getRemainTime(): number {
		const duration = this._customSet.attribute.duration;
		const remainDt = duration - this._totalDt;
		return remainDt * FPS_RATE;
	}

	public getFirstTarget(): IAbilityGameObject | null {
		const target = this._targets[0];
		if (target) {
			return target;
		}

		return null;
	}

	public getDefineSetValue<T extends keyof IAbilitySetDefine>(
		key: T
	): IAbilitySetDefine[T] | undefined {
		if (this._customSet && this._customSet[key]) {
			return this._customSet[key];
		}
		return undefined;
	}

	public setAttributeValue<T extends keyof IAbilityAttributeDefine>(
		key: T,
		value: IAbilityAttributeDefine[T]
	): void {
		if (this._customSet) {
			this._customSet['attribute'][key] = value;
		}
	}

	public getAttributeValue<T extends keyof IAbilityAttributeDefine>(
		key: T
	): IAbilityAttributeDefine[T] | undefined {
		if (this._customSet) {
			return this._customSet['attribute'][key];
		}
		return undefined;
	}

	public setVarValue<T extends keyof IAbilityVarDefine>(
		key: T,
		value: IAbilityVarDefine[T]
	): void {
		if (this._customSet) {
			const variable = this._customSet.variable;
			if (!variable || variable[key] === undefined) {
				console.error(`${this.define.id} 技能define-variable下未定义 ${key} 初始值!`);
				return;
			}
			variable[key] = value;
		}
	}

	public getVarValue<T extends keyof IAbilityVarDefine>(
		key: T
	): IAbilityVarDefine[T] | undefined {
		if (this._customSet && this._customSet.variable) {
			return this._customSet.variable[key];
		}
		return undefined;
	}

	public setSubjoinValue<T extends keyof IAbilitySubjoinDefine>(
		key: T,
		value: IAbilitySubjoinDefine[T]
	): void {
		if (this._customSet) {
			const attribute = this._customSet['attribute'];
			const subjoin = attribute['subjoin'];
			if (subjoin) {
				subjoin[key] = value;
			}
		}
	}

	public getSubjoinValue<T extends keyof IAbilitySubjoinDefine>(
		key: T
	): IAbilitySubjoinDefine[T] | undefined {
		if (this._customSet) {
			const attribute = this._customSet['attribute'];
			const subjoin = attribute['subjoin'];
			if (subjoin) {
				return subjoin[key];
			}
		}
		return undefined;
	}

	public getEffectsSet(): IAbilityEffectDefine[] | undefined {
		if (this._customSet && this._customSet.effects) {
			return this._customSet.effects;
		}
		return undefined;
	}

	public getScript<T extends keyof IAbilityScriptDefine>(
		key: T
	): IAbilityScriptDefine[T] | undefined {
		const script = this._define.script;
		if (script) {
			return script[key];
		}
		return undefined;
	}

	public playScript<T extends keyof IAbilityScriptDefine>(
		key: T,
		arg1?: any,
		arg2?: any,
		arg3?: any
	): boolean {
		const script = this._define.script;
		if (script) {
			const cb: any = script[key];
			if (cb) {
				cb.call(this, arg1, arg2, arg3);
				return true;
			}
		}
		return false;
	}

	public getAttackCenterPos(): Vec3 {
		const attack = this._attacks[0];
		const centerPos = attack.logicPosition;
		return centerPos;
	}

	public async stepStart(): Promise<void> {
		if (this.checkUpdate()) {
			this._attacks.forEach((attack) => {
				attack.stepStart();
			});
		}
	}

	public async stepPause(): Promise<void> {
		if (this.checkUpdate()) {
			this._attacks.forEach((attack) => {
				attack.stepPause();
			});
		}
	}

	public async stepResume(): Promise<void> {
		if (this.checkUpdate()) {
			this._attacks.forEach((attack) => {
				attack.stepResume();
			});
		}
	}

	public async stepClose(): Promise<void> {
		if (this.checkUpdate()) {
			this._attacks.forEach((attack) => {
				attack.stepClose();
			});
		}
	}

	public preditUpdate(dt: number): void {
		if (this.checkUpdate()) {
			this._attacks.forEach((attack) => {
				attack.preditUpdate(dt);
			});
		}
	}

	public renderUpdate(dt: number): void {
		if (this.checkUpdate()) {
			this._attacks.forEach((attack) => {
				attack.renderUpdate(dt);
			});
			this.playScript('renderUpdate', dt);
		}
	}

	public logicUpdate(dt: number): void {
		// free and end no run
		if (!this._runStatus.isStatus(RunStatus.run)) {
			if (this._runStatus.isStatus(RunStatus.start)) {
				this.playScript('logicUpdate', dt);
			}
			return;
		}
		// update and check
		this._totalDt += dt;
		const len = this._attacks.length;
		for (let i = 0; i < len; ++i) {
			const attack = this._attacks[i];
			attack.logicUpdate(dt);
		}
		for (let i = len - 1; i > -1; --i) {
			const attack = this._attacks[i];
			if (attack.isEnd()) {
				this._attacks.splice(i, 1);
				abilityGobal.pool.freeAttack(attack);
			}
		}
		// status check
		const attribute = this._customSet.attribute;
		const shakeBefore = attribute.shakeBefore ? attribute.shakeBefore : 0;
		const hasShakeBefore = attribute.shakeBefore !== undefined;
		let isStatusing = this.intoShakeBefore(hasShakeBefore, shakeBefore);
		if (!isStatusing) {
			const duration = attribute.duration;
			isStatusing = this.intoDuration(shakeBefore, duration, attribute.noAttack);
			if (!isStatusing) {
				const shakeBack = attribute.shakeBack ? attribute.shakeBack : 0;
				const release = shakeBefore + duration + shakeBack;
				const hasShakeBack = attribute.shakeBack !== undefined;
				isStatusing = this.intoShakeBack(hasShakeBack, release);
				if (!isStatusing) {
					const cd = attribute.cd ? attribute.cd : 0;
					const liftcycle = release + cd;
					const hasCd = attribute.cd !== undefined;
					isStatusing = this.intoCd(hasCd, liftcycle);
					if (!isStatusing) {
						this.intoEnd(hasCd, attribute.noAIRun);
					}
				}
			}
		}
		// callback
		this.playScript('logicUpdate', dt);
	}

	public clear(): void {
		for (let i = 0, len = this._attacks.length; i < len; ++i) {
			abilityGobal.pool.freeAttack(this._attacks[i]);
		}
		this._attacks.length = 0;
		this._targets.length = 0;
		if (this._owner) {
			this._owner.removeAbility(this);
			this._owner = null!;
		}
		this._totalDt = 0;
		this._exertAbilityId = null!;
		this._exertAbilityUId = null!;
		this._exertPlayerUId = null!;
		this.system = null!;
		this._define = null!;
		this._runStatus.setStatus(RunStatus.free);
		this._status.setStatus(AbilityStatus.free);
		this._stopStatusValue = 0;
		this._coexistAbilitys.length = 0;
	}

	public destroy(): void {
		this.clear();
	}

	private end(): void {
		this._runStatus.removeStatus(RunStatus.run);
		this._runStatus.addStatus(RunStatus.end);
		this._coexistAbilitys.forEach((ability) => {
			ability.forceEnd();
		});
		this._coexistAbilitys.length = 0;
		this.playScript('onEnd');
	}

	private intoShakeBefore(hasShakeBefore: boolean, shakeBefore: number): boolean {
		if (hasShakeBefore) {
			if (!this._status.isStatus(AbilityStatus.shakeBefore)) {
				this._status.addStatus(AbilityStatus.shakeBefore);
				this.playScript('onStartShakeBefore');
				return true;
			} else if (this._totalDt < shakeBefore) {
				return true;
			}
		}
		return false;
	}

	private intoDuration(
		shakeBefore: number,
		duration: number,
		noAttack: boolean | undefined
	): boolean {
		if (!this._status.isStatus(AbilityStatus.duration)) {
			if (!noAttack) {
				abilityGobal.parse.parseAttack(this);
			}
			this._status.addStatus(AbilityStatus.duration);
			this.playScript('onStartDuration');
			return true;
		} else if (this._totalDt < shakeBefore + duration) {
			return true;
		} else {
			return false;
		}
	}

	private intoShakeBack(hasShakeBack: boolean, release: number): boolean {
		if (hasShakeBack) {
			if (!this._status.isStatus(AbilityStatus.shakeBack)) {
				this._status.addStatus(AbilityStatus.shakeBack);
				this.playScript('onStartShakeBack');
				return true;
			} else if (this._totalDt < release) {
				return true;
			}
		}
		return false;
	}

	private intoCd(hasCd: boolean, liftcycle: number): boolean {
		if (hasCd) {
			if (!this._status.isStatus(AbilityStatus.cd)) {
				this._status.addStatus(AbilityStatus.cd);
				this.playScript('onStartCd');
				return true;
			} else if (this._totalDt < liftcycle) {
				return true;
			}
		}
		return false;
	}

	private intoEnd(hasCd: boolean, noAIRun: boolean | undefined): boolean {
		if (hasCd) {
			this._status.setStatus(AbilityStatus.free);
			this.playScript('onEndCd');
			if (!noAIRun) {
				this.run();
			}
		} else {
			this.end();
		}
		return true;
	}

	private checkUpdate(): boolean {
		if (this._runStatus.isStatus(RunStatus.end)) {
			return false;
		}
		if (!this._runStatus.isStatus(RunStatus.run)) {
			return false;
		}
		return true;
	}
}
