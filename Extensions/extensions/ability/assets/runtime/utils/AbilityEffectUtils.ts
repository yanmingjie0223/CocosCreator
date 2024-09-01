import { Node } from 'cc';

export class AbilityEffectUtils {
	/**
	 * 销毁节点
	 * @param node
	 */
	public static destroy(node: Node | null): void {
		if (node) {
			node.removeFromParent();
			node.destroyAllChildren();
			node.destroy();
		}
	}
}
