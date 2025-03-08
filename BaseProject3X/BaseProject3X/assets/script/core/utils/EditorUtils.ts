import { Node, Vec3 } from 'cc';
import { EDITOR } from 'cc/env';
export type ProType =
	| 'cc.Material'
	| 'String'
	| 'cc.Vec3'
	| 'Integer'
	| 'cc.Color'
	| 'cc.Object'
	| 'Boolean';

export class EditorUtils {
	/**
	 * 根据prefab资源路径创建节点
	 * @param prefabaDBUrl db://assets/...
	 * @param parent
	 * @param nodeName
	 * @returns
	 */
	public static async createrNodeByPrefabUrl(
		prefabaDBUrl: string,
		parent: Node,
		nodeName: string
	): Promise<Node | null> {
		if (EDITOR) {
			const pUuid = await Editor.Message.request('asset-db', 'query-uuid', prefabaDBUrl);
			const uuid = await Editor.Message.request('scene', 'create-node', {
				parent: parent.uuid,
				name: nodeName,
				unlinkPrefab: false,
				assetUuid: pUuid
			});
			return parent.getChildByUuid(uuid);
		}
		return null;
	}

	/**
	 * 编译器保存位置数据
	 * @param node
	 * @param pos
	 */
	public static savePosition(node: Node, pos: Vec3): void {
		if (EDITOR) {
			Editor.Message.request('scene', 'set-property', {
				uuid: node.uuid,
				path: 'position',
				dump: {
					type: 'cc.Vec3',
					value: pos
				}
			});
		}
	}

	/**
	 * 编译器保存active数据
	 * @param node
	 * @param active
	 */
	public static saveActive(node: Node, active: boolean): void {
		if (EDITOR) {
			Editor.Message.request('scene', 'set-property', {
				uuid: node.uuid,
				path: 'active',
				dump: {
					type: 'boolean',
					value: active
				}
			});
		}
	}

	/**
	 * 编译器保存缩放数据
	 * @param node
	 * @param pos
	 */
	public static saveScale(node: Node, scale: Vec3): void {
		if (EDITOR) {
			Editor.Message.request('scene', 'set-property', {
				uuid: node.uuid,
				path: 'scale',
				dump: {
					type: 'cc.Vec3',
					value: scale
				}
			});
		}
	}

	/**
	 * 编辑器保存旋转数据 欧拉角
	 * @param node
	 * @param av
	 */
	public static saveEulerAngles(node: Node, av: Vec3): void {
		if (EDITOR) {
			Editor.Message.request('scene', 'set-property', {
				uuid: node.uuid,
				path: 'eulerAngles',
				dump: {
					type: 'cc.Vec3',
					value: av
				}
			});
		}
	}

	/**
	 * 编译器保存脚本数据
	 * @param node
	 * @param componentClass
	 * @param proName
	 * @param proType
	 * @param proValue
	 * @param proIsArray
	 * @returns
	 */
	public static saveComponent(
		node: Node,
		componentClass: any,
		proName: string,
		proType: ProType,
		proValue: any,
		proIsArray: boolean = false
	): void {
		if (EDITOR) {
			const cv = node.getComponent(componentClass);
			if (!cv) {
				console.error(`该节点未存在脚本${componentClass.name}`);
				return;
			}

			const coms = node.components;
			let index = 0;
			for (let i = 0, len = coms.length; i < len; i++) {
				if (coms[i] === cv) {
					index = i;
					break;
				}
			}

			Editor.Message.request('scene', 'set-property', {
				uuid: node.uuid,
				path: `__comps__.${index}.${proName}`,
				dump: {
					type: `${proType}`,
					isArray: proIsArray,
					value: proValue
				}
			});
		}
	}

	/**
	 * 保存data数据到文件中
	 * @param fileUrl db://assets/...
	 * @param data
	 */
	public static saveFile(fileUrl: string, data: string): void {
		if (EDITOR) {
			Editor.Message.send('asset-db', 'create-asset', fileUrl, data);
		}
	}

	/**
	 * 编辑器保存当前打开场景
	 */
	public static saveScene(): void {
		if (EDITOR) {
			Editor.Message.send('scene', 'save-scene');
		}
	}
}
