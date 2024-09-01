import * as i18n from './LanguageData';
import { _decorator, Component, Material, MeshRenderer } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('LocalizedMaterialItem')
class LocalizedMaterialItem {
	@property
	language: string = 'zh';
	@property({
		type: Material
	})
	material: Material = null!;
}

@ccclass('LocalizedMaterial')
@executeInEditMode
export class LocalizedMaterial extends Component {
	mesh: MeshRenderer = null!;
	@property({
		type: LocalizedMaterialItem
	})
	materialsList = [];

	onLoad() {
		if (!i18n.ready) {
			i18n.init('zh');
		}
		this.fetchRender();
	}

	fetchRender() {
		let mesh = this.getComponent(MeshRenderer);
		if (mesh) {
			this.mesh = mesh;
			this.updateMat();
			return;
		}
	}

	updateMat() {
		for (let i = 0; i < this.materialsList.length; i++) {
			const item = this.materialsList[i];
			// @ts-ignore
			if (item.language === i18n._language) {
				// @ts-ignore
				this.mesh && this.mesh.setSharedMaterial(item.material, 0);
			}
		}
	}
}
