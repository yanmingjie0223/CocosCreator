import { Node, Vec3 } from 'cc';
import { Status } from '../../../../core/assets/runtime/status/Status';
import { ISync } from '../frame/ISyncs';
import { AbilitySystem } from '../AbilitySystem';
import {
	AbilityGameObjectTpye,
	AttackDamage,
	AttackStatus,
	EffectType,
	IAbilityAttributeDefine,
	IAbilityDefine,
	IAbilityEffectDefine,
	IAbilityScriptDefine,
	IAbilitySetDefine,
	IAbilitySoundDefine,
	IAbilitySubjoinDefine,
	IAbilityVarDefine,
	RunStatus
} from './IStruct';

/**
 * 统计对象
 */
export interface IAbilityStatsTarget {
	type: AbilityGameObjectTpye;
	pId: bigint;
	uId: number;
	id: string;
	lv: number;
	exp: number;
}

/**
 * 统计数据
 */
export interface IAbilityStatsData {
	/**攻击力 */
	atk: number;
	/**血量 */
	hp: number;
	/**盾量 */
	shield: number;
	/**甲量 */
	armor: number;
	/**承受伤害 */
	takeDamage: number;
}

/**
 * 对象池类对象实现方法 在回收时候clear数据
 */
export interface IAbilityPoolObject {
	clear(): void;
	destroy(): void;
}

/**
 * 玩家角色
 */
export interface IPlayer {
	get uId(): bigint;
	set uId(value: bigint);
}

/**
 * 游戏对象能力接口
 */
export interface IAbilityGameObject {
	get node(): Node;
	get uId(): number;
	set uId(value: number);
	get vo(): any;
	set vo(value: any);

	removeAbility(ability: IAbility): void;
	getAbilitys(): IAbility[];
	getPlayer(): IPlayer;
	/**向该游戏对象上添加运行技能 */
	addAbility(ability: IAbility): void;

	/**获取游戏对象类型 */
	getGameObjectType(): AbilityGameObjectTpye;

	getHp(): number;
	getMaxHp(): number;
	setMaxHp(maxHp: number): void;
	getSrcMaxHp(): number;
	onHp(hp: number, isCrit: boolean, ignoreHint?: boolean): void;
	setHpShow(isShow: boolean): void;
	getSheildHp(): number;
	getMaxSheildHp(): number;
	onSheildHp(hp: number, ignoreHint?: boolean): void;
	getArmorHp(): number;
	getMaxArmorHp(): number;
	onArmorHp(hp: number, ignoreHint?: boolean): void;
	onExp(exp: number): void;
	getExp(): number;
	getLv(): number;
	setLv(lv: number): void;

	/**真正的死亡，包含复活等判定 */
	isDeath(): boolean;
	/**结束 最终结束 */
	isEnd(): boolean;
	/**是否能被作为目标 */
	isCanTarget(): boolean;
}

/**
 * 技能接口定义
 */
export interface IAbility extends IAbilityPoolObject, ISync.IStep {
	system: AbilitySystem;

	get id(): string;
	get name(): string;
	get uId(): number;
	set targets(value: IAbilityGameObject[]);
	get targets(): IAbilityGameObject[];
	set owner(value: IAbilityGameObject);
	get owner(): IAbilityGameObject;
	get define(): IAbilityDefine;
	get totalDt(): number;
	set rate(value: number);
	get rate(): number;
	set exertAbilityId(value: string);
	get exertAbilityId(): string;
	set exertAbilityUId(value: number);
	get exertAbilityUId(): number;
	set exertPlayerUId(value: bigint);
	get exertPlayerUId(): bigint;
	get attacks(): IAbilityAttack[];
	get coexistAbilitys(): IAbility[];

	/**初始化技能 */
	initialize(system: AbilitySystem, define: IAbilityDefine, uId: number): void;

	start(): void;
	run(): void;
	stop(): void;
	resume(): void;
	/**强制结束技能 系统逻辑帧结束后检查自动回收 */
	forceEnd(): void;

	isAI(): boolean;
	isBuff(): boolean;
	isDebuff(): boolean;
	isBuffOrDebuff(): boolean;
	/**隐身 */
	isHiding(): boolean;
	/**是否负面不良 */
	isNegative(): boolean;
	/**是否能移动 */
	isCanMove(): boolean;

	isEnd(): boolean;
	isCd(): boolean;
	isRun(): boolean;
	isStart(): boolean;
	isFree(): boolean;
	isStop(): boolean;
	/**活跃状态，已开始未结束 */
	isActive(): boolean;

	/**是否能开始 空闲且未运行状态 */
	isCanStart(): boolean;
	/**是否可运行 */
	isCanRun(): boolean;

	addAttack(attack: IAbilityAttack): void;
	getFirstAttack(): IAbilityAttack | null;
	getFirstTarget(): IAbilityGameObject | null;
	/**获取剩余时间，非dt */
	getRemainTime(): number;

	/**添加共存技能 */
	addCoexistAbility(ability: IAbility): void;
	/**移除共存技能 */
	removeCoexistAbility(ability: IAbility): void;

	getScript<T extends keyof IAbilityScriptDefine>(key: T): IAbilityScriptDefine[T] | undefined;
	playScript<T extends keyof IAbilityScriptDefine>(
		key: T,
		arg1?: any,
		arg2?: any,
		arg3?: any
	): boolean;

	/**设置技能属性字段值 */
	setAttributeValue<T extends keyof IAbilityAttributeDefine>(
		key: T,
		value: IAbilityAttributeDefine[T]
	): void;
	/**获取技能属性字段值 */
	getAttributeValue<T extends keyof IAbilityAttributeDefine>(
		key: T
	): IAbilityAttributeDefine[T] | undefined;

	/**设置自定义属性值 */
	setVarValue<T extends keyof IAbilityVarDefine>(key: T, value: IAbilityVarDefine[T]): void;
	/**获取自定义属性值 */
	getVarValue<T extends keyof IAbilityVarDefine>(key: T): IAbilityVarDefine[T] | undefined;

	/**获取技能定义值 */
	getDefineSetValue<T extends keyof IAbilitySetDefine>(key: T): IAbilitySetDefine[T] | undefined;

	/**设置附加属性 */
	setSubjoinValue<T extends keyof IAbilitySubjoinDefine>(
		key: T,
		value: IAbilitySubjoinDefine[T]
	): void;
	/**获取附加属性值 */
	getSubjoinValue<T extends keyof IAbilitySubjoinDefine>(
		key: T
	): IAbilitySubjoinDefine[T] | undefined;

	/**获取特效配置 */
	getEffectsSet(): IAbilityEffectDefine[] | undefined;

	/**获取攻击技能中心点 */
	getAttackCenterPos(): Vec3;
}

/**
 * 攻击体接口定义
 */
export interface IAbilityAttack extends IAbilityPoolObject, ISync.IStep {
	get ability(): IAbility;
	get owner(): IAbilityGameObject;
	set targets(value: IAbilityGameObject[]);
	get targets(): IAbilityGameObject[];
	get system(): AbilitySystem;
	set rate(value: number);
	get rate(): number;
	get invDt(): number;
	get skillCount(): number;
	get damages(): AttackDamage[];
	get logicPosition(): Vec3;

	initialize(ability: IAbility, targets: IAbilityGameObject[]): void;
	/**通过伤害目标获取伤害体 */
	getDamageByTarget(go: IAbilityGameObject): AttackDamage | null;
	getFirstDamage(): AttackDamage | null;
	getFirstTarget(): IAbilityGameObject | null;
	addEffect(effect: IAbilityEffect): void;
	addSound(sound: IAbilitySound): void;
	getEffects(): IAbilityEffect[];
	isEnd(): boolean;

	/**强制攻击 */
	forceAttack(): void;
	/**计算攻击 真正的伤害计算 */
	calculateAttack(): void;
	/**攻击目标打包转换成一个个伤害体初始数据，供后续伤害计算 */
	packAttack(): void;
	/**闲置攻击 */
	freeAttack(): void;
}

/**
 * 技能特效接口定义
 */
export interface IAbilityEffect extends IAbilityPoolObject, ISync.IStep {
	get type(): EffectType;
	set rate(value: number);
	get rate(): number;
	get node(): Node | null;
	get system(): AbilitySystem | null;
	get attackStatus(): Status<AttackStatus>;
	get attack(): IAbilityAttack | null;

	initialize(attack: IAbilityAttack | null, data: IAbilityEffectDefine): void;
	addEffectNode(node: Node | null): void;

	/**设置特效朝向 */
	setAspect(dir: Vec3): void;
	setPosition(x: number, y: number, z: number): void;
	setScale(x: number, y: number, z: number): void;
	setActive(isActive: boolean): void;
	/**特效攻击动作攻击 */
	playAttack(): void;
	isEnd(): boolean;
}

/**
 * 技能声音接口定义
 */
export interface IAbilitySound extends IAbilityPoolObject {
	set rate(value: number);
	get rate(): number;
	get system(): AbilitySystem | null;
	get abilityAttack(): IAbilityAttack | null;
	get runStatus(): Status<RunStatus>;

	initialize(attack: IAbilityAttack | null, data: IAbilitySoundDefine): void;
	logicUpdate(dt: number): void;
	renderUpdate(dt: number): void;
	isEnd(): boolean;
}
