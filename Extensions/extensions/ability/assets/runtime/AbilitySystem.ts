import { Node } from 'cc';
import { SeedRandom } from '../../../core/assets/runtime/common/SeedRandom';
import { UID } from '../../../core/assets/runtime/common/UID';
import { ISync } from './frame/ISyncs';
import { AbilityCallback } from './AbilityCallback';
import { AbilityData } from './AbilityData';
import { AbilityParse } from './AbilityParse';
import { AbilityPool } from './AbilityPool';
import { AbilityStats } from './AbilityStats';
import { AbilityUtils } from './implements';
import { abilityGobal, clearAbilityGobal } from './interface/Const';
import { IAbility, IAbilityGameObject, IPlayer } from './interface/IBase';

export class AbilitySystem implements ISync.IStep {
	private _node: Node = null!;
	private _rate: number = 1;
	private _abilityMap: Map<number, IAbility> = new Map();
	private _abilitys: IAbility[] = [];
	private _addAbilitys: IAbility[] = [];
	private _idBuilder: UID = new UID();
	private _stats: AbilityStats = new AbilityStats();
	private _abilityData: AbilityData = new AbilityData();
	private _abilityCallback: AbilityCallback = new AbilityCallback();
	private _seedRandom: SeedRandom = null!;
	private _mePlayer: IPlayer = null!;

	public get node(): Node {
		return this._node;
	}

	public set rate(value: number) {
		if (this._rate !== value) {
			this._rate = value;
			this._abilitys.forEach((ability) => {
				ability.rate = value;
			});
			this._addAbilitys.forEach((ability) => {
				ability.rate = value;
			});
		}
	}

	public get rate(): number {
		return this._rate;
	}

	public get seedRandom(): SeedRandom {
		return this._seedRandom;
	}

	public set mePlayer(value: IPlayer) {
		this._mePlayer = value;
	}

	public get mePlayer(): IPlayer {
		return this._mePlayer;
	}

	public get abilityData(): AbilityData {
		return this._abilityData;
	}

	public get abilitys(): IAbility[] {
		return this._abilitys;
	}

	public get abilityCallback(): AbilityCallback {
		return this._abilityCallback;
	}

	public initialize(node: Node, seed: number): void {
		abilityGobal.pool = AbilityPool;
		abilityGobal.parse = AbilityParse;
		abilityGobal.system = this;
		abilityGobal.stats = this._stats;
		abilityGobal.data = this._abilityData;

		this._node = node;
		this._seedRandom = new SeedRandom(seed);
		this._abilityCallback.initialize(this);
	}

	/**
	 * 指定拥有者创建技能
	 * @param abilityId
	 * @param owner
	 * @returns
	 */
	public createAbility(
		abilityId: string,
		owner: IAbilityGameObject,
		exertAbility: IAbility | null = null
	): IAbility | null {
		const define = abilityGobal.parse.getAbilityDefine(abilityId);
		if (define) {
			// 天敌判定
			if (AbilityUtils.checkHasNaturalEnemyAbility(define, owner)) {
				return null;
			}
			// 创建技能
			const uId = this._idBuilder.getUID();
			const ability = abilityGobal.pool.allocAbility();
			ability.rate = this._rate;
			ability.owner = owner;
			ability.initialize(this, define, uId);
			if (exertAbility) {
				// 释放技能
				const aId = exertAbility.exertAbilityId;
				if (aId) {
					ability.exertAbilityId = aId;
				} else {
					ability.exertAbilityId = exertAbility.define.id;
				}
				if (exertAbility.exertAbilityUId) {
					ability.exertAbilityUId = exertAbility.exertAbilityUId;
				} else {
					ability.exertAbilityUId = exertAbility.uId;
				}
				// 释放玩家
				const pId = exertAbility.exertPlayerUId;
				if (pId !== null) {
					ability.exertPlayerUId = pId;
				} else {
					ability.exertPlayerUId = owner.getPlayer().uId;
				}
			} else {
				ability.exertPlayerUId = owner.getPlayer().uId;
			}
			return ability;
		}

		return null;
	}

	/**
	 * 创建技能并运行技能
	 * @param abilityId 技能id
	 * @param owner 技能拥有者
	 * @param exertAbility 释放该技能的导火线技能
	 * @returns
	 */
	public createAbilityAndRun(
		abilityId: string,
		owner: IAbilityGameObject,
		exertAbility: IAbility | null = null
	): IAbility | null {
		const ability = this.createAbility(abilityId, owner, exertAbility);
		this.abilityStartAndRun(ability);
		return ability;
	}

	/**
	 * 开始并运行技能
	 * @param ability
	 */
	public abilityStartAndRun(ability: IAbility | null): void {
		if (ability) {
			ability.owner.addAbility(ability);
			this.addAbility(ability);
			ability.start();
			ability.run();
		}
	}

	/**
	 * 移除死亡或者结束的目标
	 * @param target
	 */
	public removeDieOrEndTarget(target: IAbilityGameObject): void {
		this._abilitys.forEach((ability) => {
			if (!ability.isAI() || ability.owner === target) {
				const tIndex = ability.targets.indexOf(target);
				if (tIndex !== -1) {
					ability.targets.splice(tIndex, 1);
				}
				const attack = ability.getFirstAttack();
				if (attack) {
					const atIndex = attack.targets.indexOf(target);
					if (atIndex !== -1) {
						attack.targets.splice(atIndex, 1);
					}
				}
			}
		});
	}

	/**
	 * 将技能加入到延迟添加池中
	 * @param ability
	 * @returns
	 */
	public addAbility(ability: IAbility): void {
		if (!ability || ability.isEnd()) {
			return;
		}

		ability.system = this;
		this._addAbilitys.push(ability);
	}

	/**
	 * 根据技能uId获取技能
	 * @param uId
	 * @returns
	 */
	public getAbility(uId: number): IAbility | null {
		const ability = this._abilityMap.get(uId);
		if (ability) {
			return ability;
		}
		return null;
	}

	public async stepStart(): Promise<void> {
		this._abilitys.forEach((ability) => {
			if (!ability.isEnd()) {
				ability.stepStart();
			}
		});
	}

	public async stepPause(): Promise<void> {
		this._abilitys.forEach((ability) => {
			if (!ability.isEnd()) {
				ability.stepPause();
			}
		});
	}

	public async stepResume(): Promise<void> {
		this._abilitys.forEach((ability) => {
			if (!ability.isEnd()) {
				ability.stepResume();
			}
		});
	}

	public async stepClose(): Promise<void> {
		this._abilitys.forEach((ability) => {
			if (!ability.isEnd()) {
				ability.stepClose();
			}
		});
	}

	public renderUpdate(dt: number): void {
		this._abilitys.forEach((ability) => {
			if (!ability.isEnd()) {
				ability.renderUpdate(dt);
			}
		});
	}

	public logicUpdate(dt: number): void {
		let len = this._abilitys.length;
		for (let i = 0; i < len; ++i) {
			const ability = this._abilitys[i];
			if (!ability.isEnd()) {
				ability.logicUpdate(dt);
			}
		}
		// 回收移除
		for (let i = len - 1; i > -1; i--) {
			const ability = this._abilitys[i];
			if (ability.isEnd()) {
				this._abilitys.splice(i, 1);
				this._abilityMap.delete(ability.uId);
				AbilityPool.freeAbility(ability);
			}
		}
		// 将需添加技能在帧末加入
		len = this._addAbilitys.length;
		for (let i = 0; i < len; ++i) {
			const ability = this._addAbilitys[i];
			if (!ability.isEnd()) {
				this._abilitys.push(ability);
				this._abilityMap.set(ability.uId, ability);
			} else {
				AbilityPool.freeAbility(ability);
			}
		}
		this._addAbilitys.length = 0;
	}

	public preditUpdate(dt: number): void {
		this._abilitys.forEach((ability) => {
			if (!ability.isEnd()) {
				ability.preditUpdate(dt);
			}
		});
	}

	public destroy(): void {
		this._abilitys.forEach((ability) => {
			ability.destroy();
		});
		this._addAbilitys.forEach((ability) => {
			ability.destroy();
		});
		this._abilitys.length = 0;
		this._addAbilitys.length = 0;
		this._abilityMap.clear();
		AbilityPool.destroy();
		this._abilityData.destroy();
		this._stats.destroy();
		if (this._node) {
			this._node = null!;
		}
		clearAbilityGobal();
	}
}
