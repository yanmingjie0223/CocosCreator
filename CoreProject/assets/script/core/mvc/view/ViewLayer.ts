/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-16 17:01:29
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-16 17:35:28
 */
export default class ViewLayer {

    /**
     * view底层
     */
    public static readonly BOTTOM_LAYER: string = 'bottom_layer';
    public static readonly BOTTOM_NODE: cc.Node = new cc.Node();

    /**
     * view中层
     */
    public static readonly MIDDLE_LAYER: string = 'middle_layer';
    public static readonly MIDDLE_NODE: cc.Node = new cc.Node();

    /**
     * view上层
     */
    public static readonly TOP_LAYER: string = 'top_layer';
    public static readonly TOP_NODE: cc.Node = new cc.Node();

    /**
     * 引导层
     */
    public static readonly GUIDE_LAYER: string = 'guide_layer';
    public static readonly GUIDE_NODE: cc.Node = new cc.Node();

    /**
     * 弹窗层
     */
    public static readonly WINDOW_LAYER: string = 'window_layer';
    public static readonly WINDOW_NODE: cc.Node = new cc.Node();

    /**
     * 最外层
     */
    public static readonly MAX_LAYER: string = 'max_layer';
    public static readonly MAX_NODE: cc.Node = new cc.Node();

}