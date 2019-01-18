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

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:06:25
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2019-01-18 17:16:29
 */
export default class App {

    public static get StageManager(): StageManager {
        return StageManager.getInstance<StageManager>();
    }

    public static get LayerManager(): LayerManager {
        return LayerManager.getInstance<LayerManager>();
    }

    public static get EventManager(): EventManager {
        return EventManager.getInstance();
    }

    public static get PathManager(): PathManager {
        return PathManager.getInstance<PathManager>();
    }

    public static get ResManager(): ResManager {
        return ResManager.getInstance<ResManager>();
    }

    public static get ViewManager(): ViewManager {
        return ViewManager.getInstance<ViewManager>();
    }

    public static get ModelManager(): ModelManager {
        return ModelManager.getInstance<ModelManager>();
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