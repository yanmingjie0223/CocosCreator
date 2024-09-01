import { Asset, AssetManager, assetManager, instantiate, Node, __private } from 'cc';
import Singleton from '../base/Singleton';
import { ResFile } from '../const/CoreConst';
import { Nullable } from '../types/Types';

export interface AddressableInfo {
	bundle: AssetManager.Bundle;
	addressableInfo: __private._cocos_asset_asset_manager_config__IAddressableInfo;
}

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

	public getPath(uuid: string): Nullable<AddressableInfo> {
		let info: Nullable<AddressableInfo> = null;
		assetManager.bundles.forEach((bundle) => {
			if (info) {
				return;
			}

			// O1
			const has = bundle.getAssetInfo(
				uuid
			) as __private._cocos_asset_asset_manager_config__IAddressableInfo;
			if (has) {
				info = {
					bundle: bundle,
					addressableInfo: has
				};
			}
		});

		return info;
	}

	public instantiate(uuid: string): Nullable<Node> {
		if (!uuid) {
			return;
		}

		const info = this.getPath(uuid);
		if (info) {
			return instantiate(this.getRes<any>(info.addressableInfo.path, info.bundle.name));
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
