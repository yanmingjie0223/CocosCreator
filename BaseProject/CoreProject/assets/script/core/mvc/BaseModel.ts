import EventManager from "../manager/EventManager";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 15:33:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-03-01 16:53:13
 */
export default abstract class BaseModel {

    /**类名key */
    public static key: string = 'BaseModel';

    public destroy(): void {}

    protected addEventListener(type: string, callback: Function, target?: any, useCapture?: boolean): void {
        const eventMgr = EventManager.getInstance<EventManager>();
        eventMgr.addEventListener.apply(eventMgr, [type, callback, target, useCapture]);
    }
    protected offEventListener(type: string, callback?: Function, target?: any): void {
        const eventMgr = EventManager.getInstance<EventManager>();
        eventMgr.offEventListener.apply(eventMgr, [type, callback, target]);
    }
    protected emitEvent(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        const eventMgr = EventManager.getInstance<EventManager>();
        eventMgr.emitEvent.apply(eventMgr, [type, arg1, arg2, arg3, arg4, arg5]);
    }
    protected hasAddEventListener(type: string): boolean {
        const eventMgr = EventManager.getInstance<EventManager>();
        return eventMgr.hasAddEventListener(type);
    }

}