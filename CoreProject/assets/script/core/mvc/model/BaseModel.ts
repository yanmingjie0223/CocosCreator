import App from "../../App";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 15:33:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-18 11:26:56
 */
export default abstract class BaseModel {

    // 类名key
    public static key: string = 'BaseModel';

    // 初始化数据
    protected abstract init(): void;

    protected on(type: string, callback: Function, target?: any, useCapture?: boolean): void {
        App.EventManager.on.apply(App.EventManager, arguments);
    }

    protected once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void {
        App.EventManager.once.apply(App.EventManager, arguments);
    }

    protected off(type: string, callback?: Function, target?: any): void {
        App.EventManager.off.apply(App.EventManager, arguments);
    }

    protected hasEventListener(type: string): boolean {
        return App.EventManager.hasEventListener(type);
    }

}