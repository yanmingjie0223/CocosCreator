import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:07:44
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-12-15 21:36:08
 */
export default class EventManager extends Singleton {

    private eventNode: cc.EventTarget;

    public constructor() {
        super();
        this.eventNode = new cc.EventTarget();
    }

    /**
     * 再次封装方法是为了全局事件监听名字统一，方便理解和处理
     */
    public addEventListener(type: string, callback: Function, target?: any, useCapture?: boolean): void {
        this.eventNode.on.apply(this.eventNode, arguments);
    }
    public addOnceEventListener(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void {
        this.eventNode.once.apply(this.eventNode, arguments);
    }
    public offEventListener(type: string, callback?: Function, target?: any): void {
        this.eventNode.off.apply(this.eventNode, arguments);
    }
    public emitEvent(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        this.eventNode.emit.apply(this.eventNode, arguments);
    }
    public hasAddEventListener(type: string): boolean {
        return this.eventNode.hasEventListener(type);
    }

}