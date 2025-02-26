import GlobalModalWaiting from "../../module/preload/GlobalModalWaiting";
import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-21 16:09:28
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-07-01 20:51:48
 */
export default class FguiManager extends Singleton {

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
        const setExtension: Function = fgui.UIObjectFactory.setExtension;
        /**UIConfig配置 */
        setExtension('ui://preload/GlobalModalWaiting', GlobalModalWaiting);
    }

}