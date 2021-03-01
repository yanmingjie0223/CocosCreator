/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 14:59:19
 * @Last Modified by: yanmingjie.jack@shengqugames.com
 * @Last Modified time: 2021-03-01 16:54:50
 */
export default class Singleton {

    /**单例获取 */
    private static _instance: Singleton;
    public static getInstance<T extends Singleton>(): T {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance as T;
    }

}