import { FaceType, PathNode } from './PathDefine';
import { PathUtils } from './PathUtils';

export class PathGraph {
	private readonly _nodes: Map<string, PathNode> = new Map();
	private readonly _paths: Map<string, number> = new Map();
	private readonly _throughs: Map<string, number> = new Map();
	private readonly _blocks: string[] = [];

	private _tempNodes: PathNode[] = [];

	public pushBlockNode(x: number, y: number, z: number): void {
		const key = PathUtils.getNodeKey(x, y, z);
		if (this._blocks.indexOf(key) === -1) {
			this._blocks.push(key);
		}
	}

	public removeBlockNode(x: number, y: number, z: number): void {
		const key = PathUtils.getNodeKey(x, y, z);
		const index = this._blocks.indexOf(key);
		if (index !== -1) {
			this._blocks.splice(index, 1);
		}
	}

	public pushThroughNode(x: number, y: number, z: number, w: number): void {
		const key = PathUtils.getNodeKey(x, y, z);
		if (!this._throughs.get(key)) {
			this._throughs.set(key, w);
		}
	}

	public removeThroughNode(x: number, y: number, z: number): void {
		const key = PathUtils.getNodeKey(x, y, z);
		if (this._throughs.get(key)) {
			this._throughs.delete(key);
		}
	}

	public pushPathFaceNode(x: number, y: number, z: number, face: FaceType, w: number): void {
		const key = PathUtils.getFaceNodeKey(x, y, z, face);
		const oldNode = this._nodes.get(key);
		if (!oldNode) {
			const node: PathNode | null = {
				x: x,
				y: y,
				z: z,
				w: w,
				face: face,
				parent: null,
				f: 0,
				g: 0,
				h: 0
			};
			this._nodes.set(key, node);
			this.pushPath(x, y, z);
		}
	}

	public removePathFaceNode(x: number, y: number, z: number, face: FaceType): void {
		const key = PathUtils.getFaceNodeKey(x, y, z, face);
		if (this._nodes.get(key)) {
			this._nodes.delete(key);
			this.removePath(x, y, z);
		}
	}

	public getPathFaceNode(x: number, y: number, z: number, face: FaceType): PathNode | null {
		const key = PathUtils.getFaceNodeKey(x, y, z, face);
		const node = this._nodes.get(key);
		if (node) {
			return node;
		}

		return null;
	}

	public getPathNode(x: number, y: number, z: number): PathNode[] | null {
		const nodes: PathNode[] = [];
		const keys = PathUtils.getNodeAllKey(x, y, z);
		keys.forEach((key: string) => {
			const node = this._nodes.get(key);
			if (node) {
				nodes.push(node);
			}
		});

		return nodes;
	}

	public getPathNodeWeight(x: number, y: number, z: number): number | null {
		const key = PathUtils.getNodeKey(x, y, z);
		const value = this._throughs.get(key);
		if (value !== undefined) {
			return value;
		}
		return null;
	}

	public cleanDirty(): void {
		this._nodes.forEach((node: PathNode) => {
			node.f = 0;
			node.g = 0;
			node.h = 0;
			node.closed = false;
			node.visited = false;
			node.parent = null;
		});
	}

	/**
	 * 检查该节点是否存在可通面
	 * @param x
	 * @param y
	 * @param z
	 * @returns
	 */
	public checkPathNode(x: number, y: number, z: number): boolean {
		const key = PathUtils.getNodeKey(x, y, z);
		return !!this._paths.get(key);
	}

	public checkPathFaceNode(x: number, y: number, z: number, face: FaceType): boolean {
		const key = PathUtils.getFaceNodeKey(x, y, z, face);
		return !!this._nodes.get(key);
	}

	/**
	 * 检测位置是否存在节点、包含障碍节点
	 * @param x
	 * @param y
	 * @param z
	 * @returns
	 */
	public checkSrcHasNode(x: number, y: number, z: number): boolean {
		const key = PathUtils.getNodeKey(x, y, z);
		if (this._throughs.get(key) || this._blocks.indexOf(key) !== -1) {
			return true;
		}
		return false;
	}

	/**
	 * 检测位置是否存在路径节点
	 * @param x
	 * @param y
	 * @param z
	 * @returns
	 */
	public checkSrcPathNode(x: number, y: number, z: number): boolean {
		const key = PathUtils.getNodeKey(x, y, z);
		return this._throughs.get(key) !== undefined;
	}

	public clear(): void {
		this._nodes.clear();
		this._paths.clear();
		this._throughs.clear();
		this._blocks.length = 0;
		this._tempNodes.length = 0;
	}

	public neighbors(pNode: PathNode): PathNode[] {
		const x = pNode.x;
		const y = pNode.y;
		const z = pNode.z;
		const nodes: PathNode[] = [];
		// front
		const fNode = this.getPathFaceNode(x, y, z - 1, FaceType.UP);
		if (fNode !== null) {
			nodes.push(fNode);
		}
		// back
		const bNode = this.getPathFaceNode(x, y, z + 1, FaceType.UP);
		if (bNode !== null) {
			nodes.push(bNode);
		}
		// left
		const lNode = this.getPathFaceNode(x - 1, y, z, FaceType.UP);
		if (lNode !== null) {
			nodes.push(lNode);
		}
		// right
		const rNode = this.getPathFaceNode(x + 1, y, z, FaceType.UP);
		if (rNode !== null) {
			nodes.push(rNode);
		}
		return nodes;
	}

	public faceNeighbors(pNode: PathNode): PathNode[] {
		this._tempNodes.length = 0;
		let nodes: PathNode[];
		// todo: 面邻接点可用障碍节点信息优化
		switch (pNode.face) {
			case FaceType.UP:
				nodes = this.getUpNeighbors(pNode);
				break;
			case FaceType.LEFT:
				nodes = this.getLeftNeighbors(pNode);
				break;
			case FaceType.RIGHT:
				nodes = this.getRightNeighbors(pNode);
				break;
			case FaceType.FRONT:
				nodes = this.getFrontNeighbors(pNode);
				break;
			case FaceType.BACK:
				nodes = this.getBackNeighbors(pNode);
				break;
			case FaceType.DOWN:
				nodes = this.getDownNeighbors(pNode);
				break;
			default:
				nodes = [];
				break;
		}
		return nodes;
	}

	private getUpNeighbors(pNode: PathNode): PathNode[] {
		const x = pNode.x;
		const y = pNode.y;
		const z = pNode.z;
		// 当前块面
		const frontFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.FRONT);
		if (frontFace !== null) {
			this._tempNodes.push(frontFace);
		}
		const backFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.BACK);
		if (backFace !== null) {
			this._tempNodes.push(backFace);
		}
		const leftFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.LEFT);
		if (leftFace !== null) {
			this._tempNodes.push(leftFace);
		}
		const rightFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.RIGHT);
		if (rightFace !== null) {
			this._tempNodes.push(rightFace);
		}
		// 当前块平层的可通面
		const flat_frontFace: PathNode | null = this.getPathFaceNode(x, y, z - 1, FaceType.UP);
		if (flat_frontFace !== null) {
			this._tempNodes.push(flat_frontFace);
			PathUtils.removeNode(this._tempNodes, frontFace);
		}
		const flat_backFace: PathNode | null = this.getPathFaceNode(x, y, z + 1, FaceType.UP);
		if (flat_backFace !== null) {
			this._tempNodes.push(flat_backFace);
			PathUtils.removeNode(this._tempNodes, backFace);
		}
		const flat_leftFace: PathNode | null = this.getPathFaceNode(x - 1, y, z, FaceType.UP);
		if (flat_leftFace !== null) {
			this._tempNodes.push(flat_leftFace);
			PathUtils.removeNode(this._tempNodes, leftFace);
		}
		const flat_rightFace: PathNode | null = this.getPathFaceNode(x + 1, y, z, FaceType.UP);
		if (flat_rightFace !== null) {
			this._tempNodes.push(flat_rightFace);
			PathUtils.removeNode(this._tempNodes, rightFace);
		}
		// 当前块前面一层可通面
		const up_frontFace: PathNode | null = this.getPathFaceNode(x, y + 1, z - 1, FaceType.BACK);
		if (up_frontFace !== null) {
			this._tempNodes.push(up_frontFace);
			PathUtils.removeNode(this._tempNodes, flat_frontFace);
		}
		const up_backFace: PathNode | null = this.getPathFaceNode(x, y + 1, z + 1, FaceType.FRONT);
		if (up_backFace !== null) {
			this._tempNodes.push(up_backFace);
			PathUtils.removeNode(this._tempNodes, flat_backFace);
		}
		const up_leftFace: PathNode | null = this.getPathFaceNode(x - 1, y + 1, z, FaceType.RIGHT);
		if (up_leftFace !== null) {
			this._tempNodes.push(up_leftFace);
			PathUtils.removeNode(this._tempNodes, flat_leftFace);
		}
		const up_rightFace: PathNode | null = this.getPathFaceNode(x + 1, y + 1, z, FaceType.LEFT);
		if (up_rightFace !== null) {
			this._tempNodes.push(up_rightFace);
			PathUtils.removeNode(this._tempNodes, flat_rightFace);
		}

		return this._tempNodes;
	}

	private getDownNeighbors(pNode: PathNode) {
		const x = pNode.x;
		const y = pNode.y;
		const z = pNode.z;
		// 当前块面
		const frontFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.FRONT);
		if (frontFace !== null) {
			this._tempNodes.push(frontFace);
		}
		const backFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.BACK);
		if (backFace !== null) {
			this._tempNodes.push(backFace);
		}
		const leftFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.LEFT);
		if (leftFace !== null) {
			this._tempNodes.push(leftFace);
		}
		const rightFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.RIGHT);
		if (rightFace !== null) {
			this._tempNodes.push(rightFace);
		}
		// 当前块平层的可通面
		const flat_frontFace: PathNode | null = this.getPathFaceNode(x, y, z - 1, FaceType.DOWN);
		if (flat_frontFace !== null) {
			this._tempNodes.push(flat_frontFace);
			PathUtils.removeNode(this._tempNodes, frontFace);
		}
		const flat_backFace: PathNode | null = this.getPathFaceNode(x, y, z + 1, FaceType.DOWN);
		if (flat_backFace !== null) {
			this._tempNodes.push(flat_backFace);
			PathUtils.removeNode(this._tempNodes, backFace);
		}
		const flat_leftFace: PathNode | null = this.getPathFaceNode(x - 1, y, z, FaceType.DOWN);
		if (flat_leftFace !== null) {
			this._tempNodes.push(flat_leftFace);
			PathUtils.removeNode(this._tempNodes, leftFace);
		}
		const flat_rightFace: PathNode | null = this.getPathFaceNode(x + 1, y, z, FaceType.DOWN);
		if (flat_rightFace !== null) {
			this._tempNodes.push(flat_rightFace);
			PathUtils.removeNode(this._tempNodes, rightFace);
		}
		// 当前块前面一层可通面
		const up_frontFace: PathNode | null = this.getPathFaceNode(x, y - 1, z - 1, FaceType.BACK);
		if (up_frontFace !== null) {
			this._tempNodes.push(up_frontFace);
			PathUtils.removeNode(this._tempNodes, flat_frontFace);
		}
		const up_backFace: PathNode | null = this.getPathFaceNode(x, y - 1, z + 1, FaceType.FRONT);
		if (up_backFace !== null) {
			this._tempNodes.push(up_backFace);
			PathUtils.removeNode(this._tempNodes, flat_backFace);
		}
		const up_leftFace: PathNode | null = this.getPathFaceNode(x - 1, y - 1, z, FaceType.RIGHT);
		if (up_leftFace !== null) {
			this._tempNodes.push(up_leftFace);
			PathUtils.removeNode(this._tempNodes, flat_leftFace);
		}
		const up_rightFace: PathNode | null = this.getPathFaceNode(x + 1, y - 1, z, FaceType.LEFT);
		if (up_rightFace !== null) {
			this._tempNodes.push(up_rightFace);
			PathUtils.removeNode(this._tempNodes, flat_rightFace);
		}

		return this._tempNodes;
	}

	private getFrontNeighbors(pNode: PathNode) {
		const x = pNode.x;
		const y = pNode.y;
		const z = pNode.z;
		// 当前块面
		const upFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.UP);
		if (upFace !== null) {
			this._tempNodes.push(upFace);
		}
		const downFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.DOWN);
		if (downFace !== null) {
			this._tempNodes.push(downFace);
		}
		const leftFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.LEFT);
		if (leftFace !== null) {
			this._tempNodes.push(leftFace);
		}
		const rightFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.RIGHT);
		if (rightFace !== null) {
			this._tempNodes.push(rightFace);
		}
		// 当前块平层的可通面
		const flat_upFace: PathNode | null = this.getPathFaceNode(x, y + 1, z, FaceType.FRONT);
		if (flat_upFace !== null) {
			this._tempNodes.push(flat_upFace);
			PathUtils.removeNode(this._tempNodes, upFace);
		}
		const flat_downFace: PathNode | null = this.getPathFaceNode(x, y - 1, z, FaceType.FRONT);
		if (flat_downFace !== null) {
			this._tempNodes.push(flat_downFace);
			PathUtils.removeNode(this._tempNodes, downFace);
		}
		const flat_leftFace: PathNode | null = this.getPathFaceNode(x - 1, y, z, FaceType.FRONT);
		if (flat_leftFace !== null) {
			this._tempNodes.push(flat_leftFace);
			PathUtils.removeNode(this._tempNodes, leftFace);
		}
		const flat_rightFace: PathNode | null = this.getPathFaceNode(x + 1, y, z, FaceType.FRONT);
		if (flat_rightFace !== null) {
			this._tempNodes.push(flat_rightFace);
			PathUtils.removeNode(this._tempNodes, rightFace);
		}
		// 当前块前面一层可通面
		const up_upFace: PathNode | null = this.getPathFaceNode(x, y + 1, z - 1, FaceType.DOWN);
		if (up_upFace !== null) {
			this._tempNodes.push(up_upFace);
			PathUtils.removeNode(this._tempNodes, flat_upFace);
		}
		const up_downFace: PathNode | null = this.getPathFaceNode(x, y - 1, z - 1, FaceType.UP);
		if (up_downFace !== null) {
			this._tempNodes.push(up_downFace);
			PathUtils.removeNode(this._tempNodes, flat_downFace);
		}
		const up_leftFace: PathNode | null = this.getPathFaceNode(x - 1, y, z - 1, FaceType.RIGHT);
		if (up_leftFace !== null) {
			this._tempNodes.push(up_leftFace);
			PathUtils.removeNode(this._tempNodes, flat_leftFace);
		}
		const up_rightFace: PathNode | null = this.getPathFaceNode(x + 1, y, z - 1, FaceType.LEFT);
		if (up_rightFace !== null) {
			this._tempNodes.push(up_rightFace);
			PathUtils.removeNode(this._tempNodes, flat_rightFace);
		}

		return this._tempNodes;
	}

	private getBackNeighbors(pNode: PathNode) {
		const x = pNode.x;
		const y = pNode.y;
		const z = pNode.z;
		// 当前块面
		const upFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.UP);
		if (upFace !== null) {
			this._tempNodes.push(upFace);
		}
		const downFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.DOWN);
		if (downFace !== null) {
			this._tempNodes.push(downFace);
		}
		const leftFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.LEFT);
		if (leftFace !== null) {
			this._tempNodes.push(leftFace);
		}
		const rightFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.RIGHT);
		if (rightFace !== null) {
			this._tempNodes.push(rightFace);
		}
		// 当前块平层的可通面
		const flat_upFace: PathNode | null = this.getPathFaceNode(x, y + 1, z, FaceType.BACK);
		if (flat_upFace !== null) {
			this._tempNodes.push(flat_upFace);
			PathUtils.removeNode(this._tempNodes, upFace);
		}
		const flat_downFace: PathNode | null = this.getPathFaceNode(x, y - 1, z, FaceType.BACK);
		if (flat_downFace !== null) {
			this._tempNodes.push(flat_downFace);
			PathUtils.removeNode(this._tempNodes, downFace);
		}
		const flat_leftFace: PathNode | null = this.getPathFaceNode(x - 1, y, z, FaceType.BACK);
		if (flat_leftFace !== null) {
			this._tempNodes.push(flat_leftFace);
			PathUtils.removeNode(this._tempNodes, leftFace);
		}
		const flat_rightFace: PathNode | null = this.getPathFaceNode(x + 1, y, z, FaceType.BACK);
		if (flat_rightFace !== null) {
			this._tempNodes.push(flat_rightFace);
			PathUtils.removeNode(this._tempNodes, rightFace);
		}
		// 当前块前面一层可通面
		const up_upFace: PathNode | null = this.getPathFaceNode(x, y + 1, z + 1, FaceType.DOWN);
		if (up_upFace !== null) {
			this._tempNodes.push(up_upFace);
			PathUtils.removeNode(this._tempNodes, flat_upFace);
		}
		const up_downFace: PathNode | null = this.getPathFaceNode(x, y - 1, z + 1, FaceType.UP);
		if (up_downFace !== null) {
			this._tempNodes.push(up_downFace);
			PathUtils.removeNode(this._tempNodes, flat_downFace);
		}
		const up_leftFace: PathNode | null = this.getPathFaceNode(x - 1, y, z + 1, FaceType.RIGHT);
		if (up_leftFace !== null) {
			this._tempNodes.push(up_leftFace);
			PathUtils.removeNode(this._tempNodes, flat_leftFace);
		}
		const up_rightFace: PathNode | null = this.getPathFaceNode(x + 1, y, z + 1, FaceType.LEFT);
		if (up_rightFace !== null) {
			this._tempNodes.push(up_rightFace);
			PathUtils.removeNode(this._tempNodes, flat_rightFace);
		}

		return this._tempNodes;
	}

	private getLeftNeighbors(pNode: PathNode): PathNode[] {
		const x = pNode.x;
		const y = pNode.y;
		const z = pNode.z;
		// 当前块面
		const upFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.UP);
		if (upFace !== null) {
			this._tempNodes.push(upFace);
		}
		const downFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.DOWN);
		if (downFace !== null) {
			this._tempNodes.push(downFace);
		}
		const frontFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.FRONT);
		if (frontFace !== null) {
			this._tempNodes.push(frontFace);
		}
		const backFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.BACK);
		if (backFace !== null) {
			this._tempNodes.push(backFace);
		}
		// 当前块平层的可通面
		const flat_upFace: PathNode | null = this.getPathFaceNode(x, y + 1, z, FaceType.LEFT);
		if (flat_upFace !== null) {
			this._tempNodes.push(flat_upFace);
			PathUtils.removeNode(this._tempNodes, upFace);
		}
		const flat_downFace: PathNode | null = this.getPathFaceNode(x, y - 1, z, FaceType.LEFT);
		if (flat_downFace !== null) {
			this._tempNodes.push(flat_downFace);
			PathUtils.removeNode(this._tempNodes, downFace);
		}
		const flat_frontFace: PathNode | null = this.getPathFaceNode(x, y, z - 1, FaceType.LEFT);
		if (flat_frontFace !== null) {
			this._tempNodes.push(flat_frontFace);
			PathUtils.removeNode(this._tempNodes, frontFace);
		}
		const flat_backFace: PathNode | null = this.getPathFaceNode(x, y, z + 1, FaceType.LEFT);
		if (flat_backFace !== null) {
			this._tempNodes.push(flat_backFace);
			PathUtils.removeNode(this._tempNodes, backFace);
		}
		// 当前块前面一层可通面
		const up_upFace: PathNode | null = this.getPathFaceNode(x - 1, y + 1, z, FaceType.DOWN);
		if (up_upFace !== null) {
			this._tempNodes.push(up_upFace);
			PathUtils.removeNode(this._tempNodes, flat_upFace);
		}
		const up_downFace: PathNode | null = this.getPathFaceNode(x - 1, y - 1, z, FaceType.UP);
		if (up_downFace !== null) {
			this._tempNodes.push(up_downFace);
			PathUtils.removeNode(this._tempNodes, flat_downFace);
		}
		const up_frontFace: PathNode | null = this.getPathFaceNode(x - 1, y, z - 1, FaceType.FRONT);
		if (up_frontFace !== null) {
			this._tempNodes.push(up_frontFace);
			PathUtils.removeNode(this._tempNodes, flat_frontFace);
		}
		const up_backFace: PathNode | null = this.getPathFaceNode(x - 1, y, z + 1, FaceType.BACK);
		if (up_backFace !== null) {
			this._tempNodes.push(up_backFace);
			PathUtils.removeNode(this._tempNodes, flat_backFace);
		}

		return this._tempNodes;
	}

	private getRightNeighbors(pNode: PathNode) {
		const x = pNode.x;
		const y = pNode.y;
		const z = pNode.z;
		// 当前块面
		const upFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.UP);
		if (upFace !== null) {
			this._tempNodes.push(upFace);
		}
		const downFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.DOWN);
		if (downFace !== null) {
			this._tempNodes.push(downFace);
		}
		const frontFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.FRONT);
		if (frontFace !== null) {
			this._tempNodes.push(frontFace);
		}
		const backFace: PathNode | null = this.getPathFaceNode(x, y, z, FaceType.BACK);
		if (backFace !== null) {
			this._tempNodes.push(backFace);
		}
		// 当前块平层的可通面
		const flat_upFace: PathNode | null = this.getPathFaceNode(x, y + 1, z, FaceType.RIGHT);
		if (flat_upFace !== null) {
			this._tempNodes.push(flat_upFace);
			PathUtils.removeNode(this._tempNodes, upFace);
		}
		const flat_downFace: PathNode | null = this.getPathFaceNode(x, y - 1, z, FaceType.RIGHT);
		if (flat_downFace !== null) {
			this._tempNodes.push(flat_downFace);
			PathUtils.removeNode(this._tempNodes, downFace);
		}
		const flat_frontFace: PathNode | null = this.getPathFaceNode(x, y, z - 1, FaceType.RIGHT);
		if (flat_frontFace !== null) {
			this._tempNodes.push(flat_frontFace);
			PathUtils.removeNode(this._tempNodes, frontFace);
		}
		const flat_backFace: PathNode | null = this.getPathFaceNode(x, y, z + 1, FaceType.RIGHT);
		if (flat_backFace !== null) {
			this._tempNodes.push(flat_backFace);
			PathUtils.removeNode(this._tempNodes, backFace);
		}
		// 当前块前面一层可通面
		const up_upFace: PathNode | null = this.getPathFaceNode(x + 1, y + 1, z, FaceType.DOWN);
		if (up_upFace !== null) {
			this._tempNodes.push(up_upFace);
			PathUtils.removeNode(this._tempNodes, flat_upFace);
		}
		const up_downFace: PathNode | null = this.getPathFaceNode(x + 1, y - 1, z, FaceType.UP);
		if (up_downFace !== null) {
			this._tempNodes.push(up_downFace);
			PathUtils.removeNode(this._tempNodes, flat_downFace);
		}
		const up_frontFace: PathNode | null = this.getPathFaceNode(x + 1, y, z - 1, FaceType.FRONT);
		if (up_frontFace !== null) {
			this._tempNodes.push(up_frontFace);
			PathUtils.removeNode(this._tempNodes, flat_frontFace);
		}
		const up_backFace: PathNode | null = this.getPathFaceNode(x + 1, y, z + 1, FaceType.BACK);
		if (up_backFace !== null) {
			this._tempNodes.push(up_backFace);
			PathUtils.removeNode(this._tempNodes, flat_backFace);
		}

		return this._tempNodes;
	}

	private pushPath(x: number, y: number, z: number): void {
		const key = PathUtils.getNodeKey(x, y, z);
		let count = this._paths.get(key);
		if (!count) {
			count = 1;
		} else {
			++count;
		}
		this._paths.set(key, count);
	}

	private removePath(x: number, y: number, z: number): void {
		const key = PathUtils.getNodeKey(x, y, z);
		let count = this._paths.get(key);
		if (!count) {
			count = 0;
		} else {
			--count;
		}

		if (count <= 0) {
			this._paths.delete(key);
		} else {
			this._paths.set(key, count);
		}
	}
}
