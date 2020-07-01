/*
 * @Author: yanmingjie
 * @Date: 2020-07-01 21:45:39
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-07-01 21:54:10
 */
export interface ResFile {
    url: string,
    type: typeof cc.Asset
}

export const enum FitType {
    /**
     * 水平
     */
    ALIGN_CENTER = 'center',
    ALIGN_LEFT = 'left',
    ALIGN_RIGHT = 'right',
    /**
     * 垂直
     */
    ALIGN_MIDDLE = 'middle',
    ALIGN_TOP = 'top',
    ALIGN_BOTTOM = 'buttom',
}

export const enum I18nType {
    ZH = 'zh', // 中文
    EN = 'en', // 英文
}

export const enum PlatformType {
    // web
    WEB = 'web',
    // native
    NATIVE = 'native',
    // wx mini game
    WX = 'wx',
    // qq mini game
    QQ = 'qq',
}

export const enum ViewLayerType {
    /**
     * view底层类型
     */
    BOTTOM_LAYER = 'bottom_layer',
    /**
     * view中层类型
     */
    MIDDLE_LAYER = 'middle_layer',
    /**
     * view上层类型
     */
    TOP_LAYER = 'top_layer',
    /**
     * 引导层类型
     */
    GUIDE_LAYER = 'guide_layer',
    /**
     * 弹窗层类型
     */
    WINDOW_LAYER = 'window_layer',
    /**
     * 最外层类型
     */
    MAX_LAYER = 'max_layer',
}

export const enum ViewShowType {
    /**
     * 显示在单个弹窗中，该弹窗会逐个弹出
     */
    SINGLETON_VIEW = 1,
    /**
     * 多个界面堆积显示，默认是该显示类型
     */
    MULTI_VIEW = 2
}

export const enum ViewType {
    /**
     * view界面
     */
    VIEW = 1,
    /**
     * 弹窗界面无黑色蒙层，有底层点击
     */
    WINDOW = 2,
    /**
     * 弹窗且有蒙层界面
     */
    X_WINDOW = 3,
}

export const enum ViewEvent {
    /**
     * 显示view事件
     */
    VIEW_SHOW = 'view_show',
    /**
     * 关闭view事件
     */
    VIEW_CLOSE = 'view_close',
    /**
     * 逐个弹窗结束
     */
    WINDOW_CLOSE = 'window_close',
}