import { ViewLayerType, ViewType } from "../../core/const/ViewConst";
import { BaseView } from "../../core/mvc/BaseView";

export default class MainView extends BaseView {

	public static key: string = "MainView";

	public constructor() {
		super(['main/MainView'], ViewType.VIEW, ViewLayerType.WINDOW_LAYER);
	}

	public override onShown(): void {
		console.log("onshown");
	}

}