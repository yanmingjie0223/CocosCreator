import { AbilityData } from '../AbilityData';
import { AbilityParse } from '../AbilityParse';
import { AbilityPool } from '../AbilityPool';
import { AbilityStats } from '../AbilityStats';
import { AbilitySystem } from '../AbilitySystem';

/**
 * 技能全局属性
 */
export const abilityGobal: {
	pool: typeof AbilityPool;
	parse: typeof AbilityParse;
	system: AbilitySystem;
	stats: AbilityStats;
	data: AbilityData;
} = {
	pool: null!,
	parse: null!,
	system: null!,
	stats: null!,
	data: null!
};

/**
 * 清理全局属性
 */
export function clearAbilityGobal() {
	abilityGobal.pool = null!;
	abilityGobal.parse = null!;
	abilityGobal.system = null!;
	abilityGobal.stats = null!;
	abilityGobal.data = null!;
}

/**
 * 技能运行最大时间
 */
export const MAX_TIME = Number.MAX_VALUE;
/**
 * 技能运行最小时间(运行一帧)
 */
export const MIN_TIME = 0.017;
/**
 * 范围目标检测时间
 */
export const TARGET_TEST_TIME = 0.056;
/**
 * buff塔最大增益范围
 */
export const BUFF_BUILDING_MAX_RANGE = 10;
/**
 * 子弹最长飞行时间(s)
 */
export const BULLET_FLY_MAX_TIME = 30;
/**
 * 所有速度最小限制，不可降低到0
 */
export const SPEED_MIN_LIMIT = 0.1;
