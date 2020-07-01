import App from "../../App";
import BaseModel from "../model/BaseModel";
import BaseViewData from "./BaseViewData";
import BaseCtrl from "../ctrl/BaseCtrl";
import BComponent from "../../base/BComponent";
import AppConfig from "../../../config/AppConfig";
import { ViewType } from "../../const/CoreConst";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 19:02:44
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-07-01 21:49:52
 */
export default class BaseView extends BComponent {

    // viewType类型
    private _type: number;
    // 界面展开动画类型
    private _aniType: string;
    // view所属层级
    private _layer: string;
    // 包名
    private _pkgName: string;
    // 单个界面资源
    private _resName: string;
    // 模块数据源
    private _model: BaseModel;
    // 界面控制
    private _ctrl: BaseCtrl;

    // 是否初始化
    private _isInit: boolean;
    // 是否消耗
    private _isDestroy: boolean;
    // 是否托管资源
    private _isTrust: boolean;
    // view透传数据
    private _viewData: BaseViewData

    // 蒙层背景组件
    private _bgLoader: fgui.GLoader;
    // 主体组件
    private _contentPane: fgui.GComponent;
    // 旋转加载屏蔽组件
    private _modalWaitPane: fgui.GComponent;

    /**
     * 构造函数
     * @param pkgName 包名
     * @param resName 界面view文件名
     * @param type 界面类型，ViewType
     * @param layer 界面显示在哪层中
     */
    public constructor(pkgName: string, resName: string, type: number, layer: string) {
        super();
        this._pkgName = pkgName;
        this._resName = resName;
        this._type = type;
        this._layer = layer;
    }

    /**
     * view透传数据
     */
    public set viewData(_viewData: BaseViewData) {
        this._viewData = _viewData;
    }
    public get viewData(): BaseViewData {
        return this._viewData;
    }

    /**
     * model数据
     */
    public set model(_model: BaseModel) {
        this._model = _model;
        this._ctrl && (this._ctrl.model = _model);
    }
    public get model(): BaseModel {
        return this._model;
    }

    /**
     * ctrl控制
     */
    public set ctrl(_ctrl: BaseCtrl) {
        this._ctrl = _ctrl;
        this._ctrl && (this._ctrl.view = this);
    }
    public get ctrl(): BaseCtrl {
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
        this.setSize(this._contentPane.width, this._contentPane.height);
        this._contentPane.addRelation(this, fgui.RelationType.Size);
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
    public get type(): number {
        return this._type;
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
        App.ResManager.removeGroupUse(this._pkgName, this.isTrust);
        this._ctrl && this._ctrl.destroy();
        this._isDestroy = true;
        this._isInit = false;

        this._pkgName = null;
        this._resName = null;
        this._ctrl = null;
        this._model = null;
        if (this._bgLoader) {
            this._bgLoader.dispose();
            this._bgLoader = null;
        }
        if (this._modalWaitPane) {
            this._modalWaitPane.dispose();
            this._modalWaitPane = null;
        }
        if (this._contentPane) {
            this._contentPane.dispose();
            this._contentPane = null;
        }
        this.dispose();
    }

    /**
     * 加载旋转提示
     */
    public showModalWait(): void {
        if (fgui.UIConfig.windowModalWaiting) {
            if (!this._modalWaitPane) {
                this._modalWaitPane = fgui.UIPackage.createObjectFromURL(fgui.UIConfig.windowModalWaiting).asCom;
            }
            this.addChild(this._modalWaitPane);
            this._modalWaitPane.setSize(App.StageManager.viewWidth, App.StageManager.viewHeight);
        }
    }
    public closeModalWait(): void {
        if (this._modalWaitPane && this._modalWaitPane.parent != null){
            this.removeChild(this._modalWaitPane);
        }
    }

    /**
     * 界面显示接口
     */
    public show(): void {
        // view显示区域跟随显示区域变化size
        this.addRelation(App.StageManager.GRoot, fgui.RelationType.Size);
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
        // todo: 操作展开动画
        this.onCompleteAnimation();
    }

    /**
     * 继承重写window中的onInit方法
     */
    private initStart(): void {
        if (!this._pkgName || !this._resName) {
            App.DebugUtils.warn('该界面包名不存在！');
            return;
        }

        this.showModalWait();
        App.ResManager.addGroupUse(this._pkgName, this.isTrust);
        const isExistPkg: boolean = fgui.UIPackage.getByName(this._pkgName) ? true : false;
        if (!this._isInit || !isExistPkg) {
            App.LoadManager.loadPackage(this._pkgName, this.toInitUI, this.destroy, this.onProgress, this);
        }
        else {
            this.onCompleteUI();
        }
    }

    /**
     * 初始化ui
     */
    private toInitUI(): void {
        this.contentPane = fgui.UIPackage.createObject(this._pkgName, this._resName).asCom;
        let childCom: fgui.GObject;
        let childName: string;
        const childNum: number = this.contentPane.numChildren;
        for (let i: number = 0; i < childNum; i++) {
            childCom = this.contentPane.getChildAt(i);
            childName = childCom.name;
            if (this[`_${childName}`] !== void 0) {
                this[`_${childName}`] = childCom;
            }
        }
        this.setSize(App.StageManager.viewWidth, App.StageManager.viewHeight);
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
        // 背景蒙层点击事件
        if (this._bgLoader) {
            this._bgLoader.offClick(this.onClickMatte, this);
            this._bgLoader.onClick(this.onClickMatte, this);
        }
        // 完全显示方法，给继承子类用
        this.onShown();
    }

    /**
     * 显示类型ViewType背景控制
     */
    private onWindowBG(): void {
        if (this.type === ViewType.VIEW) {
            if (this._bgLoader) {
                this._bgLoader.dispose();
                this._bgLoader = null;
            }
        }
        else {
            if (!this._bgLoader) {
                this._bgLoader = new fgui.GLoader();
                this._bgLoader.setSize(App.StageManager.viewWidth, App.StageManager.viewHeight);
                this._bgLoader.touchable = true;
                if (this.type === ViewType.X_WINDOW) {
                    this._bgLoader.url = AppConfig.matteUrl;
                    this._bgLoader.fill = fgui.LoaderFillType.ScaleFree;
                }
                this._bgLoader.alpha = 0.6;
                this.contentPane.addChildAt(this._bgLoader, 0);
            }
        }
    }

}