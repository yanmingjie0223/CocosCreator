import { Node } from "cc";
import Singleton from "../base/Singleton";
import { ViewLayerType } from "../const/ViewConst";
import DebugUtils from "../utils/DebugUtils";
import DisplayUtils from "../utils/DisplayUtils";

export default class LayerManager extends Singleton {

	private BOTTOM_COMPONENT: Node = null!;
	private MIDDLE_COMPONENT: Node = null!;
	private TOP_COMPONENT: Node = null!;
	private GUIDE_COMPONENT: Node = null!;
	private WINDOW_COMPONENT: Node = null!;
	private MAX_COMPONENT: Node = null!;

	/**
	 * 初始化
	 */
	public initialize(uiroot: Node): void {
		const displayUtils = DisplayUtils.getInstance<DisplayUtils>();
		this.BOTTOM_COMPONENT = displayUtils.createParentFullNode(ViewLayerType.BOTTOM_LAYER, uiroot);
		this.MIDDLE_COMPONENT = displayUtils.createParentFullNode(ViewLayerType.MIDDLE_LAYER, uiroot);
		this.TOP_COMPONENT = displayUtils.createParentFullNode(ViewLayerType.TOP_LAYER, uiroot);
		this.GUIDE_COMPONENT = displayUtils.createParentFullNode(ViewLayerType.GUIDE_LAYER, uiroot);
		this.WINDOW_COMPONENT = displayUtils.createParentFullNode(ViewLayerType.WINDOW_LAYER, uiroot);
		this.MAX_COMPONENT = displayUtils.createParentFullNode(ViewLayerType.MAX_LAYER, uiroot);
	}

	/**
	 * 获取层级GComponent节点
	 * @param {string} layer
	 */
	public getLayerNode(layer: string): Node {
		let layerNode: Node = this.BOTTOM_COMPONENT;
		switch (layer) {
			case ViewLayerType.BOTTOM_LAYER:
				layerNode = this.BOTTOM_COMPONENT;
				break;
			case ViewLayerType.MIDDLE_LAYER:
				layerNode = this.MIDDLE_COMPONENT;
				break;
			case ViewLayerType.TOP_LAYER:
				layerNode = this.TOP_COMPONENT;
				break;
			case ViewLayerType.GUIDE_LAYER:
				layerNode = this.GUIDE_COMPONENT;
				break;
			case ViewLayerType.WINDOW_LAYER:
				layerNode = this.WINDOW_COMPONENT;
				break;
			case ViewLayerType.MAX_LAYER:
				layerNode = this.MAX_COMPONENT;
				break;
			default:
				const debugUtils = DebugUtils.getInstance<DebugUtils>();
				debugUtils.error(`${layer} 是ViewLayer中未定义层级!`);
				break;
		}
		return layerNode;
	}

}