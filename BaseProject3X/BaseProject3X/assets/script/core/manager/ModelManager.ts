import Singleton from "../base/Singleton";
import BaseModel from "../mvc/BaseModel";
import DebugUtils from "../utils/DebugUtils";

export default class ModelManager extends Singleton {

	private _modelMap: Map<string, BaseModel> = null!;

	public initialize(): void {
		this._modelMap = new Map();
		// todo: 初始化所有model数据源对象
	}

	/**
	 * 注册model对象源
	 * @param modelClass model类
	 */
	public register(modelClass: { new(): BaseModel }): void {
		const key: string = (modelClass as any).key;
		if (key && !this._modelMap.get(key)) {
			const model: BaseModel = new modelClass();
			this._modelMap.set(key, model);
		}
		else {
			const debugUtils = DebugUtils.getInstance<DebugUtils>();
			if (!key) {
				debugUtils.error('注册的该model不存在key');
			}
			else {
				debugUtils.warn('注册的该model已存在，请使用统一数据源！');
			}
		}
	}

	/**
	 * 获取model对象源
	 * @param modelClass model类
	 */
	public getModel<T>(modelClass: { new(): T } | null): T | null {
		if (!modelClass) {
			return null;
		}
		const key: string = (modelClass as any).key;
		if (this._modelMap && this._modelMap.get(key)) {
			return this._modelMap.get(key) as T;
		}
		else {
			const debugUtils = DebugUtils.getInstance<DebugUtils>();
			debugUtils.warn('获取model数据源对象不存在！');
		}
		return null;
	}

	/**
	 * 销毁model数据源
	 * @param modelClass
	 */
	public destroy(modelClass: { new(): BaseModel }): void {
		if (!modelClass || !this._modelMap) {
			return;
		}
		const key: string = (modelClass as any).key;
		const model = this._modelMap.get(key);
		if (model) {
			model.destroy();
		}
	}

	/**
	 * 是否存在该model源
	 * @param modelClass model类
	 */
	public isExist(modelClass: { new(): BaseModel }): boolean {
		const key: string = (modelClass as any).key;
		if (this._modelMap && this._modelMap.get(key)) {
			return true;
		}
		return false;
	}

}
