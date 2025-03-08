import {
	CCInteger,
	Component,
	Renderer,
	Sprite,
	SpriteFrame,
	Texture2D,
	VideoClip,
	VideoPlayer,
	_decorator,
	gfx
} from 'cc';
import { JSB } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('VideoSprite')
export class VideoSprite extends Component {
	@property({ type: VideoPlayer }) private videoPlayer: VideoPlayer = null!;
	@property({ type: Renderer }) private vSprite: Renderer = null!;
	@property private videoWidth: number = 1920;
	@property private videoHeight: number = 1080;
	@property([CCInteger]) private materials: number[] = [];

	private _isPlaying: boolean = false;
	private _texture0: Texture2D = new Texture2D();

	public set clip(clip: VideoClip) {
		this.videoPlayer.clip = clip;
	}

	public getVideoPlayer(): VideoPlayer {
		return this.videoPlayer;
	}

	public play(): void {
		this._initRenderTexture([this.vSprite]);
		this._isPlaying = true;
		this.videoPlayer.node.active = true;
		this.videoPlayer.play();
	}

	public resmue(): void {
		this._isPlaying = true;
		this.videoPlayer.resume();
	}

	public stop(): void {
		this._isPlaying = false;
		this.videoPlayer.clip = null!;
		this.videoPlayer.stop();
	}

	public onResize(): void {
		(this.videoPlayer as any)._impl.syncMatrix();
	}

	protected update(): void {
		if (!this._isPlaying && !this.videoPlayer.node.active) {
			return;
		}

		// @ts-ignore
		const ele = this.videoPlayer._impl._video as any;
		if (ele) {
			this._texture0.uploadData(ele);
			this._updateMaterial([this.vSprite]);
		}
	}

	private _updateMaterial(renders: Renderer[]): void {
		if (this.materials.length > 0) {
			this.materials.forEach((material) => {
				const mat = this.vSprite.getRenderMaterial(material);
				if (mat) {
					mat.setProperty('mainTexture', this._texture0);
				}
			});
		} else {
			for (let i = 0; i < renders.length; i++) {
				const render = renders[i];
				const material = render.material;
				if (material) {
					material.setProperty('texture0', this._texture0);
				}
			}
		}
	}

	/**
	 * 初始化材质贴图
	 */
	private _initRenderTexture(renders: Renderer[]) {
		for (let i = 0; i < renders.length; i++) {
			const render = renders[i];
			if (render instanceof Sprite) {
				const sprite: Sprite = render;
				if (sprite.spriteFrame === null) {
					sprite.spriteFrame = new SpriteFrame();
				}
				let texture = new Texture2D();
				this._resetTexture(texture, this.videoWidth, this.videoHeight);
				sprite.spriteFrame.texture = texture;
			}
		}

		this._resetTexture(this._texture0, this.videoWidth, this.videoHeight);

		if (this.materials.length > 0) {
			this.materials.forEach((material) => {
				const mat = this.vSprite.getRenderMaterial(material);
				if (mat) {
					mat.setProperty('mainTexture', this._texture0);
				}
			});
		} else {
			for (let i = 0; i < renders.length; i++) {
				const render = renders[i];
				const material = render?.material;
				material?.setProperty('texture0', this._texture0);
			}
		}
	}

	/**
	 * 重置贴图状态
	 * @param texture 贴图
	 * @param width 宽
	 * @param height 高
	 */
	private _resetTexture(texture: Texture2D, width: number, height: number, format?: number) {
		texture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
		texture.setMipFilter(Texture2D.Filter.LINEAR);
		texture.setWrapMode(Texture2D.WrapMode.CLAMP_TO_EDGE, Texture2D.WrapMode.CLAMP_TO_EDGE);

		texture.reset({
			width: width,
			height: height,
			format: format ? format : JSB ? gfx.Format.R8 : gfx.Format.RGB8
		});
	}
}
