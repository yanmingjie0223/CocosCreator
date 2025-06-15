import { AudioClip, AudioSource, Component, Node, _decorator, clamp } from 'cc';
import { DEBUG } from 'cc/env';
const { ccclass } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
	private static _inst: AudioManager = null!;

	private _musicAudioSource: AudioSource = null!;
	private _effectAudioSources: AudioSource[] = [];
	private _volumeMap: Map<AudioSource, number> = new Map();
	private _isMute: boolean = false;
	private _isMuteMusic: boolean = false;
	private _isMuteSound: boolean = false;
	private _soundEffects: number = 1.0;
	private _masterVolume: number = 1.0;

	public static getInstance(): AudioManager {
		return this._inst;
	}

	public get soundEffects(): number {
		return this._soundEffects;
	}
	public set soundEffects(value: number) {
		this._soundEffects = value;

		for (let i = 0, len = this._effectAudioSources.length; i < len; i++) {
			const as = this._effectAudioSources[i];
			if (as.playing) {
				as.volume = value;
			}
		}
	}

	public get masterVolume(): number {
		return this._masterVolume;
	}
	public set masterVolume(value: number) {
		this._masterVolume = value;
		this._musicAudioSource.volume = value;
	}

	public initialize(isMute: boolean, isMuteMusic: boolean, isMuteSound: boolean): void {
		this._isMute = isMute;
		this._isMuteMusic = isMuteMusic;
		this._isMuteSound = isMuteSound;
	}

	public set isMute(value: boolean) {
		this._isMute = value;
		this.muteMusic(value);
		this.muteSound(value);
	}

	public get isMute(): boolean {
		return this._isMute;
	}

	public set isMuteMusic(value: boolean) {
		if (this._isMuteMusic !== value) {
			this._isMuteMusic = value;
			this.muteMusic(value);
		}
	}

	public get isMuteMusic(): boolean {
		return this._isMuteMusic;
	}

	public set isMuteSound(value: boolean) {
		if (this._isMuteSound !== value) {
			this._isMuteSound = value;
			this.muteSound(value);
		}
	}

	public get isMuteSound(): boolean {
		return this._isMuteSound;
	}

	public playMusic(
		clip: AudioClip,
		loop: boolean = true,
		volume: number = this.masterVolume
	): AudioSource {
		volume = clamp(volume, 0, this.masterVolume);

		const as = this._musicAudioSource;
		as.clip = clip;
		as.loop = loop;
		if (!this._isMute && !this._isMuteMusic) {
			as.volume = volume;
		} else {
			as.volume = 0;
		}
		this._volumeMap.set(this._musicAudioSource, volume);
		as.play();
		return as;
	}

	public closeAll(musicStop: boolean = true): void {
		if (musicStop) {
			const as = this._musicAudioSource;
			as.stop();
		}

		for (let i = 0, len = this._effectAudioSources.length; i < len; i++) {
			const as = this._effectAudioSources[i];
			if (as.playing) {
				as.stop();
				as.clip = null;
			}
		}
	}

	public stopMusic(clip: AudioClip): void {
		const as = this._musicAudioSource;
		if (as && as.clip && as.clip.name === clip.name) {
			as.stop();
		}
	}

	public playSound(
		clip: AudioClip,
		loop: boolean = false,
		volume: number = this._soundEffects
	): AudioSource {
		volume = clamp(volume, 0, this._soundEffects);

		const as = this.getSoundAudioSource();
		as.node.off(AudioSource.EventType.ENDED);
		as.clip = clip;
		as.loop = loop;
		if (!this._isMute && !this._isMuteSound) {
			as.volume = volume;
		} else {
			as.volume = 0;
		}
		this._volumeMap.set(as, volume);
		if (!loop) {
			as.node.once(
				AudioSource.EventType.ENDED,
				() => {
					as.clip = null;
					this._volumeMap.delete(as);
				},
				this
			);
		}
		as.play();
		return as;
	}

	public playOneSound(
		clip: AudioClip,
		loop: boolean = false,
		volume: number = this._soundEffects
	): void {
		volume = clamp(volume, 0, this._soundEffects);

		for (let i = 0, len = this._effectAudioSources.length; i < len; i++) {
			const as = this._effectAudioSources[i];
			if (as.playing && as.clip && clip.name === as.clip.name) {
				as.loop = loop;
				if (!this._isMute && !this._isMuteSound) {
					as.volume = volume;
				} else {
					as.volume = 0;
				}
				this._volumeMap.set(as, volume);
				return;
			}
		}

		this.playSound(clip, loop, volume);
	}

	public stopOneSound(clip: AudioClip): void {
		for (let i = 0, len = this._effectAudioSources.length; i < len; i++) {
			const as = this._effectAudioSources[i];
			if (as.playing && as.clip && clip.name === as.clip.name) {
				as.stop();
				as.clip = null;
				this._volumeMap.delete(as);
			}
		}
	}

	protected onLoad(): void {
		AudioManager._inst = this;
		this._musicAudioSource = this.node.getComponent(AudioSource)!;
		this._effectAudioSources = this.node
			.getComponentsInChildren(AudioSource)
			.filter((a) => a !== this._musicAudioSource);
	}

	private muteMusic(isMute: boolean): void {
		if (isMute) {
			this._musicAudioSource.volume = 0;
		} else {
			let mve = this._volumeMap.get(this._musicAudioSource);
			if (mve === undefined) {
				mve = 1;
			}
			this._musicAudioSource.volume = 1;
		}
	}

	private muteSound(isMute: boolean): void {
		if (isMute) {
			for (let i = 0, len = this._effectAudioSources.length; i < len; i++) {
				const as = this._effectAudioSources[i];
				if (as.clip) {
					as.volume = 0;
				}
			}
		} else {
			for (let i = 0, len = this._effectAudioSources.length; i < len; i++) {
				const as = this._effectAudioSources[i];
				if (as.clip) {
					let asvm = this._volumeMap.get(as);
					if (asvm === undefined) {
						asvm = 1;
					}
					as.volume = asvm;
				}
			}
		}
	}

	private getSoundAudioSource(): AudioSource {
		for (let i = 0, len = this._effectAudioSources.length; i < len; i++) {
			const as = this._effectAudioSources[i];
			if (!as.clip) {
				return as;
			}
		}

		const node = new Node();
		node.name = 'Sound';
		this.node.addChild(node);
		const asCom = node.addComponent(AudioSource);
		asCom.playOnAwake = false;
		asCom.loop = false;
		asCom.volume = 1;
		this._effectAudioSources.push(asCom);

		if (DEBUG) {
			const len = this._effectAudioSources.length;
			if (len > 15) {
				console.warn(`${len}个音源 检查是否存在不合理的播放导致数量增多`);
			}
		}

		return asCom;
	}
}
