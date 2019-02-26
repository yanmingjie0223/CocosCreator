/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-24 16:19:06
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-02-26 11:25:25
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