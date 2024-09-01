export class SeedRandom {
	private _seed: number;

	public constructor(seed: number) {
		this._seed = seed;
	}

	/**
	 * 获取随机数[0,1)-[min,max)
	 * @param max
	 * @param min
	 * @returns
	 */
	public next(max: number = 1, min: number = 0): number {
		max = max || 1;
		min = min || 0;

		this._seed = (this._seed * 9301 + 49297) % 233280;
		const rnd = this._seed / 233280;
		return min + rnd * (max - min);
	}
}
