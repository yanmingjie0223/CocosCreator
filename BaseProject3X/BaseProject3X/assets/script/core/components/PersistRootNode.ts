import { _decorator, Component, director } from 'cc';

@_decorator.ccclass('PersistRootNode')
export class PersistRootNode extends Component {
	public setPersistRootNode(isPersist: boolean): void {
		if (isPersist) {
			const curIs = director.isPersistRootNode(this.node);
			if (!curIs) {
				director.addPersistRootNode(this.node);
			}
		}
	}

	protected onLoad(): void {
		this.setPersistRootNode(true);
	}
}
