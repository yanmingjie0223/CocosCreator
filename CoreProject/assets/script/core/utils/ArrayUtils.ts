import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 16:17:36
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-09 16:40:29
 */
export default class ArrayUtils extends Singleton {

    public constructor() {
        super();
    }

    /**
     * 打乱数组中的元素
     * @param {Array} arr
     */
    public upset(arr: Array<any>): any {
        const len: number = arr.length;
        let index: number;
        let tmp: any;
        for (let i = len - 1; i >= 0; i--) {
            index = (Math.random() * i)|0;
            tmp = arr[i];
            arr[i] = arr[index];
            arr[index] = tmp;
        }
    }

}