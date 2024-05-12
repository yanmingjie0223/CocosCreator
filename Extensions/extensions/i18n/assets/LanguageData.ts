import { director } from 'cc';

export const languages: Record<string, Record<string, string>> = {};
export let _language: string = 'zh';
export let ready: boolean = false;

/**
 * 初始化
 * @param language
 */
export function init(language: string): void {
	ready = true;
	_language = language;
}

/**
 * 更新语言
 * @param language
 */
export function updateLang(language: string): void {
	if (languages[language]) {
		_language = language;
		updateSceneRenderers();
	}
}

/**
 * 检测语言
 * @param language
 * @returns
 */
export function checkLang(language: string): boolean {
	if (_language === language) {
		return true;
	}
	return false;
}

/**
 * 翻译数据
 * @param key
 * @param changeData
 * @returns
 */
export function t(key: string, changeData?: Record<string, string | number>): string {
	const searcher = key.split('.');

	let data: string = '';
	const languageData = languages[_language];
	for (let i = 0; i < searcher.length; i++) {
		data = languageData[searcher[i]];
		if (!data) {
			return '';
		}
	}

	if (changeData) {
		for (let j in changeData) {
			data = data.replace('${' + j + '}', `${changeData[j]}`);
		}
	}

	return data;
}

/**
 * 刷新所有使用本地化的组件
 * 节点多时会影响更新速度
 */
export function updateSceneRenderers(): void {
	const rootNodes = director.getScene()!.children;
	const allLocalizedLabels: any[] = [];
	const allLocalizedSprites: any[] = [];
	const allLocalizedMaterial: any[] = [];
	for (let i = 0; i < rootNodes.length; ++i) {
		let labels = rootNodes[i].getComponentsInChildren('LocalizedLabel');
		Array.prototype.push.apply(allLocalizedLabels, labels);

		let sprites = rootNodes[i].getComponentsInChildren('LocalizedSprite');
		Array.prototype.push.apply(allLocalizedSprites, sprites);

		let meshs = rootNodes[i].getComponentsInChildren('LocalizedMaterial');
		Array.prototype.push.apply(allLocalizedMaterial, meshs);
	}

	for (let i = 0; i < allLocalizedLabels.length; ++i) {
		let label = allLocalizedLabels[i];
		label.updateLabel();
	}
	for (let i = 0; i < allLocalizedSprites.length; ++i) {
		let sprite = allLocalizedSprites[i];
		sprite.updateSprite();
	}
	for (let i = 0; i < allLocalizedMaterial.length; ++i) {
		let mesh = allLocalizedMaterial[i];
		mesh.updateMat();
	}
}

// 供插件查询当前语言使用
(window as any)._languageData = {
	get language(): string {
		return _language;
	},
	init(lang: string): void {
		init(lang);
	},
	updateSceneRenderers(): void {
		updateSceneRenderers();
	}
};
