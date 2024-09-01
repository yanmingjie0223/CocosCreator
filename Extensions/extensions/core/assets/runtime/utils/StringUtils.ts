import Singleton from '../base/Singleton';

export class StringUtils extends Singleton {
	/**
	 * 获取对应字段的信息
	 * @param key 字段
	 */
	public getQueryString(key: string) {
		const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
		const url = decodeURI(window.location.search);
		var match = url.substr(1).match(reg);
		if (match !== null) {
			return unescape(match[2]);
		}
		return null;
	}

	/**
	 * 去掉前后空格
	 * @param {string} str
	 * @returns {string}
	 */
	public trimSpace(str: string): string {
		return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
	}

	/**
	 * 将数字转换显示文案，过万用k来计量（用于物品数量等）
	 * @param count
	 * @returns
	 */
	public numberToString(count: number): string {
		let str: string;
		if (count >= 10000000 * 1000) {
			str = `${Math.floor(count / (1000000 * 1000))}KM`;
		} else if (count >= 10000000) {
			str = `${Math.floor(count / 1000000)}M`;
		} else if (count >= 10000) {
			str = `${Math.floor(count / 1000)}K`;
		} else {
			str = count + '';
		}
		return str;
	}

	/**
	 * 百万及百万以上大数值转换K显示 例如：战斗数值显示
	 * @param count
	 * @returns
	 */
	public numberToStringForDamage(count: number): string {
		let str: string;
		if (count >= 1000000) {
			str = `${Math.floor(count / 1000)}K`;
		} else {
			str = `${count}`;
		}
		return str;
	}

	/**
	 * 将数字转换显示文案，过十万用k来计量（用于战力）
	 * @param count
	 * @returns
	 */
	public numberToStringForCe(count: number): string {
		let str: string;
		if (count >= 100000000 * 1000) {
			str = `${Math.floor(count / (1000000 * 1000))}KM`;
		} else if (count >= 100000000) {
			str = `${Math.floor(count / 1000000)}M`;
		} else if (count >= 100000) {
			str = `${Math.floor(count / 1000)}K`;
		} else {
			str = count + '';
		}
		return str;
	}

	/**
	 * 获取字符串长度，中文为2
	 * @param {string} str
	 * @returns {number}
	 */
	public getLength(str: string): number {
		const strArr: Array<string> = str.split('');
		let length: number = 0;
		let indexStr: string;
		for (let i: number = 0, len: number = strArr.length; i < len; i++) {
			indexStr = strArr[i];
			if (this.isChinese(indexStr)) {
				length += 2;
			} else {
				length += 1;
			}
		}
		return length;
	}

	/**
	 * 判断一个字符串是否包含中文
	 * @param {string} str
	 * @returns {boolean}
	 */
	public isChinese(str: string): boolean {
		const reg: RegExp = /^.*[\u4E00-\u9FA5]+.*$/;
		return reg.test(str);
	}

	/**
	 * 获取一个只有首字母大写字符串
	 * @param str
	 * @returns
	 */
	public getOnlyHeadUpperCase(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}
}
