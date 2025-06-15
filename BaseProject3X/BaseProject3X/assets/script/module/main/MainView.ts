import App from "../../core/App";
import { ViewLayerType, ViewType } from "../../core/const/ViewConst";
import EventManager from "../../core/manager/EventManager";
import { BaseView } from "../../core/mvc/BaseView";
import * as proto from "../../protocol/index";

export default class MainView extends BaseView {

	public static key: string = "MainView";

	public constructor() {
		super(['main/MainView'], ViewType.VIEW, ViewLayerType.WINDOW_LAYER);
	}

	public override onInit(): void {
		const eventManager = EventManager.getInstance<EventManager>();
		eventManager.addEventListener(proto.msg.MsgId.User_S2C_Login, this.onLogin, this);
	}

	public override onShown(): void {
		console.log("onshown and login");
		App.WSManager.login("yanmingjie");
	}

	private onLogin(obj: proto.user.S2C_Login): void {
		console.log(`login complte: ${obj}`);
	}

}
