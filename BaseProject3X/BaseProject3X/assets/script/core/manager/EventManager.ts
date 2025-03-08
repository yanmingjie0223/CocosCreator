import { EventTarget } from "cc";
import Singleton from "../base/Singleton";

export default class EventManager extends Singleton {

	private eventTarget: EventTarget;

	public constructor() {
		super();
		this.eventTarget = new EventTarget();
	}

	/**
	 * 再次封装方法是为了全局事件监听名字统一，方便理解和处理
	 */
	public addEventListener(type: string, callback: (...args: Array<any>) => void, target?: any, useCapture?: boolean): void {
		this.eventTarget.on.apply(this.eventTarget, [type, callback, target, useCapture]);
	}
	public addOnceEventListener(type: string, callback: (...args: Array<any>) => void, target?: any): void {
		this.eventTarget.once.apply(this.eventTarget, [type, callback, target]);
	}
	public offEventListener(type: string, callback?: (...args: Array<any>) => void, target?: any): void {
		this.eventTarget.off.apply(this.eventTarget, [type, callback, target]);
	}
	public emitEvent(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void {
		this.eventTarget.emit.apply(this.eventTarget, [type, arg1, arg2, arg3, arg4]);
	}
	public hasAddEventListener(type: string): boolean {
		return this.eventTarget.hasEventListener(type);
	}

}