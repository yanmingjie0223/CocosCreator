import { AssetManager, assetManager, path } from 'cc';
import Singleton from '../base/Singleton';
import { DirAsset, ResFile } from '../const/CoreConst';
import { Nullable } from '../types/Types';

export class NotExistExpection extends Error {
	public constructor(msg: string) {
		super(msg);
	}
}

const ne = new NotExistExpection('');

export default class LoadManager extends Singleton {
	/**
	 * 加载资源 包含文件及文件夹资源
	 * @param resFile
	 * @param completeFun
	 * @param errorFun
	 * @param progressFun
	 * @param thisObj
	 */
	public load(
		resFile: ResFile,
		completeFun: (res: any) => void,
		errorFun: Nullable<(error: Error) => void>,
		progressFun: Nullable<
			(finished: number, total: number, item: AssetManager.RequestItem) => void
		>,
		thisObj: any
	): void {
		if (resFile == null || resFile == void 0) {
			ne.message = 'resFile 不允许为空';
			errorFun && errorFun.apply(thisObj, [ne]);
			return;
		}

		if (resFile.type === DirAsset) {
			this.loadDir(resFile, completeFun, errorFun, progressFun, thisObj);
		} else {
			this.loadFile(resFile, completeFun, errorFun, progressFun, thisObj);
		}
	}

	/**
	 * 加载指定为文件的资源
	 * @param resFile
	 * @param completeFun
	 * @param errorFun
	 * @param progressFun
	 * @param thisObj
	 */
	public loadFile(
		resFile: ResFile,
		completeFun: (res: any) => void,
		errorFun: Nullable<(error: Error) => void>,
		progressFun: Nullable<
			(finished: number, total: number, item: AssetManager.RequestItem) => void
		>,
		thisObj: any
	): void {
		const bundle = assetManager.getBundle(resFile.bundle);
		if (!bundle) {
			ne.message = `${resFile.bundle} 不存在`;
			errorFun?.apply(thisObj, [ne]);
			return;
		}

		bundle.load(
			resFile.url,
			resFile.type,
			function (finished: number, total: number, item: AssetManager.RequestItem) {
				progressFun && progressFun.apply(thisObj, [finished, total, item]);
			},
			function (error: Error | null, res: any) {
				if (error) {
					errorFun && errorFun.apply(thisObj, [error]);
				} else {
					completeFun && completeFun.apply(thisObj, [res]);
				}
			}
		);
	}

	/**
	 * 加载指定为文件夹资源
	 * @param resFile
	 * @param completeFun
	 * @param errorFun
	 * @param progressFun
	 * @param thisObj
	 */
	public loadDir(
		resFile: ResFile,
		completeFun: (res: any) => void,
		errorFun: Nullable<(error: Error) => void>,
		progressFun: Nullable<
			(finished: number, total: number, item: AssetManager.RequestItem) => void
		>,
		thisObj: any
	): void {
		const bundle = assetManager.getBundle(resFile.bundle);
		if (!bundle) {
			ne.message = `${resFile.bundle}包不存在或未加载!`;
			errorFun?.apply(thisObj, [ne]);
			return;
		}
		bundle.loadDir(
			resFile.url,
			function (finished: number, total: number, item: AssetManager.RequestItem) {
				progressFun && progressFun.apply(thisObj, [finished, total, item]);
			},
			function (error: Error | null, res: any) {
				if (error) {
					errorFun && errorFun.apply(thisObj, [error]);
				} else {
					completeFun && completeFun.apply(thisObj, [res]);
				}
			}
		);
	}

	/**
	 * 加载bundle
	 * @param nameOrUrl
	 * @param completeFun
	 * @param errorFun
	 * @param progressFun
	 * @param thisObj
	 */
	public loadBundle(
		nameOrUrl: string,
		completeFun: Function,
		errorFun: Nullable<(error: Error) => void>,
		progressFun: Nullable<(progress: number) => void>,
		thisObj: any
	): void {
		const bundleName = path.basename(nameOrUrl);
		const bundle = assetManager.getBundle(bundleName);
		if (!bundle) {
			assetManager.loadBundle(
				nameOrUrl,
				function (error: Error | null, res: AssetManager.Bundle) {
					if (error) {
						errorFun && errorFun.apply(thisObj, [error]);
					} else {
						progressFun && progressFun.apply(thisObj, [1]);
						completeFun && completeFun.apply(thisObj, [res]);
					}
				}
			);
		} else {
			completeFun && completeFun.apply(thisObj, [bundle]);
		}
	}

	/**
	 * 加载多个bundle
	 * @param nameOrUrls
	 * @param completeFun
	 * @param errorFun
	 * @param progressFun
	 * @param thisObj
	 */
	public loadBundleArray(
		nameOrUrls: string[],
		completeFun: Function,
		errorFun: Function,
		progressFun: Nullable<(comCount: number, resLen: number) => void>,
		thisObj: any
	): void {
		let comCount: number = 0;
		let errCount: number = 0;
		let err: Error;
		let nameOrUrl: string;
		const resLen: number = nameOrUrls.length;
		for (let i = 0; i < resLen; i++) {
			nameOrUrl = nameOrUrls[i];
			this.loadBundle(
				nameOrUrl,
				() => {
					++comCount;
					deal();
				},
				(error: Error) => {
					++errCount;
					err = error;
					deal();
				},
				null,
				this
			);
		}
		function deal() {
			progressFun && progressFun.apply(thisObj, [comCount, resLen]);
			if (comCount + errCount < resLen) {
				return;
			}

			if (errCount > 0) {
				errorFun && errorFun.apply(thisObj, [err]);
			} else {
				completeFun && completeFun.apply(thisObj);
			}
		}
	}

	/**
	 * 加载数组资源 包含文件及文件夹资源
	 * @param resFiles
	 * @param completeFun
	 * @param errorFun
	 * @param progressFun
	 * @param thisObj
	 */
	public loadArray<T = any>(
		resFiles: ResFile[],
		completeFun: (res: T[]) => void,
		errorFun: Function,
		progressFun: Nullable<
			(finished: number, total: number, item: AssetManager.RequestItem) => void
		>,
		thisObj: any
	): void {
		let comCount: number = 0;
		let errCount: number = 0;
		let err: Error;
		let resFile: ResFile;
		const resLen: number = resFiles.length;

		const allFiles: T[] = [];
		for (let i = 0; i < resLen; i++) {
			resFile = resFiles[i];
			this.load(
				resFile,
				(res: any) => {
					++comCount;

					if (Array.isArray(res)) {
						allFiles.push(...res);
					} else {
						allFiles.push(res);
					}

					deal();
				},
				(error: Error) => {
					++errCount;
					err = error;
					deal();
				},
				progressFun,
				this
			);
		}
		function deal() {
			if (comCount + errCount < resLen) {
				return;
			}

			if (errCount > 0) {
				errorFun && errorFun.apply(thisObj, [err]);
			} else {
				completeFun && completeFun.apply(thisObj, [allFiles]);
			}
		}
	}
}
