import AppConfig from "../../config/AppConfig";
import Singleton from "../base/Singleton";
import HttpRequest, { HttpEvent, HttpType, ResponseType } from "../net/HttpRequest";

/*
 * @Author: yanmingjie
 * @Date: 2019-12-21 20:55:26
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-12-24 22:08:13
 * todo: 该类为测试临时使用
 */
export default class NetManager extends Singleton {

    public sendGet(url: string, data: any, comleteFun: Function, thisObj: any): void {
        data['_token_'] = AppConfig.token;
        data['_uid_'] = AppConfig.uId;

        let dataStr: string = '';
        for (let p in data) {
            if (dataStr) {
                dataStr += `&${p}=${data[p]}`;
            }
            else {
                dataStr += `${p}=${data[p]}`;
            }
        }

        const http: HttpRequest = new HttpRequest();
        http.on(HttpEvent.COMPLETE, comleteFun, thisObj);
        http.send(`${url}?${dataStr}`, null, HttpType.GET, ResponseType.JSON);
    }

    public sendPost(url: string, data: any, comleteFun: Function, thisObj: any): void {
        data['_token_'] = AppConfig.token;
        data['_uid_'] = AppConfig.uId;

        let dataStr: string = '';
        for (let p in data) {
            if (dataStr) {
                dataStr += `&${p}=${data[p]}`;
            }
            else {
                dataStr += `${p}=${data[p]}`;
            }
        }

        const http: HttpRequest = new HttpRequest();
        http.on(HttpEvent.COMPLETE, comleteFun, thisObj);
        http.send(url, dataStr, HttpType.POST, ResponseType.JSON);
    }

}