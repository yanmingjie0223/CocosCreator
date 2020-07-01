/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-24 16:19:06
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-07-01 21:51:50
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
     * ui原始宽高
     */
    public static readonly initWidth: number = 640;
    public static readonly initHeight: number = 1136;

    /**
     * 资源无引用后缓存时间(s)
     */
    public static readonly resCacheTime: number = 10;

    /**
     * 蒙层背景图片
     */
    public static readonly matteUrl: string = 'ui://36dt0efabg9v3';

}