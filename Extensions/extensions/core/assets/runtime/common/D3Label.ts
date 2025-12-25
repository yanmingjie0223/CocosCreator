import { ImageAsset, Label, SpriteFrame, SpriteRenderer, Texture2D, _decorator } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('D3Label')
@executeInEditMode
export class D3Label extends Label {
	@property(SpriteRenderer)
	public render: SpriteRenderer = null!;

	public markForUpdateRenderData(enable: boolean = true): void {
		super.markForUpdateRenderData(enable);
		this.updateSF();
	}

	public setString(str: string): void {
		this.string = str;
		this.updateSF();
	}

	protected start(): void {
		this.updateSF();
	}

	private updateSF(): void {
		if (this._assemblerData) {
			// 更新data
			this.updateRenderData(true);
			// 更新spriteFrame
			this._ttfSpriteFrame = new SpriteFrame();
			this._assemblerData = (this._assembler as any).getAssemblerData();
			const image = new ImageAsset(this._assemblerData!.canvas);
			const texture = new Texture2D();
			texture.image = image;
			this._ttfSpriteFrame.texture = texture;
			// 处理3d显示
			this.render.spriteFrame = null;
			this.render.spriteFrame = this.spriteFrame as SpriteFrame;
		}
	}
}
