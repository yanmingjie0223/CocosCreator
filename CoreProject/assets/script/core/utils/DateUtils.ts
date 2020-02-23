import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 16:38:25
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-12-17 23:54:10
 */
export default class DateUtils extends Singleton {

    public constructor() {
        super();
    }

    /**
     * 格式化时间获取：时分秒 00:00:00
     * @param {number} 时间戳差值（s）
     * @param {number} 取时间位，例如：1：取到秒 2：取到分钟 3：取到小时
     */
    public formatTime(time: number, place: number = 3): string {
        let str: string = '';
        let h: number = (time / 3600) | 0;
        let m: number = ((time - h * 3600) / 60) | 0;
        let s: number = (time - h * 3600 - m * 60) | 0;

        if (place >= 3) {
            str += h > 0 ? `${h}:` : '';
        }
        if (place >= 2) {
            str += m > 9 ? `${m}:` : `0${m}:`;
        }
        str += s > 9 ? `${s}` : `0${s}`;

        return str;
    }

    /**
     * 使用时间返回所需要的字符串格式"2016年06月12日"
     * @param {number} 时间戳（ms）
     * @param {string} 返回格式，例如："yyyy年MM月dd日"
     * @return {string} 返回指点格式字符串
     * */
    public millisecondsToDate(time: number, fmt: string): string {
        const d: Date = new Date(time);
        const o: any = {
            "M+": d.getMonth() + 1,
            "d+": d.getDate(),
            "h+": d.getHours(),
            "H+": d.getHours(),
            "m+": d.getMinutes(),
            "s+": d.getSeconds(),
            "q+": Math.floor((d.getMonth() + 3) / 3),
            "S": d.getMilliseconds() //毫秒
        };
        const week: any = {
            "0": "\u65e5",
            "1": "\u4e00",
            "2": "\u4e8c",
            "3": "\u4e09",
            "4": "\u56db",
            "5": "\u4e94",
            "6": "\u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[d.getDay() + ""]);
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

}