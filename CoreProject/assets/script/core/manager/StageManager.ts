import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 15:04:52
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-18 18:46:30
 */
export default class StageManager extends Singleton {

    private _stageNode: cc.Node;

    public constructor() {
        super();
    }

    public init(): void {
        fgui.GRoot.create();
        this._stageNode = new cc.Node();
        this._stageNode.parent = cc.director.getScene();
        fgui.GRoot.inst.node.parent = this.stageNode;
    }

    public get stageNode(): cc.Node {
        return this._stageNode;
    }

}