import EventManager from "../manager/EventManager";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-25 13:54:13
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-12-06 16:41:04
 */
export default class BComponent extends fgui.GComponent {

    public constructor() {
        super();
    }

    /**
     * xml初始化完成后，可在这里做一些初始化操作
     */
    protected onConstruct(): void { }

    /**
     * 帧刷新事件(s)
     */
    protected onUpdate(dt?: number): void { }

    /**
     * 全局事件处理
     */
    protected addEventListener(type: string, callback: Function, target?: any, useCapture?: boolean): void {
        const eventMgr = EventManager.getInstance<EventManager>();
        eventMgr.addEventListener.apply(eventMgr, arguments);
    }
    protected offEventListener(type: string, callback?: Function, target?: any): void {
        const eventMgr = EventManager.getInstance<EventManager>();
        eventMgr.offEventListener.apply(eventMgr, arguments);
    }
    protected emitEvent(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        const eventMgr = EventManager.getInstance<EventManager>();
        eventMgr.emitEvent.apply(eventMgr, arguments);
    }
    protected hasAddEventListener(type: string): boolean {
        const eventMgr = EventManager.getInstance<EventManager>();
        return eventMgr.hasAddEventListener(type);
    }

}