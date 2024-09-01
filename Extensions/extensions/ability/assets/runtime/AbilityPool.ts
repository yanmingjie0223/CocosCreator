import { assetManager, instantiate, Node, Pool, Prefab } from 'cc';
import { Ability } from './Ability';
import { AbilityAttack } from './AbilityAttack';
import { AbilityEffectUtils } from './utils/AbilityEffectUtils';
import { AbilitySound } from './AbilitySound';
import {
	IAbility,
	IAbilityAttack,
	IAbilityEffect,
	IAbilityGameObject,
	IAbilitySound
} from './interface/IBase';
import { AttackDamage, EffectType } from './interface/IStruct';

export class AbilityPool {
	private static _soundPool: Pool<IAbilitySound> = new Pool(
		() => {
			return new AbilitySound();
		},
		20,
		(obj: IAbilitySound) => {
			obj.destroy();
		}
	);
	private static _abilityPool: Pool<IAbility> = new Pool(
		() => {
			return new Ability();
		},
		20,
		(obj: IAbility) => {
			obj.destroy();
		}
	);
	private static _abilityAttackPool: Pool<IAbilityAttack> = new Pool(
		() => {
			return new AbilityAttack();
		},
		20,
		(obj: IAbilityAttack) => {
			obj.destroy();
		}
	);
	private static _damegePool: AttackDamage[] = [];
	private static _nodePool: Map<string, Node[]> = new Map();
	private static _effectPool: Map<EffectType, IAbilityEffect[]> = new Map();

	public static allocSound(): IAbilitySound {
		return this._soundPool.alloc();
	}
	public static freeSound(sound: IAbilitySound): void {
		if (sound) {
			sound.clear();
			this._soundPool.free(sound);
		}
	}

	public static allocEffect(type: EffectType): IAbilityEffect | undefined {
		const effects = this._effectPool.get(type);
		if (effects) {
			return effects.pop();
		}
	}
	public static freeEffect(effect: IAbilityEffect): void {
		if (effect) {
			effect.clear();
			let effects = this._effectPool.get(effect.type);
			if (!effects) {
				effects = [];
				this._effectPool.set(effect.type, effects);
			}
			effects.push(effect);
		}
	}

	public static allocAbility(): IAbility {
		return this._abilityPool.alloc();
	}
	public static freeAbility(ablity: IAbility): void {
		if (ablity) {
			ablity.clear();
			this._abilityPool.free(ablity);
		}
	}

	public static allocAttack(): IAbilityAttack {
		return this._abilityAttackPool.alloc();
	}
	public static freeAttack(attack: IAbilityAttack): void {
		if (attack) {
			attack.clear();
			this._abilityAttackPool.free(attack);
		}
	}

	public static allocDamage(attack: IAbilityAttack, target: IAbilityGameObject): AttackDamage {
		let damage = this._damegePool.pop();
		if (!damage) {
			damage = {
				attack: attack,
				owner: attack.owner,
				target: target,
				atkAttribute: null,
				tatAttribute: null,
				atk: 0,
				hp: 0,
				shield: 0,
				armor: 0,
				mp: 0,
				crit: 0,
				isCrit: false
			};
		} else {
			damage.attack = attack;
			damage.owner = attack.owner;
			damage.target = target;
		}
		return damage;
	}
	public static allocDamageHp(
		attack: IAbilityAttack,
		target: IAbilityGameObject,
		hp: number
	): AttackDamage {
		const damage = this.allocDamage(attack, target);
		damage.hp = hp;
		return damage;
	}
	public static freeDamage(damage: AttackDamage): void {
		if (damage) {
			damage.attack = null;
			damage.owner = null;
			damage.target = null;
			damage.atkAttribute = null;
			damage.tatAttribute = null;
			damage.atk = 0;
			damage.hp = 0;
			damage.shield = 0;
			damage.armor = 0;
			damage.mp = 0;
			damage.crit = 0;
			damage.isCrit = false;
			this._damegePool.push(damage);
		}
	}
	public static freeDamages(damages: AttackDamage[]): void {
		damages.forEach((damage) => {
			this.freeDamage(damage);
		});
	}

	public static allocNode(url: string): Node | null {
		let node: Node | null = null;
		const nodes = this._nodePool.get(url);
		if (nodes) {
			node = nodes.pop()!;
		}
		if (!node) {
			const bundle = assetManager.getBundle('prefabs');
			const prefab = bundle?.get<Prefab>(url);
			if (!prefab) {
				console.error(`not found prefab: ${url}`);
				return null;
			}
			node = instantiate(prefab);
		}
		return node;
	}
	public static freeNode(url: string | null, node: Node | null): void {
		if (url && node) {
			node.removeFromParent();
			node.setPosition(0, 0, 0);
			node.setScale(1, 1, 1);
			node.active = true;
			let nodes = this._nodePool.get(url);
			if (!nodes) {
				nodes = [];
				this._nodePool.set(url, nodes);
			}
			nodes.push(node);
		}
	}

	public static destroy(): void {
		this._soundPool.destroy();
		this._abilityPool.destroy();
		this._abilityAttackPool.destroy();
		this._damegePool.length = 0;
		this._nodePool.forEach((nodes) => {
			nodes.forEach((node) => {
				AbilityEffectUtils.destroy(node);
			});
		});
		this._nodePool.clear();
		this._effectPool.clear();
	}
}
