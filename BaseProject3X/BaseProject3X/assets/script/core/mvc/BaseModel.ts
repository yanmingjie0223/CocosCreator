import EventManager from "../manager/EventManager";

export default abstract class BaseModel {

	/**类名key */
	public static key: string = 'BaseModel';

	public destroy(): void { }

	protected addEventListener(type: string, callback: (...args: Array<any>) => void, target?: any, useCapture?: boolean): void {
		const eventMgr = EventManager.getInstance<EventManager>();
		eventMgr.addEventListener.apply(eventMgr, [type, callback, target, useCapture]);
	}
	protected offEventListener(type: string, callback?: (...args: Array<any>) => void, target?: any): void {
		const eventMgr = EventManager.getInstance<EventManager>();
		eventMgr.offEventListener.apply(eventMgr, [type, callback, target]);
	}
	protected emitEvent(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void {
		const eventMgr = EventManager.getInstance<EventManager>();
		eventMgr.emitEvent.apply(eventMgr, [type, arg1, arg2, arg3, arg4]);
	}
	protected hasAddEventListener(type: string): boolean {
		const eventMgr = EventManager.getInstance<EventManager>();
		return eventMgr.hasAddEventListener(type);
	}

}