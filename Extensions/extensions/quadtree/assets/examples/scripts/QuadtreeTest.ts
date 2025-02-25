import { _decorator, Component, Node } from 'cc';
import { Rectangle } from '../../runtime/Rectangle';
import { Quadtree } from '../../runtime/Quadtree';
const { ccclass, property } = _decorator;

@ccclass('QuatreeTest')
export class QuatreeTest extends Component {
	start() {
		const tree = new Quadtree({ width: 100, height: 100 });
		tree.split();

		const rect = new Rectangle({ x: 2, y: 2, width: 3, height: 3 });
		tree.insert(rect);
		tree.getIndex(rect);

		window['rect'] = rect;
		window['tree'] = tree;
		console.log(rect);
		console.log(tree);
	}
}
