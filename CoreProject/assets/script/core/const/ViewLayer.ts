/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-16 17:01:29
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-23 16:12:08
 */
export default class ViewLayer {

    /**
     * view底层
     */
    public static readonly BOTTOM_LAYER: string = 'bottom_layer';
    public static readonly BOTTOM_COMPONENT: fgui.GComponent = new fgui.GComponent();

    /**
     * view中层
     */
    public static readonly MIDDLE_LAYER: string = 'middle_layer';
    public static readonly MIDDLE_COMPONENT: fgui.GComponent = new fgui.GComponent();

    /**
     * view上层
     */
    public static readonly TOP_LAYER: string = 'top_layer';
    public static readonly TOP_COMPONENT: fgui.GComponent = new fgui.GComponent();

    /**
     * 引导层
     */
    public static readonly GUIDE_LAYER: string = 'guide_layer';
    public static readonly GUIDE_COMPONENT: fgui.GComponent = new fgui.GComponent();

    /**
     * 弹窗层
     */
    public static readonly WINDOW_LAYER: string = 'window_layer';
    public static readonly WINDOW_COMPONENT: fgui.GComponent = new fgui.GComponent();

    /**
     * 最外层
     */
    public static readonly MAX_LAYER: string = 'max_layer';
    public static readonly MAX_COMPONENT: fgui.GComponent = new fgui.GComponent();

}