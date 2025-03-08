export class UID {
	private _id: number = 0;

	public get id(): number {
		return this._id;
	}

	public clear(): void {
		this._id = 0;
	}

	/**
	 * 获取预分配id，该id是下一个分配id
	 * @returns
	 */
	public getPreUID(): number {
		let preId = this._id + 1;
		if (preId > Number.MAX_VALUE) {
			preId = 1;
		}
		return preId;
	}

	/**
	 * 获取分配id
	 * @returns
	 */
	public getUID(): number {
		++this._id;
		if (this._id > Number.MAX_VALUE) {
			this._id = 1;
		}
		return this._id;
	}
}
