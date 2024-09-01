interface ISyncTask {
	/**
	 * 开始任务
	 */
	start(): void;

	/**
	 * 暂停
	 */
	pause(): void;

	/**
	 * 恢复暂停
	 */
	resume(): void;

	/**
	 * 完成任务
	 */
	complete(): void;

	/**
	 * 销毁任务
	 */
	destroy(): void;

}

export class SyncTaskHost implements ISyncTask {

	private _curTask: SyncTask | undefined = undefined;
	private _tasks: SyncTask[] = null!;
	private _onComplete: () => void = null!;
	private _thisObj: any = null!;
	private _isPause: boolean = false;

	public constructor() {
		this._tasks = [];
	}

	public pause(): void {
		if (this._isPause) {
			return;
		}

		this._isPause = true;
		if (this._curTask) {
			this._curTask.pause();
		}
	}

	public resume(): void {
		if (!this._isPause) {
			return;
		}

		this._isPause = false;
		if (!this._curTask) {
			this.start();
		}
		else {
			this._curTask.resume();
		}
	}

	public pushTasks(tasks: SyncTask[]): void {
		tasks.forEach((task: SyncTask) => {
			this.pushTask(task);
		});
	}

	public pushTask(task: SyncTask): void {
		task.host = this;
		this._tasks.push(task);
	}

	public start(): void {
		if (this._isPause) {
			this._curTask = undefined;
			return;
		}

		const task = this._tasks.shift();
		this._curTask = task;
		if (task) {
			task.start();
		}
		else {
			this.complete();
		}
	}

	public getCurTask(): SyncTask | undefined {
		return this._curTask;
	}

	public complete(): void {
		this._curTask = undefined;
		if (this._onComplete) {
			this._onComplete.call(this._thisObj);
		}
	}

	public setComplete(onComplete: () => void, thisObj: any): void {
		this._onComplete = onComplete;
		this._thisObj = thisObj;
	}

	public clear(): void {
		this._tasks.length = 0;
		this._curTask = undefined;
		this._thisObj = null!;
		this._onComplete = null!;
	}

	public destroy(): void {
		this._curTask = undefined;
		this._onComplete = null!;
		this._thisObj = null!;
		this._tasks = null!;
	}

}

export class SyncTask implements ISyncTask {

	public host: SyncTaskHost = null!;

	public start(): void {
		this.complete();
	}

	public pause(): void { }

	public resume(): void { }

	public complete(): void {
		this.host.start();
		this.destroy();
	}

	public destroy(): void {
		this.host = null!;
	}

}
