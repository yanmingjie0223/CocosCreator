import Singleton from "../base/Singleton";
import GlobalModalWaiting from "../../module/preload/GlobalModalWaiting";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-21 16:09:28
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-25 19:22:13
 */
export default class FguiManager extends Singleton {

    public constructor() {
        super();
    }

    public init(): void {
        this.bindComponent();
    }

    /**
     * 初始化设置
     */
    public initConfig(): void {
        fgui.UIConfig.defaultFont = '微软雅黑';
        fgui.UIConfig.globalModalWaiting = 'ui://preload/GlobalModalWaiting';
        fgui.UIConfig.windowModalWaiting = 'ui://preload/GlobalModalWaiting';
    }

    /**
     * 绑定fgui到类
     */
    private bindComponent(): void {
        // UIConfig配置
        fgui.UIObjectFactory.setExtension('ui://preload/GlobalModalWaiting', GlobalModalWaiting);

    }

}