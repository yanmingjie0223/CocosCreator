import Singleton from "../base/Singleton";
import App from "../App";
import ViewLayer from "../mvc/view/ViewLayer";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 16:20:26
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-18 20:04:19
 */
export default class LayerManager extends Singleton {

    public constructor() {
        super();
    }

    public init(): void {
        const stageNode: cc.Node = App.StageManager.stageNode;
        stageNode.addChild(ViewLayer.BOTTOM_NODE);
        stageNode.addChild(ViewLayer.MIDDLE_NODE);
        stageNode.addChild(ViewLayer.TOP_NODE);
        stageNode.addChild(ViewLayer.GUIDE_NODE);
        stageNode.addChild(ViewLayer.WINDOW_NODE);
        stageNode.addChild(ViewLayer.MAX_NODE);
    }

    public getLayerNode(layer: string): cc.Node {
        let layerNode: cc.Node;
        switch (layer) {
            case ViewLayer.BOTTOM_LAYER:
                layerNode = ViewLayer.BOTTOM_NODE;
                break;
            case ViewLayer.MIDDLE_LAYER:
                layerNode = ViewLayer.MIDDLE_NODE;
                break;
            case ViewLayer.TOP_LAYER:
                layerNode = ViewLayer.TOP_NODE;
                break;
            case ViewLayer.GUIDE_LAYER:
                layerNode = ViewLayer.GUIDE_NODE;
                break;
            case ViewLayer.WINDOW_LAYER:
                layerNode = ViewLayer.WINDOW_NODE;
                break;
            case ViewLayer.MAX_LAYER:
                layerNode = ViewLayer.MAX_NODE;
                break;
        }
        return layerNode;
    }

}