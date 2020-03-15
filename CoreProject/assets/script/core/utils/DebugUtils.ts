import Singleton from "../base/Singleton";
import App from "../App";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 11:29:26
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-05-29 20:37:01
 */
export default class DebugUtils extends Singleton {

    // 是否开启debug模式
    public isDebug: boolean = false;

    public constructor() {
        super();
    }

    public init(): void {
        if (this.isDebug) {
            window['App'] = App;
        }
    }

    public log(...args: Array<any>): void {
        if (this.isDebug && CC_DEBUG) {
            console.log.apply(console.log, args);
        }
    }

    public warn(...args: Array<any>): void {
        if (this.isDebug && CC_DEBUG) {
            console.warn.apply(console.warn, args);
        }
    }

    public error(...args: Array<any>): void {
        if (this.isDebug && CC_DEBUG) {
            console.error.apply(console.error, args);
        }
    }

}