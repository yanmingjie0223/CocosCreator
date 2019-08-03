import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 16:17:36
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-05-29 20:36:40
 */
export default class ArrayUtils extends Singleton {

    public constructor() {
        super();
    }

    /**
     * 打乱数组中的元素
     * @param {Array} arr
     */
    public upset(arr: Array<any>): void {
        arr.sort(() => Math.random() - 0.5);
    }

}