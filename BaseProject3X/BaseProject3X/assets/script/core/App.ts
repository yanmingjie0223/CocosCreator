import { AudioManager } from "./manager/AudioManager";
import ConfigManager from "./manager/ConfigManager";
import EventManager from "./manager/EventManager";
import LayerManager from "./manager/LayerManager";
import LoadManager from "./manager/LoadManager";
import ModelManager from "./manager/ModelManager";
import ResManager from "./manager/ResManager";
import StageManager from "./manager/StageManager";
import StorageManager from "./manager/StorageManager";
import TimeManager from "./manager/TimeManager";
import ViewManager from "./manager/ViewManager";
import { WSManager } from "./manager/WSManager";
import ArrayUtils from "./utils/ArrayUtils";
import DateUtils from "./utils/DateUtils";
import DebugUtils from "./utils/DebugUtils";
import DisplayUtils from "./utils/DisplayUtils";
import EffectUtils from "./utils/EffectUtils";
import MathUtils from "./utils/MathUtils";
import RandomUtils from "./utils/RandomUtils";
import StringUtils from "./utils/StringUtils";

export default class App {

	public static get LayerManager(): LayerManager {
		return LayerManager.getInstance<LayerManager>();
	}

	public static get LoadManager(): LoadManager {
		return LoadManager.getInstance<LoadManager>();
	}

	public static get ModelManager(): ModelManager {
		return ModelManager.getInstance<ModelManager>();
	}

	public static get ResManager(): ResManager {
		return ResManager.getInstance<ResManager>();
	}

	public static get EventManager(): EventManager {
		return EventManager.getInstance();
	}

	public static get AudioManager(): AudioManager {
		return AudioManager.getInstance();
	}

	public static get StageManager(): StageManager {
		return StageManager.getInstance<StageManager>();
	}

	public static get ConfigManager(): ConfigManager {
		return ConfigManager.getInstance<ConfigManager>();
	}

	public static get ViewManager(): ViewManager {
		return ViewManager.getInstance<ViewManager>();
	}

	public static get ArrayUtils(): ArrayUtils {
		return ArrayUtils.getInstance<ArrayUtils>();
	}

	public static get DateUtils(): DateUtils {
		return DateUtils.getInstance<DateUtils>();
	}

	public static get DebugUtils(): DebugUtils {
		return DebugUtils.getInstance<DebugUtils>();
	}

	public static get EffectUtils(): EffectUtils {
		return EffectUtils.getInstance<EffectUtils>();
	}

	public static get MathUtils(): MathUtils {
		return MathUtils.getInstance<MathUtils>();
	}

	public static get RandomUtils(): RandomUtils {
		return RandomUtils.getInstance<RandomUtils>();
	}

	public static get StringUtils(): StringUtils {
		return StringUtils.getInstance<StringUtils>();
	}

	public static get DisplayUtils(): DisplayUtils {
		return DisplayUtils.getInstance<DisplayUtils>();
	}

	public static get WSManager(): WSManager {
		return WSManager.getInstance<WSManager>();
	}

	public static get StorageManager(): StorageManager {
		return StorageManager.getInstance<StorageManager>();
	}

	public static get TimeManager(): TimeManager {
		return TimeManager.getInstance<TimeManager>();
	}

}
