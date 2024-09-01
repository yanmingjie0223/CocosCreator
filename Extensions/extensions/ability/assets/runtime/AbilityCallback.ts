import { AbilityAttack } from './AbilityAttack';
import { AbilitySystem } from './AbilitySystem';

export class AbilityCallback {
	private _system: AbilitySystem = null!;

	public initialize(system: AbilitySystem): void {
		this._system = system;
	}

	public onChangeGold(): void {
		this._system.abilitys.forEach((curAbility) => {
			if (!curAbility.isEnd()) {
				curAbility.playScript('onChangeGold');
			}
		});
	}

	public onUpCostGold(): void {
		this._system.abilitys.forEach((curAbility) => {
			if (!curAbility.isEnd()) {
				curAbility.playScript('onUpCostGold');
			}
		});
	}

	public onChangeBatch(): void {
		this._system.abilitys.forEach((curAbility) => {
			if (!curAbility.isEnd()) {
				curAbility.playScript('onChangeBatch');
			}
		});
	}

	public onAddBuilding(): void {
		this._system.abilitys.forEach((curAbility) => {
			if (!curAbility.isEnd()) {
				curAbility.playScript('onAddBuilding');
			}
		});
	}

	public onDelBuilding(): void {
		this._system.abilitys.forEach((curAbility) => {
			if (!curAbility.isEnd()) {
				curAbility.playScript('onDelBuilding');
			}
		});
	}

	public onDie(attack: AbilityAttack): void {
		attack.ability.playScript('onDie', attack);
	}

	public onWorldDie(attack: AbilityAttack): void {
		this._system.abilitys.forEach((curAbility) => {
			if (!curAbility.isEnd()) {
				curAbility.playScript('onWorldDie', attack);
			}
		});
	}

	public onAttackStart(attack: AbilityAttack): void {
		attack.ability.playScript('onAttackStart', attack);
	}

	public onAttackedStart(attack: AbilityAttack): void {
		attack.targets.forEach((target) => {
			const abilitys = target.getAbilitys();
			abilitys.forEach((curAbility) => {
				if (!curAbility.isEnd()) {
					curAbility.playScript('onAttackedStart', attack);
				}
			});
		});
	}

	public onWorldAttackStart(attack: AbilityAttack): void {
		this._system.abilitys.forEach((curAbility) => {
			if (!curAbility.isEnd()) {
				curAbility.playScript('onWorldAttackStart', attack);
			}
		});
	}

	public onAttack(attack: AbilityAttack): void {
		attack.ability.playScript('onAttack', attack);
	}

	public onAttacked(attack: AbilityAttack): void {
		attack.targets.forEach((target) => {
			const abilitys = target.getAbilitys();
			abilitys.forEach((curAbility) => {
				if (!curAbility.isEnd()) {
					curAbility.playScript('onAttacked', attack);
				}
			});
		});
	}

	public onWorldAttack(attack: AbilityAttack): void {
		this._system.abilitys.forEach((curAbility) => {
			curAbility.playScript('onWorldAttack', attack);
		});
	}

	public onAttackEnd(attack: AbilityAttack): void {
		attack.ability.playScript('onAttackEnd', attack);
	}

	public onAttackedEnd(attack: AbilityAttack): void {
		attack.targets.forEach((target) => {
			const abilitys = target.getAbilitys();
			abilitys.forEach((curAbility) => {
				if (!curAbility.isEnd()) {
					curAbility.playScript('onAttackedEnd', attack);
				}
			});
		});
	}

	public onWorldAttackEnd(attack: AbilityAttack): void {
		this._system.abilitys.forEach((curAbility) => {
			if (!curAbility.isEnd()) {
				curAbility.playScript('onWorldAttackEnd', attack);
			}
		});
	}

	public onAttackSettlement(attack: AbilityAttack): void {
		attack.ability.playScript('onAttackSettlement', attack);
	}

	public onCalculateEnd(attack: AbilityAttack): void {
		attack.ability.playScript('onCalculateEnd', attack);
	}

	public onCalculateedEnd(attack: AbilityAttack): void {
		attack.targets.forEach((target) => {
			const abilitys = target.getAbilitys();
			abilitys.forEach((curAbility) => {
				if (!curAbility.isEnd()) {
					curAbility.playScript('onCalculateedEnd', attack);
				}
			});
		});
	}
}
