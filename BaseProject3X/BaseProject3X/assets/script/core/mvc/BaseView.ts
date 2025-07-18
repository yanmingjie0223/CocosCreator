import { instantiate, Node, Prefab } from 'cc';
import { ResFile, ViewLayerType, ViewType } from '../const/ViewConst';
import LoadManager from '../manager/LoadManager';
import ResManager from '../manager/ResManager';
import StageManager from '../manager/StageManager';
import DebugUtils from '../utils/DebugUtils';
import DisplayUtils from '../utils/DisplayUtils';
import { UrlUtils } from '../utils/UrlUtils';
import BaseCtrl from './BaseCtrl';
import BaseModel from './BaseModel';
import BaseViewData from './BaseViewData';

export class BaseView {
	public static key: string = "";

	/**viewType类型 */
	private _type: ViewType;
	/**界面展开动画类型 */
	private _aniType: string = null!;
	/**view所属层级 */
	private _layer: ViewLayerType;
	/**包名 */
	private _prefabName: string;
	/**所有包，也就是所有依赖包资源 */
	private _prefabNames: Array<string>;
	/**模块数据源 */
	private _model: BaseModel | null = null;
	/**界面控制 */
	private _ctrl: BaseCtrl | null = null;

	/**是否初始化 */
	private _isInit: boolean = false;
	/**是否消耗 */
	private _isDestroy: boolean = false;
	/**是否托管资源 */
	private _isTrust: boolean;
	/**view透传数据 */
	private _viewData: BaseViewData | null = null;

	/**view节点 */
	private _viewNode: Node = null!;
	/**主体组件 */
	private _contentPane: Node = null!;

	/**
	 * 构造函数
	 * @param prefabNames 包名
	 * @param type 界面类型，ViewType
	 * @param layer 界面显示在哪层中
	 */
	public constructor(prefabNames: Array<string>, type: ViewType, layer: ViewLayerType) {
		this._prefabName = prefabNames[0];
		this._prefabNames = prefabNames;
		this._type = type;
		this._layer = layer;
		this._isTrust = true;
	}

	/**
	 * view透传数据
	 */
	public set viewData(_viewData: BaseViewData | null) {
		this._viewData = _viewData;
	}
	public get viewData(): BaseViewData | null {
		return this._viewData;
	}

	/**
	 * model数据
	 */
	public set model(_model: BaseModel | null) {
		this._model = _model;
		this._ctrl && (this._ctrl.model = _model);
	}
	public get model(): BaseModel | null {
		return this._model;
	}

	/**
	 * ctrl控制
	 */
	public set ctrl(_ctrl: BaseCtrl | null) {
		this._ctrl = _ctrl;
		this._ctrl && (this._ctrl.view = this);
	}
	public get ctrl(): BaseCtrl | null {
		return this._ctrl;
	}

	/**
	 * 层级控制
	 */
	public set layer(_layer: ViewLayerType) {
		this._layer = _layer;
	}
	public get layer(): ViewLayerType {
		return this._layer;
	}

	/**
	 * ui主体部分（set get）
	 */
	public set contentPane(_contentPane: Node) {
		this._contentPane = _contentPane;
		this._viewNode.addChild(this._contentPane);
	}
	public get contentPane(): Node {
		return this._contentPane;
	}

	/**
	 * 获取view的node节点
	 */
	public get node() {
		return this._viewNode;
	}

	/**
	 * 界面展开动画类型获取
	 */
	public get aniType(): string {
		return this._aniType;
	}

	/**
	 * view界面类型
	 */
	public get type(): ViewType {
		return this._type;
	}

	/**
	 * 蒙层背景透明度
	 */
	public get bgAlpha(): number {
		return 0.6;
	}

	/**
	 * 销毁状态
	 */
	public get isDestroy(): boolean {
		return this._isDestroy;
	}

	/**
	 * 是否初始化
	 */
	public get isInit(): boolean {
		return this._isInit;
	}

	/**
	 * 是否托管资源，如果界面资源不需要定时释放，可重写该方法
	 */
	public get isTrust(): boolean {
		return this._isTrust;
	}

	/**
	 * 消耗，子类可继承重写添加消耗逻辑
	 */
	public destroy(): void {
		this._ctrl && this._ctrl.destroy();
		this._isDestroy = true;
		this._isInit = false;

		this._prefabName = null!;
		this._ctrl = null;
		this._model = null;
		if (this._contentPane) {
			this._contentPane.destroy();
			this._contentPane = null!;
		}
	}

	/**
	 * 界面显示接口
	 */
	public show(): void {
		const stageManager = StageManager.getInstance<StageManager>();
		if (!this._viewNode) {
			const names = this._prefabName.split('/');
			const viewNodeName = `${names[names.length - 1]}_Root`;
			this._viewNode = DisplayUtils.getInstance<DisplayUtils>().createParentFullNode(viewNodeName, stageManager.root);
		}
		this.initStart();
	}

	/**
	 * 初始化ui结束，初始化view信息从这里开始
	 */
	protected onInit(): void { }
	/**
	 * 完全显示界面
	 */
	protected onShown(): void { }
	/**
	 * 帧刷新事件
	 */
	protected onUpdate(dt?: number): void { }
	/**
	 * 加载进度
	 */
	protected onProgress(completedCount: number, totalCount: number, item: any): void { }
	/**
	 * 背景蒙层点击方法，子类实现逻辑
	 */
	protected onClickMatte(): void { }

	/**
	 * 如果界面显示展开动画不一样可继承重写改方法
	 */
	protected onShowAnimation(): void {
		this.onShown();
	}

	/**
	 * 继承重写window中的onInit方法
	 */
	private initStart(): void {
		if (!this._prefabName) {
			const debugUtils = DebugUtils.getInstance<DebugUtils>();
			debugUtils.warn(`${this.constructor.name}未设置界面预制体资源!`);
			return;
		}

		if (!this._isInit) {
			let isLoad: boolean = false;
			const resMgr = ResManager.getInstance<ResManager>();
			const resFiles: Array<ResFile> = [];
			for (let i = 0, len = this._prefabNames.length; i < len; i++) {
				const resFile: ResFile = {
					url: this._prefabNames[i],
					bundle: UrlUtils.bundleName,
					type: Prefab
				};
				resFiles.push(resFile);
				if (!isLoad) {
					if (!resMgr.tryGetRes(resFile.url, UrlUtils.bundleName)) {
						isLoad = true;
					}
				}
			}
			if (isLoad) {
				LoadManager.getInstance<LoadManager>().loadArray(resFiles, this.toInitUI, this.destroy, this.onProgress, this);
			}
			else {
				this.onCompleteUI();
			}
		}
		else {
			this.onCompleteUI();
		}
	}

	/**
	 * 初始化ui
	 */
	private toInitUI(): void {
		if (this.contentPane) {
			this.onCompleteUI();
			return;
		}

		const resMgr = ResManager.getInstance<ResManager>();
		const prefab = resMgr.getRes<Prefab>(this._prefabName, UrlUtils.bundleName);
		if (prefab) {
			this.contentPane = instantiate(prefab);
			this._viewNode.addChild(this.contentPane);
			this._isInit = true;
			this.onCompleteUI();
		}
		else {
			this.destroy();
		}
	}

	/**
	 * ui初始化完成后
	 */
	private onCompleteUI(): void {
		this.onInit();
		this.onShowAnimation();
	}

}
