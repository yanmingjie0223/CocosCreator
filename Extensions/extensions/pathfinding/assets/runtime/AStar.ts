import { error } from 'cc';
import { FaceType, PathBaseNode } from './PathDefine';
import { PathGraph } from './PathGraph';
import { PathStar } from './PathStar';

export class AStar {
	private readonly _pathGraph: PathGraph = new PathGraph();
	private readonly _pathStar: PathStar = new PathStar();

	public pushBlockNode(nodeX: number, nodeY: number, nodeZ: number): void {
		const isHasPath = this._pathGraph.checkSrcPathNode(nodeX, nodeY, nodeZ);
		if (isHasPath) {
			this._pathGraph.removeThroughNode(nodeX, nodeY, nodeZ);
			this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.UP);
			this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.LEFT);
			this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.RIGHT);
			this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.FRONT);
			this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.BACK);
			this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.DOWN);
		}
		this._pathGraph.pushBlockNode(nodeX, nodeY, nodeZ);
		// 上下前后左右邻面处理
		this._pathGraph.removePathFaceNode(nodeX, nodeY + 1, nodeZ, FaceType.DOWN);
		this._pathGraph.removePathFaceNode(nodeX, nodeY - 1, nodeZ, FaceType.UP);
		this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ - 1, FaceType.BACK);
		this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ + 1, FaceType.FRONT);
		this._pathGraph.removePathFaceNode(nodeX - 1, nodeY, nodeZ, FaceType.RIGHT);
		this._pathGraph.removePathFaceNode(nodeX + 1, nodeY, nodeZ, FaceType.LEFT);
	}

	public removeBlockNode(nodeX: number, nodeY: number, nodeZ: number): void {
		this._pathGraph.removeBlockNode(nodeX, nodeY, nodeZ);
		// 上下前后左右邻面处理
		this.checkAndAddFaceNode(nodeX, nodeY + 1, nodeZ, FaceType.DOWN);
		this.checkAndAddFaceNode(nodeX, nodeY - 1, nodeZ, FaceType.UP);
		this.checkAndAddFaceNode(nodeX, nodeY, nodeZ - 1, FaceType.BACK);
		this.checkAndAddFaceNode(nodeX, nodeY, nodeZ + 1, FaceType.FRONT);
		this.checkAndAddFaceNode(nodeX - 1, nodeY, nodeZ, FaceType.RIGHT);
		this.checkAndAddFaceNode(nodeX + 1, nodeY, nodeZ, FaceType.LEFT);
	}

	public pushPathNode(nodeX: number, nodeY: number, nodeZ: number, weight: number = 1): void {
		this._pathGraph.pushThroughNode(nodeX, nodeY, nodeZ, weight);
		this.pushPathFaceNode(nodeX, nodeY, nodeZ, FaceType.UP, weight);
		this.pushPathFaceNode(nodeX, nodeY, nodeZ, FaceType.LEFT, weight);
		this.pushPathFaceNode(nodeX, nodeY, nodeZ, FaceType.RIGHT, weight);
		this.pushPathFaceNode(nodeX, nodeY, nodeZ, FaceType.FRONT, weight);
		this.pushPathFaceNode(nodeX, nodeY, nodeZ, FaceType.BACK, weight);
		this.pushPathFaceNode(nodeX, nodeY, nodeZ, FaceType.DOWN, weight);
	}

	public pushPathFaceNode(
		nodeX: number,
		nodeY: number,
		nodeZ: number,
		face: FaceType,
		weight: number
	): void {
		// 邻面处理
		let isHasNeighborNode: boolean = null!;
		let nnx: number = nodeX;
		let nny: number = nodeY;
		let nnz: number = nodeZ;
		let nface: FaceType = null!;
		switch (face) {
			case FaceType.UP:
				nny = nodeY + 1;
				nface = FaceType.DOWN;
				break;
			case FaceType.DOWN:
				nny = nodeY - 1;
				nface = FaceType.UP;
				break;
			case FaceType.LEFT:
				nnx = nodeX - 1;
				nface = FaceType.RIGHT;
				break;
			case FaceType.RIGHT:
				nnx = nodeX + 1;
				nface = FaceType.LEFT;
				break;
			case FaceType.FRONT:
				nnz = nodeZ - 1;
				nface = FaceType.BACK;
				break;
			case FaceType.BACK:
				nnz = nodeZ + 1;
				nface = FaceType.FRONT;
				break;
			default:
				console.error(`pushPathFaceNode: not found face {${face}}!`);
				break;
		}
		if (isHasNeighborNode === null) {
			isHasNeighborNode = this._pathGraph.checkSrcHasNode(nnx, nny, nnz);
			if (isHasNeighborNode) {
				this._pathGraph.removePathFaceNode(nnx, nny, nnz, nface);
			} else {
				const isExist = this._pathGraph.checkPathFaceNode(nodeX, nodeY, nodeZ, face);
				if (!isExist) {
					this._pathGraph.pushPathFaceNode(nodeX, nodeY, nodeZ, face, weight);
				}
			}
		}
	}

	public removePathNode(nodeX: number, nodeY: number, nodeZ: number): void {
		this._pathGraph.removeThroughNode(nodeX, nodeY, nodeZ);
		this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.UP);
		this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.LEFT);
		this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.RIGHT);
		this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.FRONT);
		this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.BACK);
		this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, FaceType.DOWN);
		// 上下前后左右邻面处理
		this.checkAndAddFaceNode(nodeX, nodeY + 1, nodeZ, FaceType.DOWN);
		this.checkAndAddFaceNode(nodeX, nodeY - 1, nodeZ, FaceType.UP);
		this.checkAndAddFaceNode(nodeX, nodeY, nodeZ - 1, FaceType.BACK);
		this.checkAndAddFaceNode(nodeX, nodeY, nodeZ + 1, FaceType.FRONT);
		this.checkAndAddFaceNode(nodeX - 1, nodeY, nodeZ, FaceType.RIGHT);
		this.checkAndAddFaceNode(nodeX + 1, nodeY, nodeZ, FaceType.LEFT);
	}

	public removePathFaceNode(nodeX: number, nodeY: number, nodeZ: number, face: FaceType): void {
		this._pathGraph.removePathFaceNode(nodeX, nodeY, nodeZ, face);
	}

	public checkPathNode(nodeX: number, nodeY: number, nodeZ: number): boolean {
		return this._pathGraph.checkPathNode(nodeX, nodeY, nodeZ);
	}

	public checkPathFaceNode(nodeX: number, nodeY: number, nodeZ: number, face: FaceType): boolean {
		return this._pathGraph.checkPathFaceNode(nodeX, nodeY, nodeZ, face);
	}

	public search(
		startNodeX: number,
		startNodeY: number,
		startNodeZ: number,
		startNodeFace: FaceType,
		endNodeX: number,
		endNodeY: number,
		endNodeZ: number,
		endNodeFace: FaceType,
		isFaceSearch: boolean = true
	): PathBaseNode[] {
		const startNode = this._pathGraph.getPathFaceNode(
			startNodeX,
			startNodeY,
			startNodeZ,
			startNodeFace
		);
		const endNode = this._pathGraph.getPathFaceNode(endNodeX, endNodeY, endNodeZ, endNodeFace);
		if (startNode === null || endNode === null) {
			const sh = `${startNodeX}|${startNodeY}|${startNodeZ}`;
			const eh = `${endNodeX}|${endNodeY}|${endNodeZ}`;
			if (!startNode) {
				error(`${startNode === null ? sh : eh} 路径节点不存在 需检查`);
			}
			return [];
		}

		const nodes = this._pathStar.search(this._pathGraph, startNode, endNode, isFaceSearch);
		const length = nodes.length;
		const retVec: PathBaseNode[] = [];
		for (let i = 0; i < length; i++) {
			const curNode = nodes[i];
			const retNode = {
				x: curNode.x,
				y: curNode.y,
				z: curNode.z,
				face: curNode.face
			};
			retVec[i] = retNode;
		}
		if (retVec.length > 0) {
			retVec.splice(0, 0, {
				x: startNodeX,
				y: startNodeY,
				z: startNodeZ,
				face: startNodeFace
			});
		}

		return retVec;
	}

	public clear(): void {
		this._pathGraph.clear();
	}

	private checkAndAddFaceNode(nodeX: number, nodeY: number, nodeZ: number, face: FaceType): void {
		const weight = this._pathGraph.getPathNodeWeight(nodeX, nodeY, nodeZ);
		if (weight !== null) {
			const isExistFace = this._pathGraph.checkPathFaceNode(nodeX, nodeY, nodeZ, face);
			if (!isExistFace) {
				this._pathGraph.pushPathFaceNode(nodeX, nodeY, nodeZ, face, weight);
			}
		}
	}
}
