import { Component, Node, _decorator } from "cc";
import MainView from "../module/main/MainView";
import App from "./App";
import ConfigManager from "./manager/ConfigManager";
const { ccclass, property, executionOrder } = _decorator;

@ccclass
@executionOrder(-1)
export default class AppEntry extends Component {

	@property(Node)
	private uiroot: Node = null!;

	protected onLoad(): void {
		this.initManager();
		this.loadConfig();
	}

	protected update(dt: number): void {

	}

	private loadConfig(): void {
		const configManager = ConfigManager.getInstance<ConfigManager>();
		configManager.load(() => {
			configManager.initialize();
			this.onMain();
		}, null, null, this);
	}

	private initManager(): void {
		App.DebugUtils.isDebug = true;
		App.DebugUtils.initialize();
		App.LayerManager.initialize(this.uiroot);
		App.StageManager.initialize(this.uiroot);
		App.WSManager.initialize();
	}

	private onMain(): void {
		App.ViewManager.show(MainView);
	}
}
