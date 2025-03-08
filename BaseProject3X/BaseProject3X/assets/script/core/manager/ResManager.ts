import { Asset, assetManager } from 'cc';
import Singleton from '../base/Singleton';
import { ResFile } from '../const/ViewConst';

export default class ResManager extends Singleton {
	/**
	 * 根据资源地址和bundle获取资源对象
	 * @param assetUrl
	 * @param bundleNameOrUrl
	 * @returns
	 */
	public getRes<T extends Asset>(assetUrl: string, bundleNameOrUrl: string): T | null {
		const bundle = assetManager.getBundle(bundleNameOrUrl);
		if (bundle) {
			const res = bundle.get<T>(assetUrl);
			if (!res) {
				console.error(`asset: ${assetUrl} not load! ,maybe ui root can not register`);
			}
			return res;
		}

		console.error(`bundle: "${bundleNameOrUrl}" not load! `);
		return null;
	}

	/**
	 * 尝试获取资源
	 * @param assetUrl
	 * @param bundleNameOrUrl
	 * @returns
	 */
	public tryGetRes<T extends Asset>(assetUrl: string, bundleNameOrUrl: string): T | null {
		const bundle = assetManager.getBundle(bundleNameOrUrl);
		if (bundle) {
			const res = bundle.get<T>(assetUrl);
			if (!res) {
				return null;
			}
			return res;
		}

		return null;
	}

	/**
	 * 释放资源
	 * @param resFile
	 */
	public release(resFile: ResFile): void {
		const bundle = assetManager.getBundle(resFile.bundle);
		if (bundle) {
			bundle.release(resFile.url);
		}
	}

	/**
	 * 释放bundle
	 * @param bundleName
	 */
	public releaseBundle(bundleName: string): void {
		const bundle = assetManager.getBundle(bundleName);
		if (bundle) {
			bundle.releaseAll();
			assetManager.removeBundle(bundle);
		}
	}
}
