import { _decorator, Component, RenderTexture, MeshRenderer, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DepthMapSetter')
export class DepthMapSetter extends Component {
	@property(RenderTexture)
	renderTexture: RenderTexture = null!;

	@property
	samplerName: string = 'depthTexture';

	start() {
		const material = this.node.getComponent(MeshRenderer)!.sharedMaterial!;
		material.setProperty(this.samplerName, this.renderTexture.window!.framebuffer.depthStencilTexture);
		const pass0 = material.passes[0];
		const bindingIndex = pass0.getBinding(this.samplerName);
		pass0.bindSampler(bindingIndex, director.root!.pipeline.globalDSManager.pointSampler);
	}
}
