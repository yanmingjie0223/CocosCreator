import { IAbilityGameObject, IAbilityStatsData, IAbilityStatsTarget } from './interface/IBase';
import { AbilityUtils } from './utils/AbilityUtils';

export class AbilityStats {
	private _targetMap: Map<string, IAbilityStatsTarget> = new Map();
	private _dataMap: Map<string, IAbilityStatsData> = new Map();

	/**
	 * 加入游戏目标角色统计
	 * @param go
	 */
	public pushTarget(go: IAbilityGameObject): void {
		const vo = go.vo;
		if (!vo) {
			return;
		}

		const attribute = vo.getAttribute();
		let target = this.getTarget(go);
		target.id = attribute.id;
		target.lv = attribute.lv ? attribute.lv : 1;
		target.exp = attribute.exp ? attribute.exp : 0;
	}

	/**
	 * 加入伤害统计
	 * @param go
	 * @param damage
	 */
	public pushAtk(go: IAbilityGameObject, damage: number): void {
		const data = this.getData(go);
		data.atk += damage;
	}

	/**
	 * 加入承受伤害统计
	 * @param go
	 * @param takeDamage
	 */
	public pushTakeDamage(go: IAbilityGameObject, takeDamage: number): void {
		const data = this.getData(go);
		data.takeDamage += takeDamage;
	}

	/**
	 * 加入血量统计
	 * @param go
	 * @param hp
	 */
	public pushHp(go: IAbilityGameObject, hp: number): void {
		const data = this.getData(go);
		data.hp += hp;
	}

	/**
	 * 加入盾统计
	 * @param go
	 * @param shield
	 */
	public pushShield(go: IAbilityGameObject, shield: number): void {
		const data = this.getData(go);
		data.shield += shield;
	}

	/**
	 * 加入甲统计
	 * @param go
	 * @param armor
	 */
	public pushArmor(go: IAbilityGameObject, armor: number): void {
		const data = this.getData(go);
		data.armor += armor;
	}

	public destroy(): void {
		this._targetMap.clear();
		this._dataMap.clear();
	}

	private getData(go: IAbilityGameObject): IAbilityStatsData {
		const key = AbilityUtils.getStatsKey(go);
		if (!this._targetMap.get(key)) {
			this.pushTarget(go);
		}

		let data = this._dataMap.get(key);
		if (!data) {
			data = {
				atk: 0,
				takeDamage: 0,
				hp: 0,
				shield: 0,
				armor: 0
			};
			this._dataMap.set(key, data);
		}
		return data;
	}

	private getTarget(go: IAbilityGameObject): IAbilityStatsTarget {
		const key = AbilityUtils.getStatsKey(go);
		let target = this._targetMap.get(key);
		if (!target) {
			target = {
				type: go.getGameObjectType(),
				pId: go.getPlayer().uId,
				uId: go.uId,
				id: '',
				lv: 1,
				exp: 0
			};
			this._targetMap.set(key, target);
		}
		return target;
	}
}
