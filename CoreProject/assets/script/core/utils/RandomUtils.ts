import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 16:07:33
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-09 16:40:39
 */
export default class RandomUtils extends Singleton {

    public constructor() {
        super();
    }

    /**
     * 获取一个区间的随机数 (from, end)
     * @param {number} from 最小值
     * @param {number} end 最大值
     * @returns {number}
     */
    public random(from: number, end: number): number {
        const min: number = Math.min(from, end);
        const max: number = Math.max(from, end);
        const range: number = max - min;
        return min + Math.random() * range;
    }

    /**
     * 获取数组中随机一个单元
     * @param arr 数组数据源
     */
    public randomArray<T>(arr: Array<T>): T {
        const index: number = this.random(0, arr.length) | 0;
        return arr[index];
    }

}