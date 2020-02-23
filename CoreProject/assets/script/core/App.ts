import MathUtils from "./utils/MathUtils";
import RandomUtils from "./utils/RandomUtils";
import EventManager from "./manager/EventManager";
import DateUtils from "./utils/DateUtils";
import StringUtils from "./utils/StringUtils";
import PathManager from "./manager/PathManager";
import ViewManager from "./manager/ViewManager";
import ModelManager from "./manager/ModelManager";
import ArrayUtils from "./utils/ArrayUtils";
import ResManager from "./manager/ResManager";
import DebugUtils from "./utils/DebugUtils";
import StageManager from "./manager/StageManager";
import LayerManager from "./manager/LayerManager";
import TimeManager from "./manager/TimeManager";
import FguiManager from "./manager/FguiManager";
import EffectUtils from "./utils/EffectUtils";
import SystemManager from "./manager/SystemManager";
import LoadManager from "./manager/LoadManager";
import PlatformManager from "./manager/PlatformManager";
import I18nManager from "./manager/I18nManager";
import SoundManager from "./manager/SoundManager";
import NetManager from "./manager/NetManager";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:06:25
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-12-21 21:11:00
 */
export default class App {

    public static get SoundManager(): SoundManager {
        return SoundManager.getInstance<SoundManager>();
    }

    public static get TimeManager(): TimeManager {
        return TimeManager.getInstance<TimeManager>();
    }

    public static get SystemManager(): SystemManager {
        return SystemManager.getInstance<SystemManager>();
    }

    public static get PlatformManager(): PlatformManager {
        return PlatformManager.getInstance<PlatformManager>();
    }

    public static get StageManager(): StageManager {
        return StageManager.getInstance<StageManager>();
    }

    public static get LayerManager(): LayerManager {
        return LayerManager.getInstance<LayerManager>();
    }

    public static get EventManager(): EventManager {
        return EventManager.getInstance();
    }

    public static get I18nManager(): I18nManager {
        return I18nManager.getInstance();
    }

    public static get PathManager(): PathManager {
        return PathManager.getInstance<PathManager>();
    }

    public static get LoadManager(): LoadManager {
        return LoadManager.getInstance<LoadManager>();
    }

    public static get ResManager(): ResManager {
        return ResManager.getInstance<ResManager>();
    }

    public static get ViewManager(): ViewManager {
        return ViewManager.getInstance<ViewManager>();
    }

    public static get FguiManager(): FguiManager {
        return FguiManager.getInstance<FguiManager>();
    }

    public static get ModelManager(): ModelManager {
        return ModelManager.getInstance<ModelManager>();
    }

    public static get NetManager(): NetManager {
        return NetManager.getInstance<NetManager>();
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

}