import { Layers, Node, UITransform } from "cc";
import Singleton from "../base/Singleton";

export default class DisplayUtils extends Singleton {

	/**
	 * 创建充满父节点的容器节点
	 * @param name
	 * @param parent
	 * @returns
	 */
	public createParentFullNode(name: string, parent: Node): Node {
		const rootUiTransform = parent.getComponent(UITransform);
		const node = new Node();
		node.layer = Layers.BitMask.UI_2D;

		const uiTransform = node.addComponent(UITransform);
		uiTransform.width = rootUiTransform!.width;
		uiTransform.height = rootUiTransform!.height;
		node.name = name;

		parent.addChild(node);

		return node;
	}

}