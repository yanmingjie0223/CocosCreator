import { Node, UITransform } from "cc";
import Singleton from "../base/Singleton";

export default class StageManager extends Singleton {

	/**view显示节点 */
	private _uiroot: Node = null!;
	/**ui主件 */
	private _uiTranform: UITransform = null!;

	/**
	 * 场景初始化
	 */
	public initialize(uiroot: Node): void {
		this._uiroot = uiroot;
		this._uiTranform = uiroot.getComponent(UITransform)!;
	}

	/**
	 * 获取ui根节点
	 */
	public get root(): Node {
		return this._uiroot;
	}

	/**
	 * 获取舞台宽高
	 */
	public get stageWidth(): number {
		return this._uiTranform.width;
	}
	public get stageHeight(): number {
		return this._uiTranform.height;
	}

	/**
	 * 获取显示区域宽高
	 */
	public get viewWidth(): number {
		return this._uiTranform.width;
	}
	public get viewHeight(): number {
		return this._uiTranform.height;
	}

}