export namespace ISync {
	export interface IStep {
		/**
		 * 游戏开始
		 */
		stepStart(): Promise<void>;

		/**
		 * 游戏暂停
		 */
		stepPause(): Promise<void>;

		/**
		 * 游戏重启
		 */
		stepResume(): Promise<void>;

		/**
		 * 游戏关闭
		 */
		stepClose(): Promise<void>;

		/**
		 * 渲染更新
		 *
		 * dt是本地计算获得
		 *
		 * @param {number} dt (s)
		 * @memberof IStep
		 */
		renderUpdate(dt: number): void;

		/**
		 * 逻辑更新
		 *
		 * dt是固定时间间隔
		 *
		 * @param {number} dt (s)
		 * @memberof IStep
		 */
		logicUpdate(dt: number): void;

		/**
		 * 预测更新
		 *
		 * dt是固定时间间隔
		 *
		 * @param {number} dt (s)
		 * @memberof IStep
		 */
		preditUpdate(dt: number): void;
	}
}