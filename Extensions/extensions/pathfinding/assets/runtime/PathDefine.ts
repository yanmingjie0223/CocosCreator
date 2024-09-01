export const enum FaceType {
	UNKNOWN,
	UP,
	DOWN,
	FRONT,
	BACK,
	LEFT,
	RIGHT
}

export interface PathNode {
	/**节点属性 */
	x: number;
	y: number;
	z: number;
	/**权重 0代表不可行走 */
	w: number;

	/**寻路属性 */
	f: number;
	g: number;
	h: number;
	visited?: boolean;
	closed?: boolean;

	face: FaceType;

	/**寻路的上一节点 */
	parent: PathNode | null;
}

export interface PathBaseNode {
	/**节点属性 */
	x: number;
	y: number;
	z: number;
	face: FaceType;
}
