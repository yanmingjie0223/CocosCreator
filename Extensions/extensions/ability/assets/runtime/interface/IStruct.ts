import { ccenum } from 'cc';
import { IAbility, IAbilityAttack, IAbilityGameObject } from './IBase';

export enum AbilityGameObjectTpye {
	Unkown,
	Character,
	Monster
}

export const enum AbilityCostType {
	/**消耗生命值 */
	magic
}

export const enum AbilityType {
	/**默认普通 */
	default,
	/**角色 */
	character,
	/**ai技能 控制游戏角色释放ai行为的技能 */
	ai,
	/**buff类 增益技能 */
	buff,
	/**debuff类 减益技能 */
	debuff,
	/**怪物技能 */
	monster
}

export const enum TargetMoveType {
	/**默认正常 */
	default,
	/**推 */
	push
}

export enum TargetRangeType {
	/**矩形体范围 */
	cube,
	/**球体范围 */
	sphere,
	/**圆柱 */
	cylinder,
	/**扇形 */
	arc
}
ccenum(TargetRangeType);

export interface TargetAtkRange {
	type: TargetRangeType;
	/**矩形体/圆柱体 大小 */
	size?: IAbilityVec3;
	/**球体/扇形体 半径(m) */
	radius?: number;
	/**扇形角度 */
	angle?: number;
	/**扇形方向 */
	dir?: IAbilityVec3;
}

export const enum BulletAttackType {
	/**两点方式 */
	twoPoint,
	/**跟随方式 */
	follow,
	/**指向方式 */
	direction,
	/**曲线路径方式 */
	curvePath
}

export const enum EffectType {
	default,
	/**跟随子弹特效 */
	bulletFollow,
	/**两点攻击特效 */
	bulletTwoPoint,
	/**路径攻击特效 */
	bulletGridPath,
	/**曲线路径攻击特效 */
	bulletCurvePath,
	/**指向攻击特效 */
	bulletDirection,
	/**范围攻击特效 */
	pointRange,
	/**召唤攻击特效表现 */
	summon,
	/**线攻击特效 */
	line,
	/**飞盘类型 */
	frisbee,
	/**动画特效 */
	animation,
	/**动作 */
	action
}

export const enum RunStatus {
	/**默认 空闲 */
	free,
	/**开始 */
	start,
	/**运行中 */
	run,
	/**停止 */
	stop,
	/**结束 */
	end
}

export const enum AttackStatus {
	/**默认 空闲 */
	free,
	/**弹道飞行，该状态和duration总结在技能持续中 */
	flying,
	/**攻击持续中，该状态和flying总结在技能持续中 */
	duration,
	/**攻击结束状态 */
	end
}

export const enum AbilityStatus {
	/**默认 空闲 */
	free,
	/**前摇中 */
	shakeBefore,
	/**持续中 */
	duration,
	/**后摇中 */
	shakeBack,
	/**cd中 */
	cd
}

export interface IAbilityGOMove {
	/**移动类型 */
	type: TargetMoveType;
	/**移动距离 */
	distance: number;
	/**速度 m/s */
	speed: number;
}

/**技能游戏对象属性 */
export interface IAbilityGOAttribute {
	/**扣除血量率 例如：扣除血量率80%，计算扣除100点血量，那么最终扣除血量80点 */
	hpRate?: number;

	/**攻击力 */
	atk?: number;
	/**攻击频率 */
	rate?: number;
	/**攻击范围 m */
	atkRange?: number;

	/**攻击获取经验 */
	expGet?: number;
	/**移动速度 m/s */
	speed?: number;
	/**最低速度 */
	minSpeed?: number;

	/**魔法抗性 */
	magicDef?: number;
	/**物理抗性 */
	phyDef?: number;
	/**抗暴击概率 */
	critProbDef?: number;

	/**连击率 */
	comboRate?: number;
	/**暴击概率 */
	critProb?: number;
	/**暴伤倍率 */
	critRate?: number;
	/**护盾 */
	shield?: number;
	/**护甲 */
	armor?: number;
	/**盾系数 */
	shieldRate?: number;
	/**甲系数 */
	armorRate?: number;
	/**无视抗性率 */
	ignoreDefRate?: number;
}

export interface IAbilityVarDefine {
	/**加减血量值 */
	hp?: number;
	/**最总伤害血量率 */
	hpRate?: number;

	/**记录变化攻击力 */
	atk?: number;
	/**记录变化攻击率 浮点数 */
	atkRate?: number;
	/**记录变化攻击范围(m) */
	atkRange?: number;

	/**记录变化的被攻击率 */
	atkedRate?: number;

	/**记录连击率 */
	comboRate?: number;
	/**记录移动速度加成 m/s */
	speed?: number;
	/**移动速率加成 */
	speedRate?: number;
	/**单体塔移动速率附加概率增加值 */
	singleSpeedRateProb?: number;
	/**群体塔移动速率附加概率增加值 */
	flockSpeedRateProb?: number;
	/**攻击速率 */
	atkSpeedRate?: number;

	/**记录盾系数 */
	shieldRate?: number;
	/**记录甲系数 */
	armorRate?: number;
	/**记录魔法抗性 */
	magicDef?: number;
	/**记录物理抗性 */
	phyDef?: number;
	/**记录无视抗性率 */
	ignoreDefRate?: number;

	/**记录变化暴击倍率 */
	critRate?: number;
	/**被暴击倍率 */
	critedRate?: number;
	/**暴击概率 */
	critProb?: number;
	/**抗暴击概率 */
	critProbDef?: number;

	/**崩溃额外附加次数 */
	collapse?: number;
	/**崩溃额外增加伤害率 */
	collapseRate?: number;

	/**是否强化状态 */
	isStrong?: boolean;

	/**攻击属性 存在时使用该攻击信息 */
	atkAttribute?: AbilityGameObjectAtkAttribute;

	/**本地代码控制字段，用于技能的一些变量记录和定义，不参与其他逻辑 */
	codeAttribute?: any;

	/**记录一个位置信息 */
	position?: IAbilityVec3;
	/**记录一个塔信息 */
	tower?: { uId: number; pId: bigint };
	/**记录一个怪物信息 */
	monster?: { uId: number; pId: bigint };
}

/**
 * 游戏对象攻击属性字段
 */
export interface AbilityGameObjectAtkAttribute {
	/**攻击值 */
	atk: number;
	/**攻击率 */
	atkRate: number;
	/**暴击倍率 */
	critRate: number;
	/**暴击概率 */
	critProb: number;
	/**忽略抗性率 */
	ignoreDefRate: number;
	/**扣血系数 */
	hpRate: number;
	/**护盾系数 */
	shieldRate: number;
	/**护甲系数 */
	armorRate: number;
}

/**
 * 游戏对象被攻击属性
 */
export interface AbilityGameObjectAtkedAttribute {
	/**魔法攻击魔抗 */
	magicDef: number;
	/**物理攻击物抗 */
	phyDef: number;
	/**抗暴击概率 */
	critProbDef: number;
	/**被暴击倍率 增加或者削弱被攻击的暴击倍率 */
	critedRate: number;
	/**被攻击率 攻击力增减百分率 */
	atkedRate: number;
	/**护盾 */
	shield: number;
	/**护甲 */
	armor: number;
}

/**
 * 攻击伤害字段
 */
export interface AtkDamageAttribute {
	/**血消耗 */
	hp: number;
	/**盾消耗 */
	shield: number;
	/**甲消耗 */
	armor: number;
	/**暴击增量值 */
	crit: number;
	/**是否暴击 */
	isCrit: boolean;
}

/**
 * 注: 添加字段需要同时在AbilityPool中做初始化和清理添加
 */
export interface AttackDamage {
	/**攻击体 */
	attack: IAbilityAttack | null;
	/**攻击者 */
	owner: IAbilityGameObject | null;
	/**攻击目标 */
	target: IAbilityGameObject | null;

	/**攻击属性 存在攻击属性时使用该属性 */
	atkAttribute: AbilityGameObjectAtkAttribute | null;
	/**被击属性 存在攻击属性时使用该属性 */
	tatAttribute: AbilityGameObjectAtkedAttribute | null;

	/**初始伤害值 */
	atk: number;
	/**最终伤害血量变化量 */
	hp: number;
	/**最终伤害魔法值变化量 */
	mp: number;
	/**盾值 */
	shield: number;
	/**甲值 */
	armor: number;
	/**伤害暴击值 */
	crit: number;
	/**是否暴击伤害 */
	isCrit: boolean;
}

export interface IAbilityVec3 {
	x: number;
	y: number;
	z: number;
}

export interface IAbilityTransformDefine {
	/**偏移 */
	offset?: IAbilityVec3;
	/**缩放 */
	scale?: IAbilityVec3;
	/**旋转 模型初始默认需朝向z轴正方向 */
	rotation?: IAbilityVec3;
}

export interface IAbilitySoundDefine {
	/**相对assets/sounds目录下的文件路径 */
	url: string;
	/**播放次数 大于0 */
	times?: number;
	/**是否单音 */
	single?: boolean;
	/**延迟播放 */
	delay?: number;
}

export interface IAbilityActionDefine {
	/**
	 * 动作类型
	 * owner 表示该动作会作用在游戏角色对象上
	 */
	type: 'owner';
}

export interface IAbilityEffectAspectDefine {
	/**
	 * 特效朝向
	 * target: 朝向目标被攻击点者
	 * target_dir: 朝向目标方位
	 * custom: 自定义
	 */
	type: 'target' | 'target_dir' | 'custom';
	/**自定义类型方向 */
	direction?: IAbilityVec3;
}

export interface IAbilityEffectDefine {
	/**相对assets/prefabs目录下的文件路径 */
	url: string;
	/**特效变化属性 */
	transform?: IAbilityTransformDefine;
	/**特效次数，-1标识无限循环 */
	times?: number;
	/**音效 */
	sounds?: IAbilitySoundDefine[];
	/**朝向定义 */
	aspect?: IAbilityEffectAspectDefine;

	/**开始时触发其他特效 */
	startEffect?: IAbilityEffectDefine;
	/**结束触发其他特效 */
	endEffect?: IAbilityEffectDefine;
}

export interface IAbilityBulletCurvePathDefine {
	/**开始片段时间 */
	time: number;
	/**曲线路径片段 */
	segments: Array<IAbilityVec3[]>;
	/**行走距离 */
	distance: number;
	/**是否碰撞检测 注: 当前只支持球形检测 */
	collider?: TargetAtkRange;
}

export interface IAbilityBulletDefine {
	/**攻击类型 */
	type: BulletAttackType;
	/**移动速度(m/s) */
	moveSpeed: number;
	/**两点类型信息定义 */
	posDefine?: {
		startPos?: IAbilityVec3;
		endPos?: IAbilityVec3;
	};
	/**方向类型信息定义 */
	dirDefine?: {
		/**子弹飞行方向 注：方向型子弹攻击定要有这个 */
		direction: IAbilityVec3;
		/**子弹初始位置 */
		startPos?: IAbilityVec3;
	};
	/**曲线路径类型信息定义 */
	curveDefine?: IAbilityBulletCurvePathDefine;
}

export interface IAbilityLineDefine {
	/**
	 * 技能位置点类型
	 * followTarget: 连线到跟随目标被攻击点
	 * target: 连线到所有目标被攻击点
	 * custom: 自定义点位置
	 */
	type: 'followTarget' | 'target' | 'custom';
	/**
	 * 自定义类型时候使用的世界点信息
	 */
	wPositions?: IAbilityVec3[];
}

export interface IAbilityMeleeDefine {
	/**
	 * 技能位置点类型
	 * owner: 拥有者攻击点位置（跟随该点位置移动）
	 * owner_point: 拥有者攻击点位置
	 * owner_root: 拥有者根节点位置（跟随该点位置移动）
	 * owner_root_point 拥有者根节点位置
	 * owner_socket: 拥有者特效绑定点位置（跟随该点位置移动）
	 * target: 目标被击点位（跟随该点位置移动）
	 * target_point: 目标者被击点位置
	 * target_root: 目标者根节点位置（跟随该点位置移动）
	 * target_root_point: 目标者根节点位置
	 * custom: 自定义点位置（跟随该点位置移动）
	 */
	type: IAbilityMeleeTypeDefine;
	/**
	 * 自定义点位置
	 */
	position?: IAbilityVec3;
	/**
	 * 环绕，撞击
	 */
	surround?: IAbilityMeleeSurroundDefine;
}

/**
 * 技能位置点类型
 * owner: 拥有者攻击点位置（跟随该点位置移动）
 * owner_point: 拥有者攻击点位置
 * owner_root: 拥有者根节点位置（跟随该点位置移动）
 * owner_root_point 拥有者根节点位置
 * owner_socket: 拥有者特效绑定点位置（跟随该点位置移动）
 * target: 目标被击点位（跟随该点位置移动）
 * target_point: 目标者被击点位置
 * target_root: 目标者根节点位置（跟随该点位置移动）
 * target_root_point: 目标者根节点位置
 * custom: 自定义点位置（跟随该点位置移动）
 */
export type IAbilityMeleeTypeDefine =
	| 'owner'
	| 'owner_point'
	| 'owner_root'
	| 'owner_root_point'
	| 'owner_socket'
	| 'target'
	| 'target_point'
	| 'target_root'
	| 'target_root_point'
	| 'custom';

export interface IAbilityMeleeSurroundDefine {
	/**初始角度 (0, 0, 1) 方向为0角度 */
	angle: number;
	/**环绕半径 */
	radius: number;
	/**环绕角速度 */
	rSpeed: number;
	/**碰撞形状 */
	collider: TargetAtkRange;
	/**是否碰撞结束 */
	isHitEnd?: boolean;
}

export interface IAbilitySummonAnimationDefine {
	/**移动速度 */
	mSpeed: number;
}

export interface IAbilityFrisbeeDefine {
	/**飞行速度 */
	moveSpeed: number;
	/**开始点 */
	startPos: IAbilityVec3;
	/**结束点 */
	endPos: IAbilityVec3;
	/**结束点持续时间 */
	endPosDuration: number;
}

export interface IAbilitySummonGODefine {
	/**召唤游戏对象id */
	id: string;
	/**召唤对象旋转速率 */
	rSpeed: number;
	/**召唤对象移动速率 */
	mSpeed: number;
}

export interface IAbilityCostDefine {
	/**释放技能消耗类型 */
	type: AbilityCostType;
	/**释放技能消耗数量 */
	count: number;
}

export interface IAbilitySubjoinDefine {
	/**中毒/腐烂 */
	poison?: boolean;
	/**灼烧/融化 */
	firing?: boolean;
	/**创伤/溃烂 */
	wound?: boolean;
	/**虚弱/弱点 */
	weakness?: boolean;
	/**流血/出血 */
	bleed?: boolean;
	/**厄运/中咒 */
	doom?: boolean;
	/**泥泞/渗透 */
	miriness?: boolean;
	/**暴露/易伤 */
	betray?: boolean;
	/**寒冷/失温 */
	cold?: boolean;
	/**恍惚/迷失 */
	ecstasy?: boolean;

	/**眩晕 */
	dizz?: boolean;
	/**沉默 */
	silence?: boolean;
	/**混乱，无秩序 */
	disorder?: boolean;
	/**定身 */
	awe?: boolean;
	/**冻结 */
	freeze?: boolean;
	/**恐惧 */
	fear?: boolean;
	/**免疫伤害 */
	immuneDamage?: boolean;
	/**免疫守护点伤害 */
	immuneGuardDamage?: boolean;
	/**净化 */
	cleansing?: boolean;
	/**隐身 */
	hiding?: boolean;
	/**连击 */
	combo?: boolean;
	/**探查 */
	probe?: boolean;
	/**击退 */
	beatBack?: boolean;
	/**追击 */
	pursueAttack?: boolean;
	/**崩溃 */
	collapse?: boolean;
	/**过载 */
	overload?: boolean;
	/**亡语 */
	deathRattle?: boolean;
	/**空间放逐 */
	exile?: boolean;
	/**麻痹 */
	anesthesia?: boolean;
	/**缠绕 */
	enwind?: boolean;
	/**腐蚀 */
	corrode?: boolean;
}

export interface IAbilityAttributeDefine {
	/**技能当前使用类型 */
	type: AbilityType;
	/**持续时间 不包含前摇后摇(s) */
	duration: number;
	/**前摇时间(s) */
	shakeBefore?: number;
	/**后摇时间(s) */
	shakeBack?: number;
	/**cd (s) */
	cd?: number;
	/**技能触发伤害间隔(s) */
	interval?: number;

	/**消耗定义 */
	cost?: IAbilityCostDefine;
	/**附加特性 */
	subjoin?: IAbilitySubjoinDefine;
	/**天敌技能 */
	naturalEnemyIds?: string[];

	/**无攻击体 */
	noAttack?: boolean;
	/**非智能运行 */
	noAIRun?: boolean;
	/**无特效 */
	noEffect?: boolean;
	/**是否进入间隔伤害触发时候，立即触发一次 */
	firstIntervalAttack?: boolean;

	/**子弹类 互斥：line | melee | action | frisbee */
	bullet?: IAbilityBulletDefine;
	/**线条类 互斥：bullet | melee | action | frisbee */
	line?: IAbilityLineDefine;
	/**近身类 互斥：bullet | line | action | frisbee */
	melee?: IAbilityMeleeDefine;
	/**召唤类 互斥：bullet | line | melee | frisbee */
	action?: IAbilityActionDefine;
	/**飞盘类 互斥：bullet | line | melee | action */
	frisbee?: IAbilityFrisbeeDefine;
}

export interface IAbilityScriptDefine {
	/**技能开始激活触发 */
	onStart?(this: IAbility): void;
	/**技能运行前锁敌 无定义该方法会默认attribute.target定义锁定目标 */
	onTarget?(this: IAbility): void;
	/**技能运行时触发 */
	onRun?(this: IAbility): void;
	/**技能前摇时触发 */
	onStartShakeBefore?(this: IAbility): void;
	/**技能持续触发 */
	onStartDuration?(this: IAbility): void;
	/**技能后摇时触发 */
	onStartShakeBack?(this: IAbility): void;
	/**技能cd时触发 */
	onStartCd?(this: IAbility): void;
	/**技能停止时触发 */
	onStop?(this: IAbility): void;
	/**恢复技能停止 */
	onResume?(this: IAbility): void;
	/**技能cd结束时触发 */
	onEndCd?(this: IAbility): void;
	/**技能结束时触发 */
	onEnd?(this: IAbility): void;
	/**技能拥有者死亡时触发 */
	onDie?(this: IAbility, attack: IAbilityAttack): void;
	/**技能拥有者死亡时全局触发 */
	onWorldDie?(this: IAbility, attack: IAbilityAttack): void;
	/**攻击开始时触发 */
	onAttackStart?(this: IAbility, attack: IAbilityAttack): void;
	/**被攻击开始时触发 */
	onAttackedStart?(this: IAbility, attack: IAbilityAttack): void;
	/**攻击开始时全局触发 */
	onWorldAttackStart?(this: IAbility, attack: IAbilityAttack): void;
	/**攻击中时触发 */
	onAttack?(this: IAbility, attack: IAbilityAttack): void;
	/**被攻击中时触发 */
	onAttacked?(this: IAbility, attack: IAbilityAttack): void;
	/**攻击中时全局触发 */
	onWorldAttack?(this: IAbility, attack: IAbilityAttack): void;
	/**攻击结束时触发 */
	onAttackEnd?(this: IAbility, attack: IAbilityAttack): void;
	/**被攻击结束时触发 */
	onAttackedEnd?(this: IAbility, attack: IAbilityAttack): void;
	/**攻击结束时全局触发 */
	onWorldAttackEnd?(this: IAbility, attack: IAbilityAttack): void;
	/**攻击结算清账 */
	onAttackSettlement?(this: IAbility, attack: IAbilityAttack): void;
	/**攻击结算结束 */
	onCalculateEnd?(this: IAbility, attack: IAbilityAttack): void;
	/**被攻击结算结束 */
	onCalculateedEnd?(this: IAbility, attack: IAbilityAttack): void;

	/**技能响应金币变化 */
	onChangeGold?(this: IAbility): void;
	/**技能响应升级消耗金币变化 */
	onUpCostGold?(this: IAbility): void;
	/**技能响应波次变化 */
	onChangeBatch?(this: IAbility): void;
	/**添加塔 */
	onAddBuilding?(this: IAbility): void;
	/**移除塔 */
	onDelBuilding?(this: IAbility): void;

	/**渲染帧触发 */
	renderUpdate?(this: IAbility, dt: number): void;
	/**逻辑帧触发 */
	logicUpdate?(this: IAbility, dt: number): void;
}

export interface IAbilitySetDefine {
	attribute: IAbilityAttributeDefine;
	effects?: IAbilityEffectDefine[];
	variable?: IAbilityVarDefine;
}

export interface IAbilityDefine {
	id: string;
	name?: string;
	define: IAbilitySetDefine;
	script?: IAbilityScriptDefine;
}
