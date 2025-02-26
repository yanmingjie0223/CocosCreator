/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-24 16:19:06
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-12-07 23:37:58
 */
export default class AppConfig {

    /**
     * 平台信息
     */
    public static platform: string = '';

    /**
     * appId
     */
    public static appId: number = 0;

    /**
     * appName
     */
    public static appName: string = '';

    /**
     * token
     */
    public static token: string = '';

    /**
     * 角色id
     */
    public static uId: string = '';

    /**
     * ui原始宽
     */
    public static readonly initWidth: number = 750;

    /**
     * ui原始高
     */
    public static readonly initHeight: number = 1334;

    /**
     * 资源无引用后缓存时间(s)
     */
    public static readonly resCacheTime: number = 3 * 60;

    /**
     * 蒙层背景图片
     */
    public static readonly matteUrl: string = 'ui://preload/wBg';

}