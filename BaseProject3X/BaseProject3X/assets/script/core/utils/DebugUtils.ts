import { DEBUG } from "cc/env";
import App from "../App";
import Singleton from "../base/Singleton";

export default class DebugUtils extends Singleton {

	/**是否开启debug模式 */
	public isDebug: boolean = false;

	public initialize(): void {
		if (this.isDebug) {
			const win = window as any;
			win['App'] = App;
		}
	}

	public log(...args: Array<any>): void {
		if (this.isDebug && DEBUG) {
			console.log.apply(console.log, args);
		}
	}

	public warn(...args: Array<any>): void {
		if (this.isDebug && DEBUG) {
			console.warn.apply(console.warn, args);
		}
	}

	public error(...args: Array<any>): void {
		if (this.isDebug && DEBUG) {
			console.error.apply(console.error, args);
		}
	}

}