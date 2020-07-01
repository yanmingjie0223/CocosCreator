import Singleton from "../base/Singleton";
import App from "../App";
import AppConfig from "../../config/AppConfig";
import { IFitItem } from "./SystemManager";
import { FitType } from "../const/CoreConst";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 15:04:52
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-07-01 21:47:52
 */
export default class StageManager extends Singleton {

    // view显示节点
    private _viewNode: cc.Node;
    // 舞台显示范围
    private _stageRect: {width: number, height: number};

    public constructor() {
        super();
    }

    /**
     * 场景初始化
     */
    public init(): void {
        fgui.GRoot.create();
        // 显示节点包装，未后面的适配做准备
        this._viewNode = new cc.Node();
        this._viewNode.name = 'stage';
        this._viewNode.parent = cc.director.getScene();
        fgui.GRoot.inst.node.parent = this.viewNode;
        // 初始化适配信息
        this.changeViewFit();
        this.initFitNode();
    }

    /**
     * 获取显示节点
     */
    public get viewNode(): cc.Node {
        return this._viewNode;
    }

    /**
     * 获取ui根节点
     */
    public get GRoot(): fgui.GRoot {
        return fgui.GRoot.inst;
    }

    /**
     * 获取舞台宽高
     */
    public get stageWidth(): number {
        return this._stageRect.width;
    }
    public get stageHeight(): number {
        return this._stageRect.height;
    }

    /**
     * 获取显示区域宽高
     */
    public get viewWidth(): number {
        return fgui.GRoot.inst.width;
    }
    public get viewHeight(): number {
        return fgui.GRoot.inst.height;
    }

    /**
     * 初始化舞台区域尺寸
     */
    private initStageRect(): void {
        const size: cc.Size = cc.view.getCanvasSize();
        size.width /= cc.view.getScaleX();
        size.height /= cc.view.getScaleY();
        this._stageRect = {
            width: size.width,
            height: size.height
        }
    }

    /**
     * 显示区域变化事件监听
     */
    private changeViewFit(): void {
        if (CC_EDITOR) {
            (cc as any).engine.on('design-resolution-changed', this.initFitNode.bind(this));
        }
        else {
            if (cc.sys.isMobile) {
                window.addEventListener('resize', this.initFitNode.bind(this));
            }
            else {
                (cc.view as any).on('canvas-resize', this.initFitNode.bind(this));
            }
        }
    }

    /**
     * 初始化适配节点
     * 这里用来调整显示区域，不同手机显示适配，具体ui适配需要ui中调整
     */
    private initFitNode(): void {
        this.initStageRect();

        let _x: number;
        let _y: number;
        let _w: number;
        let _h: number;
        const fitInfo: IFitItem = App.SystemManager.getFitInfo();
        if (fitInfo) {
            _w = fitInfo.width;
            _h = fitInfo.height;
            const alignH: string = fitInfo.alignH;
            const alignV: string = fitInfo.alignV;
            switch (alignH) {
                case FitType.ALIGN_CENTER:
                    _x = (this.stageWidth- _w) >> 1;
                    break;
                case FitType.ALIGN_LEFT:
                    _x = 0;
                    break;
                case FitType.ALIGN_RIGHT:
                    _x = this.stageWidth- _w;
                    break;
                default:
                    App.DebugUtils.error(`配置文件systemConfig.json中alignH: ${alignH}不支持！`);
                    break;
            }
            switch (alignV) {
                case FitType.ALIGN_MIDDLE:
                    _y = (this.stageHeight - _h) >> 1;
                    break;
                case FitType.ALIGN_TOP:
                    _y = 0;
                    break;
                case FitType.ALIGN_BOTTOM:
                    _y = this.stageHeight - _h;
                    break;
                default:
                    App.DebugUtils.error(`配置文件systemConfig.json中alignH: ${alignV}不支持！`);
                    break;
            }
        }
        else {
            const _sW: number = this.stageWidth / AppConfig.initWidth;
            const _sH: number = this.stageHeight / AppConfig.initHeight;
            const _minScale: number = _sH > _sW ? _sW : _sH;
            const _sP: number = this.stageHeight / this.stageWidth;
            // 如果是iPhoneX类型的高度要适当高点
            if (_sH > _sW) {
                if (_sP > 2) {
                    _w = AppConfig.initWidth * _minScale;
                    _h = (this.stageHeight * 0.9) >> 0;
                }
                else {
                    _w = this.stageWidth;
                    _h = this.stageHeight;
                }
            }
            else {
                _w = AppConfig.initWidth * _minScale;
                _h = AppConfig.initHeight * _minScale;
            }
            _x = (this.stageWidth - _w) >> 1;
            _y = (this.stageHeight - _h) >> 1;
        }
        this._viewNode.setPosition(_x, -_y);
        fgui.GRoot.inst.setSize(_w, _h);
    }

}