import { easing, instantiate, isValid, Node, Prefab, Tween, tween, UIOpacity } from 'cc';
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

	/** 缩放tween */
	private _scaleTween: Tween<{ scale: number }> = null!;
	/** 透明tween */
	private _alphaTween: Tween<{ alpha: number }> = null!;

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
		const that = this;
		that._ctrl && that._ctrl.destroy();
		that._isDestroy = true;
		that._isInit = false;

		that._prefabName = null!;
		that._ctrl = null;
		that._model = null;
		if (that._contentPane) {
			that._contentPane.destroy();
			that._contentPane = null!;
		}
		if (that._scaleTween) {
			that._scaleTween.stop();
			that._scaleTween = null!;
		}
		if (that._alphaTween) {
			that._alphaTween.stop();
			that._alphaTween = null!;
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
		const that = this;
		if (that._type === ViewType.WINDOW || that._type === ViewType.X_WINDOW) {
			if (that._scaleTween) {
				that._scaleTween.stop();
				that._scaleTween = null!;
			}
			// 缩放
			const scaleObj = { scale: 0 };
			that._scaleTween = tween(scaleObj).to(0.5, { scale: 1 }, {
				easing: easing.quadOut,
				onUpdate(target, ratio) {
					const scale = (<any>target).scale;
					if (isValid(that._viewNode)) {
						that._viewNode.setScale(scale, scale);
					}
				},
			});
			that._scaleTween.start();
			// 透明
			if (that._alphaTween) {
				that._alphaTween.stop();
				that._alphaTween = null!;
			}
			const alphaObj = { alpha: 0 };
			that._alphaTween = tween(alphaObj).to(0.5, { alpha: 1 }, {
				easing: easing.backOut,
				onUpdate(target, ratio) {
					const alpha = (<any>target).alpha * 255;
					if (isValid(that._viewNode)) {
						let uiOpacity = that._viewNode.getComponent(UIOpacity);
						if (!uiOpacity) {
							uiOpacity = that._viewNode.addComponent(UIOpacity);
						}
						uiOpacity.opacity = alpha;
					}
				},
				onComplete() {
					that.onShown();
				}
			});
			that._alphaTween.start();
		}
		else {
			that.onShown();
		}
	}

	/**
	 * 继承重写window中的onInit方法
	 */
	private initStart(): void {
		const that = this;
		if (!that._prefabName) {
			const debugUtils = DebugUtils.getInstance<DebugUtils>();
			debugUtils.warn(`${that.constructor.name}未设置界面预制体资源!`);
			return;
		}

		if (!that._isInit) {
			let isLoad: boolean = false;
			const resMgr = ResManager.getInstance<ResManager>();
			const resFiles: Array<ResFile> = [];
			for (let i = 0, len = that._prefabNames.length; i < len; i++) {
				const resFile: ResFile = {
					url: that._prefabNames[i],
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
				LoadManager.getInstance<LoadManager>().loadArray(resFiles, that.toInitUI, that.destroy, that.onProgress, that);
			}
			else {
				that.toInitUI();
			}
		}
		else {
			that.onCompleteUI();
		}
	}

	/**
	 * 初始化ui
	 */
	private toInitUI(): void {
		const that = this;
		if (that.contentPane) {
			that.onCompleteUI();
			return;
		}

		const resMgr = ResManager.getInstance<ResManager>();
		const prefab = resMgr.getRes<Prefab>(that._prefabName, UrlUtils.bundleName);
		if (prefab) {
			that.contentPane = instantiate(prefab);
			that._viewNode.addChild(that.contentPane);
			that._isInit = true;
			that.onCompleteUI();
		}
		else {
			that.destroy();
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
