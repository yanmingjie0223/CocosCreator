import App from "../../App";
import BaseModel from "../model/BaseModel";
import BaseViewData from "./BaseViewData";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 19:02:44
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-18 20:15:53
 */
export default class BaseView extends fgui.Window {
    // 类名key
    public static key: string = 'BaseView';

    // view类型
    private _type: string;
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

    // 是否初始化
    private _isInit: boolean;
    // 是否消耗
    private _isDestroy: boolean;
    // view透传数据
    private _viewData: BaseViewData

    public constructor(pkgName: string, resName: string, type: string, layer: string, viewData?: BaseViewData) {
        super();
        this._pkgName = pkgName;
        this._resName = resName;
        this._type = type;
        this._layer = layer;
        this._viewData = viewData;
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
     * 层级控制
     */
    public set layer(_layer: string) {
        this._layer = _layer;
    }
    public get layer(): string {
        return this._layer;
    }

    /**
     * model数据
     */
    public set model(_model: BaseModel) {
        this._model = _model;
    }
    public get model(): BaseModel {
        return this._model;
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
    public get type(): string {
        return this._type;
    }

    /**
     * 销毁状态
     */
    public get isDestroy(): boolean {
        return this._isDestroy;
    }

    public show(): void {
        this.onShow();
    }

    public destroy(): void {
        this._isDestroy = true;
        this._isInit = false;
        this.contentPane && this.contentPane.dispose();
        this._pkgName = null;
        this._resName = null;
        this.dispose();
    }

    protected onShow(): void {
        this.showModalWait();
        // 检查包名防止无意中消耗包
        const isExistPkg: boolean = fgui.UIPackage.getByName(this._pkgName) ? true : false;
        if (!this._isInit || !isExistPkg) {
            const url: string = App.PathManager.getPkgPath(this._pkgName);
            fgui.UIPackage.loadPackage(url, this.onLoad.bind(this));
        }
    }

    protected onLoad(err: Error): void {
        if (err) {
            this.destroy();
        }
        else {
            this.onInit();
        }
    }

    protected onInit(): void {
        if (!this._pkgName || !this._resName) {
            return;
        }

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
        this._isInit = true;
        this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        this.onWindow();
        this.closeModalWait();
        this.doHideAnimation();
    }

    /**
     * view window显示类型ViewType
     */
    private onWindow(): void {

    }

    protected doShowAnimation(): void {
        // todo: 展示动画
        this.onShown();
    }

}