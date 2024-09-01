export default class Singleton {
	private static _instance: Singleton = null!;

	public static getInstance<T extends Singleton>(): T {
		if (!this._instance) {
			this._instance = new this();
		}
		return this._instance as T;
	}

	public static deleteInstance(): void {
		if (this._instance) {
			this._instance = null!;
		}
	}
}
