import { FaceType, PathBaseNode, PathNode } from './PathDefine';

export class PathUtils {
	public static getFaceNodeKey(x: number, y: number, z: number, face: FaceType): string {
		return `${x}_${y}_${z}_${face}`;
	}

	public static getNodeKey(x: number, y: number, z: number): string {
		return `${x}_${y}_${z}`;
	}

	public static getNodeAllKey(x: number, y: number, z: number): string[] {
		const keys: string[] = [];
		const header: string = `${x}_${y}_${z}`;
		const types = [
			FaceType.UP,
			FaceType.DOWN,
			FaceType.FRONT,
			FaceType.BACK,
			FaceType.LEFT,
			FaceType.RIGHT
		];
		types.forEach((face: FaceType) => {
			keys.push(`${header}_${face}`);
		});
		return keys;
	}

	public static copyNode(node: PathBaseNode): PathBaseNode {
		const newNode: PathBaseNode = {
			x: node.x,
			y: node.y,
			z: node.z,
			face: node.face
		};
		return newNode;
	}

	public static equal(a: PathBaseNode, b: PathBaseNode): boolean {
		if (a.x === b.x && a.y === b.y && a.z === b.z && a.face === b.face) {
			return true;
		}
		return false;
	}

	public static indexOf(paths: PathBaseNode[], node: PathBaseNode): number {
		for (let i = 0, len = paths.length; i < len; i++) {
			if (this.equal(paths[i], node)) {
				return i;
			}
		}
		return -1;
	}

	public static getDefaultNode(
		x: number = 0,
		y: number = 0,
		z: number = 0,
		face: FaceType = FaceType.UP
	): PathBaseNode {
		return {
			x: x,
			y: y,
			z: z,
			face: face
		};
	}

	public static removeNode(nodes: PathNode[], node: PathNode | null): void {
		if (node === null) {
			return;
		}

		const index = nodes.indexOf(node);
		if (index !== -1) {
			nodes.splice(index, 1);
		}
	}

	/**
	 * 将node节点数据设置到aimNode中
	 * @param into
	 * @param out
	 */
	public static setTo(into: PathBaseNode, out: PathBaseNode): void {
		out.x = into.x;
		out.y = into.y;
		out.z = into.z;
		out.face = into.face;
	}

	/**
	 * 通过xyz设置路径节点
	 * @param out
	 * @param x
	 * @param y
	 * @param z
	 */
	public static setToByXYZ(out: PathBaseNode, x: number, y: number, z: number): void {
		out.x = x;
		out.y = y;
		out.z = z;
	}
}
