import { Status } from '../../../core/assets/runtime/status/Status';
import { AbilitySystem } from './AbilitySystem';
import { IAbilityAttack, IAbilitySound } from './interface/IBase';
import { IAbilitySoundDefine, RunStatus } from './interface/IStruct';

export class AbilitySound implements IAbilitySound {
	private _attack: IAbilityAttack | null = null!;
	private _data: IAbilitySoundDefine = null!;
	private _runStatus: Status<RunStatus> = new Status();
	private _rate: number = 1;
	private _totalDt: number = 0;

	public set rate(value: number) {
		if (this._rate !== value) {
			this._rate = value;
			// todo: set play rate
		}
	}

	public get rate(): number {
		return this._rate;
	}

	public get runStatus(): Status<RunStatus> {
		return this._runStatus;
	}

	public get system(): AbilitySystem | null {
		if (this._attack) {
			return this._attack.system;
		}
		return null;
	}

	public get abilityAttack(): IAbilityAttack | null {
		return this._attack;
	}

	public initialize(attack: IAbilityAttack | null, data: IAbilitySoundDefine): void {
		this._attack = attack;
		this._data = data;
		this._runStatus.setStatus(RunStatus.start);
	}

	public isEnd(): boolean {
		return this._runStatus.isStatus(RunStatus.end);
	}

	public renderUpdate(dt: number): void {}

	public logicUpdate(dt: number): void {
		this._totalDt += dt;
		// 延迟播放
		if (this._runStatus.isStatus(RunStatus.start)) {
			const delay = this._data.delay ? this._data.delay : 0;
			if (this._totalDt >= delay) {
				this._runStatus.setStatus(RunStatus.run);
				const url = this._data.url;
				const single = this._data.single;
				// const audioManager = AudioManager.getInstance<AudioManager>();
				// if (single && audioManager.checkExistSoundPlay(url)) {
				// 	return;
				// }

				// const times = this._data.times ? this._data.times : 1;
				// audioManager.playSound(
				// 	url,
				// 	times,
				// 	() => {
				// 		this._runStatus.setStatus(RunStatus.end);
				// 	},
				// 	this
				// );
			}
		}
	}

	public clear(): void {
		this._data = null!;
		this._attack = null!;
		this._runStatus.clear();
	}

	public destroy(): void {
		this.clear();
	}
}
