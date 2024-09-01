import { _decorator, Component } from 'cc';
import { AStar } from '../../runtime/AStar';
import { FaceType } from '../../runtime/PathDefine';
const { ccclass, property } = _decorator;

@ccclass('PathTest')
export class PathTest extends Component {
	public start(): void {
		this.test();
	}

	public test(): void {
		var astar = new AStar();
		astar.pushPathNode(0, 0, 0);
		astar.pushPathNode(1, 0, 0);
		astar.pushPathNode(2, 0, 0);
		astar.pushPathNode(3, 0, 0);
		astar.pushPathNode(4, 0, 0);

		astar.pushPathNode(3, 1, 0);
		astar.pushPathNode(3, 1, 1);
		astar.pushPathNode(4, 1, 1);

		astar.pushPathNode(4, 2, 0);

		astar.pushPathNode(1, 3, 0);
		astar.pushPathNode(2, 3, 0);
		astar.pushPathNode(3, 3, 0);
		astar.pushPathNode(4, 3, 0);

		console.log('search start: ');
		var nodes = astar.search(0, 0, 0, FaceType.UP, 4, 3, 0, FaceType.UP);
		var len = nodes.length;
		const typestrs = ['unknown', 'up', 'down', 'front', 'back', 'left', 'right'];
		console.log('path length: ' + len);
		for (var i = 0; i < len; i++) {
			var curNode = nodes[i];
			console.log(
				'path point: ' +
					curNode.x +
					'|' +
					curNode.y +
					'|' +
					curNode.z +
					'  ' +
					typestrs[curNode.face]
			);
		}
		console.log('search end: ');
	}
}
