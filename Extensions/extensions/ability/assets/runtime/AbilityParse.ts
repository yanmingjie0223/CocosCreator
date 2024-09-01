import { IAbility } from './interface/IBase';
import {
	AttackDamage,
	IAbilityDefine
} from './interface/IStruct';

const abilityDefine: Map<string, IAbilityDefine> = new Map();
export function registerAbility(ability: IAbilityDefine): void {
	const id = ability.id;
	if (!abilityDefine.get(id)) {
		abilityDefine.set(id, ability);
	} else {
		console.error(`{${id}} multiple registration skill`);
	}
}

export class AbilityParse {
	/**
	 * 获取技能定义
	 * @param abilityId
	 * @returns
	 */
	public static getAbilityDefine(abilityId: string): IAbilityDefine | null {
		const define = abilityDefine.get(abilityId);
		if (!define) {
			console.error(`{${abilityId}} not register! `);
			return null;
		}

		return define;
	}

	/**
	 * 解析攻击体
	 * @param ability
	 */
	public static parseAttack(ability: IAbility): void {

	}

	/**
	 * 解析结算
	 * @param damages
	 * @returns 死亡数量
	 */
	public static parseSettlement(damages: AttackDamage[]): number {
		let dieCount: number = 0;
		damages.forEach((damage) => {
			const target = damage.target;
			if (target && !target.isDeath()) {
				if (damage.shield !== 0) {
					target.onSheildHp(damage.shield);
				}
				if (damage.armor !== 0) {
					target.onArmorHp(damage.armor);
				}
				if (damage.hp !== 0) {
					target.onHp(damage.hp, damage.isCrit);
				}
			}
		});
		return dieCount;
	}
}
