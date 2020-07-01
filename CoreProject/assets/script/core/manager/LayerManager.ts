import Singleton from "../base/Singleton";
import App from "../App";
import ViewLayer from "../const/ViewLayer";
import { ViewLayerType } from "../const/CoreConst";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 16:20:26
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-07-01 21:54:35
 */
export default class LayerManager extends Singleton {

    public constructor() {
        super();
    }

    /**
     * 初始化
     */
    public init(): void {
        this.initLayer();

        const rootCom: fgui.GComponent = fgui.GRoot.inst;
        rootCom.addChild(ViewLayer.BOTTOM_COMPONENT);
        rootCom.addChild(ViewLayer.MIDDLE_COMPONENT);
        rootCom.addChild(ViewLayer.TOP_COMPONENT);
        rootCom.addChild(ViewLayer.GUIDE_COMPONENT);
        rootCom.addChild(ViewLayer.WINDOW_COMPONENT);
        rootCom.addChild(ViewLayer.MAX_COMPONENT);

        ViewLayer.BOTTOM_COMPONENT.name = ViewLayerType.BOTTOM_LAYER;
        ViewLayer.MIDDLE_COMPONENT.name = ViewLayerType.MIDDLE_LAYER;
        ViewLayer.TOP_COMPONENT.name = ViewLayerType.TOP_LAYER;
        ViewLayer.GUIDE_COMPONENT.name = ViewLayerType.GUIDE_LAYER;
        ViewLayer.WINDOW_COMPONENT.name = ViewLayerType.WINDOW_LAYER;
        ViewLayer.MAX_COMPONENT.name = ViewLayerType.MAX_LAYER;
    }

    /**
     * 获取层级GComponent节点
     * @param layer
     */
    public getLayerComponent(layer: string): fgui.GComponent {
        let layerCom: fgui.GComponent;
        switch (layer) {
            case ViewLayerType.BOTTOM_LAYER:
                layerCom = ViewLayer.BOTTOM_COMPONENT;
                break;
            case ViewLayerType.MIDDLE_LAYER:
                layerCom = ViewLayer.MIDDLE_COMPONENT;
                break;
            case ViewLayerType.TOP_LAYER:
                layerCom = ViewLayer.TOP_COMPONENT;
                break;
            case ViewLayerType.GUIDE_LAYER:
                layerCom = ViewLayer.GUIDE_COMPONENT;
                break;
            case ViewLayerType.WINDOW_LAYER:
                layerCom = ViewLayer.WINDOW_COMPONENT;
                break;
            case ViewLayerType.MAX_LAYER:
                layerCom = ViewLayer.MAX_COMPONENT;
                break;
            default:
                App.DebugUtils.error(`${layer} 是ViewLayer中未定义层级！`);
                break;
        }
        return layerCom;
    }

    /**
     * 初始化view层级
     */
    public initLayer(): void {
        ViewLayer.init();
    }

}