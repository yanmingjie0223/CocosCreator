/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-25 14:03:49
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-25 14:04:11
 */

/**
 * 用户数据
 */
interface UserInfo {
    avatarUrl: string,   // 用户头像图片 url
    city: string,        // 用户所在城市
    country: string,     // 用户所在国家
    gender: number,      // 用户性别 0：女  1：男
    language: string,    // 显示 country province city 所用的语言
    nickName: string,    // 用户昵称
    openId: string,      // 用户 openId
    province: string,    // 用户所在省份
}

/**
 * key value数据单元
 */
interface KVData {
    key: string,
    value: string
}

/**
 * 获取的个人信息
 */
interface UserGameData {
    avatarUrl: string,
    nickname: string,
    openid: string,
    KVDataList: KVData[];
}

/**
 * 设备信息
 */
interface SystemInfo {
    brand: string,	        // 手机品牌>= 1.5.0
    model: string,	        // 手机型号
    pixelRatio: number,	    // 设备像素比
    screenWidth: number,	// 屏幕宽度	>= 1.1.0
    screenHeight: number,	// 屏幕高度	>= 1.1.0
    windowWidth: number,	// 可使用窗口宽度
    windowHeight: number,	// 可使用窗口高度
    language: string,	    // 微信设置的语言
    version: string,	    // 微信版本号
    system: string,	        // 操作系统版本
    platform: string,	    // 客户端平台
    fontSizeSetting: number,// 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px。	>= 1.5.0
    SDKVersion: string,	    // 客户端基础库版本	>= 1.1.0
    benchmarkLevel: number,	// 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好(目前设备最高不到50)	>= 1.8.0
    battery: number,	    // 电量，范围 1 - 100	>= 1.9.0
    wifiSignal: number	    // wifi 信号强度，范围 0 - 4	>= 1.9.0
}

/**
 * 游戏圈按钮
 */
declare class GameClubButton {
    /**
     * 显示
     */
    show();
    /**
     * 隐藏
     */
    hide();
}

/**
 * 用户授权按钮
 */
declare class UserInfoButton {
    /**
     * 显示
     */
    show();
    /**
     * 隐藏
     */
    hide();
    /**
     * 点击
     */
    onTap(callback: (res: UserInfo) => {});
}

declare class OpenDataContext {

    /**
     * 向开放域发送数据
     *
     * @param message
     */
    postMessage(message: any);

}

declare module wx {

    /**
     * 获取设备信息
     *
     * @param object
     */
    function getSystemInfo(object: {
        success?: (res: SystemInfo) => {} | void;
        fail?: Function;
        complete?: Function;
    });

    /**
     * 获取用户信息按钮
     *
     * @param object
     */
    function createUserInfoButton(object: {
        type: string,
        text: string,
        style: {
            left: number,			    // 左上角横坐标
            top: number,			    // 左上角纵坐标
            width: number,			    // 宽度
            height: number,			    // 高度
            backgroundColor: string,	// 背景颜色
            borderColor: string,		// 边框颜色
            borderWidth: number,		// 边框宽度
            borderRadius: number,		// 边框圆角
            textAlign: string,			// 文本的水平居中方式
            fontSize: number,			// 字号
            lineHeight: number			// 文本的行高
        }
    }): UserInfoButton;

    /**
     * 创建游戏圈按钮
     *
     * @param object
     */
    function createGameClubButton(object: {
        type: "text" | "image",
        text?: string,
        image?: string,
        style: {
            left: number,
            top: number,
            width: number,
            height: number,
            backgroundColor?: string,
            borderColor?: string,
            borderWidth?: number,
            borderRadius?: number,
            textAlign?: "left" | "center" | "right",
            fontSize?: number,
            lineHeight?: number,
        },
        icon: "green" | "white" | "datk" | "light";
    }): GameClubButton;

    /**
     * 打开客服聊天界面
     */
    function openCustomerServiceConversation();

    /**
     * 获取开放域数据
     */
    function getOpenDataContext(): OpenDataContext;

    /**
     * 接收主域发送来的数据
     *
     * @param message
     */
    function onMessage(callback: (message: any) => void);

    /**
     * 获取用户点击进入信息
     */
    function getLaunchOptionsSync(): {scene: number, query: Object, isSticky: boolean, shareTicket: string};

    /**
     * 登录微信获取code
     *
     * @param object
     */
    function login(object: {
        success?: (res: { code: string }) => {} | void;
        fail?: Function;
        complete?: Function;
    });

    /**
     * 登录态验证
     *
     * @param object
     */
    function checkSession(object: {
        success?: (res: SystemInfo) => {} | void;
        fail?: Function;
        complete?: Function;
    });

    /**
     * 发送http请求
     *
     * @param object
     */
    function request(object: {
        url: string,            // 请求链接
        data?: string | Object, // 请求的参数
        header?: Object,        // 设置请求的 header，header 中不能设置 Referer
        method?: string,        // HTTP 请求方法
        dataType?: string,      // 返回的数据格式
        success?: Function,     // 接口调用成功的回调函数
        fail?: Function,        // 接口调用失败的回调函数
        complete?: Function     // 接口调用结束的回调函数（调用成功、失败都会执行）
    });

    /**
     * 主动拉取分享
     *
     * @param object
     */
    function shareAppMessage(object: {
        title?: string,
        imageUrl?: string,
        query?: string
    });

    /**
     * 监听用户点击右上角菜单的“转发”按钮时触发的事件
     *
     * @param callback
     */
    function onShareAppMessage(callback: (object: {
        title: string,
        imageUrl: string,
        query: string
    }) => any);

    /**
     * 显示分享菜单
     *
     * @param object
     */
    function showShareMenu(object: { withShareTicket: boolean, success?: Function, fail?: Function, complete?: Function });

    /**
     * 获取群分享后群排名数据
     *
     * @param object
     */
    function getGroupCloudStorage(object: {
        shareTicket: string;
        keyList: string[];
        success: (res: { data: UserGameData[] }) => void;
        fail: Function;
        complete?: Function;
    });

    /**
     * 获取好友排名数据
     *
     * @param object
     */
    function getFriendCloudStorage(object: {
        keyList: string[];
        success: (res: { data: UserGameData[] }) => void;
        fail: Function;
        complete?: Function;
    });

    /**
     * 获取自己的存储信息
     *
     * @param object
     */
    function getUserCloudStorage(object: {
        keyList: string[];
        success: (res: { KVDataList: KVData[] }) => void;
        fail: Function;
        complete?: Function;
    });

    /**
     * 上传个人数据
     *
     * @param object
     */
    function setUserCloudStorage(object: {
        KVDataList: KVData[]; // key-value数据
        success?: Function,   // 接口调用成功的回调函数
        fail?: Function,      // 接口调用失败的回调函数
        complete?: Function   // 接口调用结束的回调函数（调用成功、失败都会执行）
    });

    /**
     * 监听小游戏回到前台的事件
     *
     * @param callback
     */
    function onShow(callback: (res: {scene: number, query: Object, referrerInfo: Object, shareTicket: string}) => void);

    /**
     * 监听小游戏回到前台的事件
     *
     * @param callback
     */
    function onHide(callback: Function);

}