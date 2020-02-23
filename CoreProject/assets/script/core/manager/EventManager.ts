/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:07:44
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-12-15 21:36:08
 */
export default class EventManager extends cc.Node {

    // 单例获取
    private static _instance: EventManager;
    public static getInstance(): EventManager {
        if (!this._instance) {
            this._instance = new EventManager();
        }
        return this._instance;
    }

    public constructor() {
        super();
    }

    /**
     * 再次封装方法是为了全局事件监听名字统一，方便理解和处理
     */
    public addEventListener(type: string, callback: Function, target?: any, useCapture?: boolean): void {
        this.on.apply(this, arguments);
    }
    public addOnceEventListener(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void {
        this.once.apply(this, arguments);
    }
    public offEventListener(type: string, callback?: Function, target?: any): void {
        this.off.apply(this, arguments);
    }
    public emitEvent(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        this.emit.apply(this, arguments);
    }
    public hasAddEventListener(type: string): boolean {
        return this.hasEventListener(type);
    }

}