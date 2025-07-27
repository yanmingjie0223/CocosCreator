import { Button, Component, Label, Layers, Node, Sprite, UITransform, Widget } from "cc";
import Singleton from "../base/Singleton";
import { BaseView } from "../mvc/BaseView";

export default class DisplayUtils extends Singleton {

	/**
	 * 创建充满父节点的容器节点
	 * @param name
	 * @param parent
	 * @returns
	 */
	public createParentFullNode(name: string, parent: Node): Node {
		const rootUiTransform = parent.getComponent(UITransform);
		const node = new Node();
		node.layer = Layers.BitMask.UI_2D;

		const uiTransform = node.addComponent(UITransform);
		uiTransform.width = rootUiTransform!.width;
		uiTransform.height = rootUiTransform!.height;
		node.name = name;

		const widget = node.addComponent(Widget);
		widget.top = 0;
		widget.bottom = 0;
		widget.left = 0;
		widget.right = 0;
		widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;

		parent.addChild(node);

		return node;
	}

	/**
	 * 绑定button到变量中
	 * @param view
	 * @param path
	 */
	public bindViewComponent(view: BaseView, path: string, comClass: typeof Component): void {
		if (!path) {
			return;
		}

		const contentPane = view.contentPane;
		const comNode = contentPane.getChildByPath(path);
		if (!comNode) {
			return;
		}

		const pathArr = path.split("/");
		(view as any)[`_${pathArr.pop()}`] = comNode.getComponent(comClass);
	}

	/**
	 * 绑定button到变量中
	 * @param view
	 * @param path
	 */
	public bindViewButton(view: BaseView, path: string): void {
		if (!path) {
			return;
		}

		const contentPane = view.contentPane;
		const comNode = contentPane.getChildByPath(path);
		if (!comNode) {
			return;
		}

		const pathArr = path.split("/");
		(view as any)[`_${pathArr.pop()}`] = comNode.getComponent(Button);
	}

	/**
	 * 绑定label到变量中
	 * @param view
	 * @param path
	 */
	public bindViewLabel(view: BaseView, path: string): void {
		if (!path) {
			return;
		}

		const contentPane = view.contentPane;
		const comNode = contentPane.getChildByPath(path);
		if (!comNode) {
			return;
		}

		const pathArr = path.split("/");
		(view as any)[`_${pathArr.pop()}`] = comNode.getComponent(Label);
	}

	/**
	 * 绑定sprite到变量中
	 * @param view
	 * @param path
	 */
	public bindViewSprite(view: BaseView, path: string): void {
		if (!path) {
			return;
		}

		const contentPane = view.contentPane;
		const comNode = contentPane.getChildByPath(path);
		if (!comNode) {
			return;
		}

		const pathArr = path.split("/");
		(view as any)[`_${pathArr.pop()}`] = comNode.getComponent(Sprite);
	}

	/**
	 * 绑定node到变量中
	 * @param view
	 * @param path
	 */
	public bindViewNode(view: BaseView, path: string): void {
		if (!path) {
			return;
		}

		const contentPane = view.contentPane;
		const comNode = contentPane.getChildByPath(path);
		if (!comNode) {
			return;
		}

		const pathArr = path.split("/");
		(view as any)[`_${pathArr.pop()}`] = comNode;
	}

}
