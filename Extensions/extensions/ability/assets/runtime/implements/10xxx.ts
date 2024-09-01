import {
	AbilityType,
	FPS_RATE,
	registerAbility
} from './index';

/**
 * 10001 主角技能第一击
 */
registerAbility({
	id: '10001',
	define: {
		attribute: {
			type: AbilityType.character,
			duration: 0.6 / FPS_RATE,
			interval: 0.3 / FPS_RATE,
			noEffect: true,
			action: {
				type: 'owner'
			}
		},
		effects: [
			{
				url: 'effect/DD_attack/dd_attack1'
			}
		]
	},
	script: {
		onAttackStart(attack) {
		},
		onAttackSettlement(attack) {
		}
	}
});
