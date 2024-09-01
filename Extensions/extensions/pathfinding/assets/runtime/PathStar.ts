import { BinaryHeap } from './BinaryHeap';
import { PathGraph } from './PathGraph';
import { PathNode, FaceType } from './PathDefine';

export class PathStar {
	public static readonly MAX_LOOP: number = 100000;
	public static readonly SQRT = 1.41421;
	public static readonly DOWN_WEIGHT = 2;
	public static readonly MIDLE_WEIGHT = 1;

	public search(
		graph: PathGraph,
		startNode: PathNode,
		endNode: PathNode,
		isFaceSearch: boolean,
		closest: boolean = false
	): PathNode[] {
		graph.cleanDirty();
		let loopTimes: number = 0;

		let openHeap = this.getHeap();
		let closestNode = startNode;
		startNode.h = this.manhattan(startNode, endNode);
		openHeap.push(startNode);

		while (openHeap.size() > 0) {
			// 寻路次数异常检测
			++loopTimes;
			if (loopTimes > PathStar.MAX_LOOP) {
				console.error('寻路次数超出 请检测寻路数据！');
				break;
			}
			// 检查寻路是否结束
			let currentNode = openHeap.pop();
			if (currentNode === endNode) {
				return this.pathTo(currentNode);
			}
			// 关闭该节点
			currentNode.closed = true;
			// 获取邻居点
			let neighbors: PathNode[];
			if (isFaceSearch) {
				neighbors = graph.faceNeighbors(currentNode);
			} else {
				neighbors = graph.neighbors(currentNode);
			}
			const neighborsLen = neighbors.length;
			for (let i = 0; i < neighborsLen; ++i) {
				let neighbor = neighbors[i];
				// 跳过已关闭或不能行走的节点
				if (neighbor.closed) {
					continue;
				}
				// gScore 是该currentNode移动到neighbor的最小消耗
				let gScore = currentNode.g + this.getNodeCost(neighbor, currentNode);
				let beenVisited = neighbor.visited;
				if (!beenVisited || gScore < neighbor.g) {
					neighbor.visited = true;
					neighbor.parent = currentNode;
					if (neighbor.h === -1) {
						neighbor.h = this.manhattan(neighbor, endNode);
					}
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;

					if (closest) {
						if (
							neighbor.h < closestNode.h ||
							(neighbor.h === closestNode.h && neighbor.g < closestNode.g)
						) {
							closestNode = neighbor;
						}
					}

					if (!beenVisited) {
						openHeap.push(neighbor);
					} else {
						openHeap.rescoreElement(neighbor);
					}
				}
			}
		}

		if (closest) {
			return this.pathTo(closestNode);
		}

		return [];
	}

	private getHeap(func?: (e: PathNode) => number) {
		if (!func) {
			func = (node) => {
				return node.f!;
			};
		}
		return new BinaryHeap(func);
	}

	private manhattan(nA: PathNode, nB: PathNode): number {
		return Math.abs(nB.x - nA.x) + Math.abs(nB.z - nA.z) + Math.abs(nB.y - nA.y);
	}

	private pathTo(node: PathNode): PathNode[] {
		let curr = node;
		let loopTimes: number = 0;
		let path: PathNode[] = [];
		while (curr.parent) {
			// 数据异常检测
			++loopTimes;
			if (loopTimes > PathStar.MAX_LOOP) {
				path = [];
				break;
			}

			path.splice(0, 0, curr);
			curr = curr.parent;
		}

		const nodes: PathNode[] = [];
		for (let i = 0; i < path.length; i++) {
			nodes[i] = path[i];
		}

		return nodes;
	}

	private getNodeCost(aNode: PathNode, bNode: PathNode, isBias: boolean = false): number {
		let cost: number;

		if (isBias) {
			cost = aNode.w * PathStar.SQRT;
		} else {
			cost = aNode.w;
		}

		if (aNode.face === FaceType.DOWN) {
			cost += PathStar.DOWN_WEIGHT;
		} else if (aNode.face !== FaceType.UP) {
			cost += PathStar.MIDLE_WEIGHT;
		}

		return cost;
	}
}
