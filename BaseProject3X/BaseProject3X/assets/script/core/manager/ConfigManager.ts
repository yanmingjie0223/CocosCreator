import { AssetManager, BufferAsset } from "cc";
import ByteBuf from "../../luban/bright/serialization/ByteBuf";
import * as cfg from '../../luban/code/schema';
import Singleton from '../base/Singleton';
import { DirAsset } from "../const/ViewConst";
import { Nullable } from "../types/Types";
import DebugUtils from "../utils/DebugUtils";
import { UrlUtils } from "../utils/UrlUtils";
import LoadManager from "./LoadManager";
import ResManager from "./ResManager";

export default class ConfigManager extends Singleton {

	public tables: cfg.Tables = null!;

	private dataMap = new Map<string, Uint8Array>();

	public initialize(): void {
		const jsonFileNames = cfg.Tables.getTableNames();
		for (const curFileName of jsonFileNames) {
			const bytes = ResManager.getInstance<ResManager>().getRes<BufferAsset>(`${UrlUtils.data}/${curFileName}`, UrlUtils.bundleName);
			if (bytes) {
				this.dataMap.set(curFileName, new Uint8Array(bytes.buffer()));
			}
		}
		this.tables = new cfg.Tables(this.getFileData.bind(this));
		DebugUtils.getInstance<DebugUtils>().log(`初始化配置数据: ${this.tables}`);
	}

	public load(
		completeFun: () => void,
		errorFun: Nullable<(err: Error) => void>,
		progressFun: Nullable<
			(finished: number, total: number, item: AssetManager.RequestItem) => void
		>,
		thisObj: any
	): void {
		const loadManager = LoadManager.getInstance<LoadManager>();
		loadManager.loadBundle(UrlUtils.bundleName, () => {
			loadManager.loadDir({
				url: `${UrlUtils.data}`,
				bundle: UrlUtils.bundleName,
				type: DirAsset,
			}, completeFun, errorFun, progressFun, thisObj);
		}, null, null, this);
	}

	private getFileData(fileName: string): ByteBuf {
		if (this.dataMap.has(fileName)) {
			return new ByteBuf(this.dataMap.get(fileName));
		}
		return null!;
	}
}
