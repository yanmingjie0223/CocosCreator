import {
	abilityGobal,
	IAbility,
	IAbilityGameObject
} from '../implements';

export const createFunctionMap: Map<string, Function> = new Map();

export class AbilityCreateUtils {
	/**
	 * 创建技能
	 * @param abilityId
	 * @param owner
	 * @param targets
	 * @param exertAbility
	 * @returns
	 */
	public static createAbility(
		abilityId: string,
		owner: IAbilityGameObject,
		targets: IAbilityGameObject[],
		exertAbility: IAbility | null = null
	): IAbility | null {
		let ability = null;
		const fun = createFunctionMap.get(abilityId);
		if (fun) {
			ability = fun(owner, targets, exertAbility);
		} else {
			// 没有特殊指定时，使用默认的
			ability = abilityGobal.system.createAbility(abilityId, owner, exertAbility);
			if (ability) {
				ability.targets = targets;
				abilityGobal.system.abilityStartAndRun(ability);
			}
		}
		return ability;
	}

}
