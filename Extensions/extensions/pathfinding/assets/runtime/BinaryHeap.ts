import { PathNode } from './PathDefine';

export class BinaryHeap {
	public content: PathNode[] = []; // 堆内容
	public scoreFunction: (e: PathNode) => number; // 评分函数

	/**
	 * @constructor
	 * @param scoreFunction
	 */
	constructor(scoreFunction: (e: PathNode) => number) {
		this.content = [];
		this.scoreFunction = scoreFunction;
	}

	/**
	 * 向堆中添加一个节点
	 * @param e 节点
	 */
	public push(e: PathNode): void {
		this.content.push(e);
		this.sinkDown(this.content.length - 1);
	}

	/**
	 * 取出并移除最小的节点
	 */
	public pop(): PathNode {
		const result = this.content[0]; // 取到了结果

		// 取走了一个叶子节点 所以要向上重新排序
		const end = this.content.pop()!;
		if (this.content.length > 0) {
			this.content[0] = end;
			this.bubbleUp(0);
		}

		return result;
	}

	/**
	 * 从堆中移除一个节点
	 * @param node
	 */
	public remove(node: PathNode): void {
		const i = this.content.indexOf(node);

		const end = this.content.pop();

		if (i !== this.content.length - 1) {
			this.content[i] = end!;

			if (this.scoreFunction(end!) < this.scoreFunction(node)) {
				this.sinkDown(i);
			} else {
				this.bubbleUp(i);
			}
		}
	}

	/**
	 * 获取堆节点总数
	 */
	public size(): number {
		return this.content.length;
	}

	/**
	 * 重新排序所有节点
	 * @param node
	 */
	public rescoreElement(node: PathNode): void {
		this.sinkDown(this.content.indexOf(node));
	}

	/**
	 * 下沉
	 * （以n为基准向根部重新排序指定位置的堆节点 只考虑父子关系）
	 * @param n
	 */
	public sinkDown(n: number) {
		const scoreFunction = this.scoreFunction;
		const content = this.content;
		const element = content[n];

		// 从n向根遍历树的这一分支
		while (n > 0) {
			const parentN = ((n + 1) >> 1) - 1;
			const parent = content[parentN];

			// 如果自己比父亲更小 则交换父子关系（排序）
			if (scoreFunction(element) < scoreFunction(parent)) {
				content[parentN] = element;
				content[n] = parent;
				n = parentN;
			} else {
				break;
			}
		}
	}

	/**
	 * 上浮
	 * （以n为基准向根部重新排序指定位置的堆节点 考虑父子和兄弟关系）
	 * @param n
	 */
	public bubbleUp(n: number) {
		const scoreFunction = this.scoreFunction;
		// Look up the target element and its score.
		const length = this.content.length;
		const content = this.content;
		const element = content[n];
		const elemScore = scoreFunction(element);

		// eslint-disable-next-line no-constant-condition
		while (true) {
			// 计算两个子节点所在的数组位置
			const child2N = (n + 1) << 1;
			const child1N = child2N - 1;

			// 找出[左子, 右子, 父]中分数最小的一个
			let swap = null;
			let child1Score: number;
			// 如果左子存在 判断其和父的分数
			if (child1N < length) {
				const child1 = content[child1N];
				child1Score = scoreFunction(child1);
				if (child1Score < elemScore) {
					// 左子如果更小则左子预定上浮
					swap = child1N;
				}
			}

			// 如果右子存在 判断其和父、左子的分数
			if (child2N < length) {
				const child2 = content[child2N];
				const child2Score = scoreFunction(child2);
				if (child2Score < (swap === null ? elemScore! : child1Score!)) {
					// 右子如果更小则右子预定上浮
					swap = child2N;
				}
			}

			// 如果swap有值 代表需要上浮
			if (swap !== null) {
				content[n] = content[swap];
				content[swap] = element;
				n = swap;
			} else {
				break; // 没swap 这个element不能再上浮了 更靠近根的节点都比它小
			}
		}
	}
}
