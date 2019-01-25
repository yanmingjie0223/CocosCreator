import App from "../../App";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 15:33:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-25 11:10:34
 */
export default abstract class BaseModel {

    // 类名key
    public static key: string = 'BaseModel';

    protected addEventListener(type: string, callback: Function, target?: any, useCapture?: boolean): void {
        App.EventManager.on.apply(App.EventManager, arguments);
    }
    protected offEventListener(type: string, callback?: Function, target?: any): void {
        App.EventManager.off.apply(App.EventManager, arguments);
    }
    protected emitEvent(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        App.EventManager.emit.apply(App.EventManager, arguments);
    }
    protected hasAddEventListener(type: string): boolean {
        return App.EventManager.hasEventListener(type);
    }

}