export default class Singleton {

    /**单例获取 */
    private static _instance: Singleton;
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