import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2020-12-06 23:02:18
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-12-06 23:06:05
 */
export default class DisplayUtils extends Singleton {

    /**
     * 绑定fgui对象到对象中
     * @param gobj
     * @param thisObj
     */
    public bindGObject(gobj: fgui.GComponent, thisObj: any): void {
        let childCom: fgui.GObject;
        let childName: string;
        const childNum: number = gobj.numChildren;
        for (let i: number = 0; i < childNum; i++) {
            childCom = gobj.getChildAt(i);
            childName = childCom.name;
            if (thisObj[`_${childName}`] !== void 0) {
                thisObj[`_${childName}`] = childCom;
            }
        }
    }

}