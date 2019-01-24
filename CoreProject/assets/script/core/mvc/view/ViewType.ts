/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 21:12:30
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-18 14:48:52
 */
export default class ViewType {

    /**
     * view界面
     */
    public static readonly VIEW: number = 1;

    /**
     * 弹窗界面
     */
    public static readonly WINDOW: number = 2;

    /**
     * 弹窗且有蒙层界面
     */
    public static readonly X_WINDOW: number = 3;

}

export class ViewShowType {

    /**
     * 显示在单个弹窗中，该弹窗会逐个弹出
     */
    public static readonly SINGLETON_VIEW: number = 1;

    /**
     * 多个界面堆积显示，默认是该显示类型
     */
    public static readonly MULTI_VIEW: number = 2;

}