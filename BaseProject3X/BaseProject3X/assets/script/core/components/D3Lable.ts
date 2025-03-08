import { Label, SpriteFrame, SpriteRenderer, _decorator } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('D3Lable')
@executeInEditMode
export class D3Lable extends Label {
	@property(SpriteRenderer)
	public render: SpriteRenderer = null!;

	public start(): void {
		super.onLoad();
		this.updateSF();
	}

	public markForUpdateRenderData(enable = true): void {
		super.markForUpdateRenderData(enable);
		this.updateSF();
	}

	private updateSF(): void {
		if (this._assemblerData) {
			this.updateRenderData();
			this.render.spriteFrame = null;
			this.render.spriteFrame = this.spriteFrame as SpriteFrame;
		}
	}
}
