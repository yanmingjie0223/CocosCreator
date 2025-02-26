import AppConfig from "../../config/AppConfig";
import BComponent from "../base/BComponent";
import { ViewType } from "../const/CoreConst";
import LoadManager from "../manager/LoadManager";
import ResManager from "../manager/ResManager";
import StageManager from "../manager/StageManager";
import DebugUtils from "../utils/DebugUtils";
import DisplayUtils from "../utils/DisplayUtils";
import BaseCtrl from "./BaseCtrl";
import BaseModel from "./BaseModel";
import BaseViewData from "./BaseViewData";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 19:02:44
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-03-01 16:39:29
 */
export default class BaseView extends BComponent {

    /**viewType类型 */
    private _type: ViewType;
    /**界面展开动画类型 */
    private _aniType: string = null!;
    /**view所属层级 */
    private _layer: string;
    /**包名 */
    private _pkgName: string;
    /**所有包，也就是所有依赖包资源 */
    private _pkgNames: Array<string>;
    /**单个界面资源 */
    private _resName: string;
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

    /**蒙层背景组件 */
    private _bgLoader: fgui.GLoader = null!;
    /**主体组件 */
    private _contentPane: fgui.GComponent = null!;
    /**旋转加载屏蔽组件 */
    private _modalWaitPane: fgui.GComponent = null!;

    /**
     * 构造函数
     * @param pkgName 包名
     * @param resName 界面view文件名
     * @param type 界面类型，ViewType
     * @param layer 界面显示在哪层中
     */
    public constructor(pkgNames: Array<string>, resName: string, type: ViewType, layer: string) {
        super();
        this._pkgName = pkgNames[0];
        this._pkgNames = pkgNames;
        this._resName = resName;
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
    public set layer(_layer: string) {
        this._layer = _layer;
    }
    public get layer(): string {
        return this._layer;
    }

    /**
     * ui主体部分（set get）
     */
    public set contentPane(_contentPane: fgui.GComponent) {
        this._contentPane = _contentPane;
        this.addChild(this._contentPane);
    }
    public get contentPane(): fgui.GComponent {
        return this._contentPane;
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
     * 获取动画
     * @param name
     */
    public getTransition(name: string): fgui.Transition {
        if (this._contentPane) {
            return this._contentPane.getTransition(name);
        }
        return null!;
    }

    /**
     * 获取控制器
     * @param name
     */
    public getController(name: string): fgui.Controller {
        if (this._contentPane) {
            return this._contentPane.getController(name);
        }
        return null!;
    }

    /**
     * 消耗，子类可继承重写添加消耗逻辑
     */
    public destroy(): void {
        const resMgr = ResManager.getInstance<ResManager>();
        this._pkgNames.forEach((pkgName: string) => {
            resMgr.removeGroupUse(pkgName, this.isTrust);
        });
        this._ctrl && this._ctrl.destroy();
        this._isDestroy = true;
        this._isInit = false;

        this._pkgName = null!;
        this._resName = null!;
        this._ctrl = null;
        this._model = null;
        if (this._bgLoader) {
            this._bgLoader.dispose();
            this._bgLoader = null!;
        }
        if (this._modalWaitPane) {
            this._modalWaitPane.dispose();
            this._modalWaitPane = null!;
        }
        if (this._contentPane) {
            this._contentPane.dispose();
            this._contentPane = null!;
        }
        this.dispose();
    }

    /**
     * 显示加载旋转提示
     */
    public showModalWait(): void {
        if (fgui.UIConfig.windowModalWaiting) {
            const stageManager = StageManager.getInstance<StageManager>();
            let modalWaitPane = this._modalWaitPane;
            if (!modalWaitPane) {
                modalWaitPane = fgui.UIPackage.createObjectFromURL(fgui.UIConfig.windowModalWaiting).asCom;
                this._modalWaitPane = modalWaitPane;
            }
            modalWaitPane.x = (stageManager.viewWidth - modalWaitPane.width) >> 1;
            modalWaitPane.y = (stageManager.viewHeight - modalWaitPane.height) >> 1;
            this.addChild(modalWaitPane);
        }
    }

    /**
     * 关闭加载旋转提示
     */
    public closeModalWait(): void {
        if (this._modalWaitPane && this._modalWaitPane.parent != null){
            this.removeChild(this._modalWaitPane);
        }
    }

    /**
     * 界面显示接口
     */
    public show(): void {
        const stageManager = StageManager.getInstance<StageManager>();
		this.setSize(stageManager.viewWidth, stageManager.viewHeight);
        this.addRelation(stageManager.GRoot, fgui.RelationType.Size);
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
        // todo: 操作展开动画，默认不做任何动画
        this.onCompleteAnimation();
    }

    /**
     * 适配策略，可重写view特定策略
     */
    protected onPaneRelation(): void {
        // todo: 目前这样处理，后可拓展多个子类继承实现
        switch (this.type) {
            case ViewType.VIEW:
                this._contentPane.addRelation(this, fgui.RelationType.Size);
                break;
            case ViewType.WINDOW:
            case ViewType.X_WINDOW:
                this._contentPane.x = (this.width - this._contentPane.width) >> 1;
                this._contentPane.y = (this.height - this._contentPane.height) >> 1;
                this._contentPane.addRelation(this, fgui.RelationType.Center_Center);
                this._contentPane.addRelation(this, fgui.RelationType.Middle_Middle);
                break;
        }
    }

    /**
     * 继承重写window中的onInit方法
     */
    private initStart(): void {
        if (!this._pkgName || !this._resName) {
            const debugUtils = DebugUtils.getInstance<DebugUtils>();
            debugUtils.warn(`${this.constructor.name}未设置包名或资源！`);
            return;
        }

        this.showModalWait();
        const resMgr = ResManager.getInstance<ResManager>();
        this._pkgNames.forEach((pkgName: string) => {
            resMgr.addGroupUse(pkgName, this.isTrust);
        });
        const isExistPkg: boolean = fgui.UIPackage.getByName(this._pkgName) ? true : false;
        if (!this._isInit || !isExistPkg) {
            const loadManager = LoadManager.getInstance<LoadManager>();
            loadManager.loadArrayPackage(this._pkgNames, this.toInitUI, this.destroy, this.onProgress, this);
        }
        else {
            this.onCompleteUI();
        }
    }

    /**
     * 初始化ui
     */
    private toInitUI(): void {
        const displayUtils = DisplayUtils.getInstance<DisplayUtils>();
        this.contentPane = fgui.UIPackage.createObject(this._pkgName, this._resName).asCom;
        displayUtils.bindGObject(this.contentPane, this);
        this._contentPane.setSize(this.width, this.height);
        this.onPaneRelation();
        this._isInit = true;
        this.onCompleteUI();
    }

    /**
     * ui初始化完成后
     */
    private onCompleteUI(): void {
        this.closeModalWait();
        this.onInit();
        this.onWindowBG();
        this.onShowAnimation();
    }

    /**
     * 完成动画全部界面完全显示
     */
    private onCompleteAnimation(): void {
        if (this._bgLoader) {
            this._bgLoader.offClick(this.onClickMatte, this);
            this._bgLoader.onClick(this.onClickMatte, this);
        }
        this.onShown();
    }

    /**
     * 显示类型ViewType背景控制
     */
    private onWindowBG(): void {
        if (this.type === ViewType.VIEW) {
            if (this._bgLoader) {
                this._bgLoader.dispose();
                this._bgLoader = null!;
            }
        }
        else {
            if (!this._bgLoader) {
                this._bgLoader = new fgui.GLoader();
                this._bgLoader.setSize(this.width, this.height);
                this._bgLoader.touchable = true;
                if (this.type === ViewType.X_WINDOW) {
                    this._bgLoader.url = AppConfig.matteUrl;
                    this._bgLoader.fill = fgui.LoaderFillType.ScaleFree;
                }
                this._bgLoader.alpha = this.bgAlpha;
                this.addChildAt(this._bgLoader, 0);
            }
        }
    }

}