import Singleton from "../base/Singleton";
import App from "../App";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-23 20:20:42
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-25 10:49:30
 */
export default class EffectUtils extends Singleton {

    private _typerTf: Array<fgui.GTextField> = [];
    // 这个是二维数组和上面的tf对象对应
    private _tweenTf: Array<Array<fgui.GTweener>> = [];

    /**
     * 开启打字机效果，包含富文本ubb写法（注意不要使用[]符号，混淆ubb写法）
     * @param tfObj 文本控件
     * @param content 显示文本内容
     * @param interval 打印显示间隔
     * @param thisObj 打印完成回调this对象
     * @param callback 打印完成回调函数
     * @param agrs 打印完成回调透传参数
     */
    public startTyperEffect(tfObj: fgui.GTextField, content: string, interval: number = 120, thisObj: any = null, callback: Function = null, agrs: Array<any> = null): void {
        if (!tfObj) {
            App.DebugUtils.warn('该打字机效果对象未空！');
            return;
        }
        tfObj.text = '';
        this.stopTyperEffect(tfObj);
        this._typerTf.push(tfObj);

        const len: number = this.getTextLength(content);
        const currStr: string = this.disperseText(content);

        for (let i = 0; i < len; i++) {
            this.addTfTween(tfObj, currStr, i, len, interval, thisObj, callback, agrs);
        }
    }

    /**
     * 停止打字机效果
     * @param tfObj 文本控件
     */
    public stopTyperEffect(tfObj: fgui.GTextField): void {
        const index: number = this._typerTf.indexOf(tfObj);
        if (index !== -1) {
            this._typerTf.splice(index, 1);
            const tweens: Array<fgui.GTweener> = this._tweenTf[index];
            for (let i = 0, len = tweens.length; i < len; i++) {
                fgui.GTween.kill(tweens[i]);
            }
            this._tweenTf.splice(index, 1);
        }
    }

    /**
     * 添加tween对象
     * @param tfObj 字体组件对象
     * @param currStr 当前显示字符串
     * @param currNum 当前显示位置
     * @param len 显示文本长度
     * @param interval 每个字符显示速度
     * @param thisObj 打印完成回调this对象
     * @param callback 打印完成回调函数
     * @param agrs 打印完成回调透传参数
     */
    private addTfTween(tfObj: fgui.GTextField, currStr: string, currNum: number, len: number, interval: number, thisObj: any = null, callback: Function = null, agrs: Array<any> = null): void {
        const mTime: number = (interval * currNum) / 1000;
        const tween: fgui.GTweener = fgui.GTween.to(0, 1, mTime);
        tween.onComplete(() => {
            if (!tfObj.node || !tfObj.node.isValid) {
                this.stopTyperEffect(tfObj);
                return;
            }
            const index: number = this._typerTf.indexOf(tfObj);
            if (index === -1) {
                return;
            }
            tfObj.text = this.getContentStr(currStr, currNum + 1);
            if (currNum === len - 1) {
                this.stopTyperEffect(tfObj);
                callback && callback.apply(thisObj, agrs);
            }
        }, this);
        const index: number = this._typerTf.indexOf(tfObj);
        if (index !== -1) {
            if (!this._tweenTf[index]) {
                this._tweenTf[index] = [];
            }
            this._tweenTf[index].push(tween);
        }
    }

    /**
     * 获取文本实在内容长度
     * @param content 文本存在ubb写法
     */
    private getTextLength(content: string): number {
        let tx: string = content.replace(/\[img\].*?\[\/img\]/g, 'm');
        tx = tx.replace(/\[.*?\]/g, '');
        return tx.length;
    }

    /**
     * 打碎字符串，将每个字符串单独成个体
     * @param content 显示字符串，里面可能包含有ubb写法
     */
    private disperseText(content: string): string {
        let currStr: string;
        let currChar: string;
        let index: number;
        let returnStr: string = '';

        for (let i = 0, len = content.length; i < len; i++) {
            currChar = content.charAt(i);
            currStr = content.slice(i);
            if (currChar === '[') {
                index = currStr.match(/\[\/.*?\]/).index;
                const temp: string = currStr.slice(index);
                index = temp.indexOf(']') + index;
                returnStr += this.ubbDisperse(currStr.slice(0, index + 1));
                i += index;
            }
            else {
                returnStr += currChar;
            }
        }
        return returnStr;
    }

    /**
     * 将ubb写法打碎
     * @param ubbStr ubb写法字符串
     */
    private ubbDisperse(ubbStr: string): string {
        // 非ubb写法
        if (ubbStr.indexOf('[/') === -1) {
            return ubbStr;
        }
        // img单个显示的不需要拆分
        if (ubbStr.indexOf('[/img]') !== -1) {
            return ubbStr;
        }
        else {
            const start: number = ubbStr.indexOf(']');
            const end: number = ubbStr.indexOf('[/');
            const str: string = ubbStr.slice(start + 1, end);
            let returnStr: string = '';
            for (let i = 0; i < str.length; i++) {
                returnStr += ubbStr.slice(0, start + 1) + str.charAt(i) + ubbStr.slice(end);
            }
            return returnStr;
        }
    }

    /**
     * 获取打印字
     * @param content 字符串包括ubb写法
     * @param fetchNum 取多少位
     */
    private getContentStr(currStr: string, fetchNum: number): string {
        let currNum: number = 0;
        let currChar: string;
        let index: number;

        for (let i = 0; i < fetchNum; i++) {
            currChar = currStr.charAt(currNum);
            if (currChar === '[') {
                index = currStr.slice(currNum).indexOf('[/');
                const addIndex: number = currStr.slice(currNum + index).indexOf(']');
                currNum += index + addIndex;
            }
            currNum++;
        }

        const returnStr: string = currStr.slice(0, currNum);
        return returnStr;
    }

}