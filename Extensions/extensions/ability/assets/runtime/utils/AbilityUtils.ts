import { IAbilityGameObject } from '../implements';
import { IAbilityDefine } from '../interface/IStruct';

export class AbilityUtils {
	/**
	 * 获取该游戏角色统计key
	 * @param go
	 * @returns
	 */
	public static getStatsKey(go: IAbilityGameObject): string {
		return `${go.getPlayer().uId}_${go.getGameObjectType()}_${go.uId}`;
	}

	/**
	 * 检测是否存在天敌技能
	 * @param define
	 * @param go
	 * @returns
	 */
	public static checkHasNaturalEnemyAbility(
		define: IAbilityDefine,
		go: IAbilityGameObject
	): boolean {
		const abilityIds = define.define.attribute.naturalEnemyIds;
		if (abilityIds) {
			const abilitys = go.getAbilitys();
			for (let i = 0, len = abilitys.length; i < len; ++i) {
				const ability = abilitys[i];
				if (ability.isActive()) {
					const index = abilityIds.indexOf(abilitys[i].id);
					if (index !== -1) {
						return true;
					}
				}
			}
		}
		return false;
	}
}
