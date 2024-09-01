/**
 * 对状态处理的状态类
 */
export class Status<E extends number> {
	private _status: number = 0;

	/**
	 * 状态值
	 */
	public set status(value: number) {
		this._status = value;
	}

	/**
	 * 状态值
	 */
	public get status(): number {
		return this._status;
	}

	/**
	 * 加入状态
	 * @param status
	 */
	public addStatus(status: E): void {
		this._status |= 1 << status;
	}

	/**
	 * 设置状态
	 * @param status
	 */
	public setStatus(status: E): void {
		this._status = 0;
		this._status |= 1 << status;
	}

	/**
	 * 去除状态
	 * @param status
	 */
	public removeStatus(status: E): void {
		this._status &= ~(1 << status);
	}

	/**
	 * 清理所有状态
	 */
	public clear(): void {
		this._status = 0;
	}

	/**
	 * 判断是否存在该状态
	 * @param status
	 * @returns
	 */
	public isStatus(status: E): boolean {
		const code = this._status & (1 << status);
		return code !== 0;
	}

	/**
	 * 判定是否只存在该状态
	 * @param status
	 * @returns
	 */
	public isOnlyStatus(status: E): boolean {
		const sValue = 1 << status;
		if (this._status === sValue) {
			return true;
		}
		return false;
	}
}
