import Singleton from '../base/Singleton';

export class DateUtils extends Singleton {
	/**
	 * 格式化时间获取 例如：时分秒 00:00:00
	 * @param {number} time 时间戳差值（s）
	 * @param {number} place 取时间位，默认3取小时，例如：1：取到秒 2：取到分钟 3：取到小时
	 * @param {number} sign 隔离标记字符
	 */
	public formatTime(time: number, place: 1 | 2 | 3 = 3, sign: string[] = [':', ':', '']): string {
		let str: string = '';
		const h: number = Math.floor(time / 3600);
		const m: number = Math.floor((time - h * 3600) / 60);
		const s: number = Math.floor(time - h * 3600 - m * 60);

		if (place >= 3) {
			str += h > 0 ? `${h < 10 ? '0' + h : h}${sign[0]}` : `00${sign[0]}`;
		}
		if (place >= 2) {
			str += m > 9 ? `${m}${sign[1]}` : `0${m}${sign[1]}`;
		}
		str += s > 9 ? `${s}${sign[2]}` : `0${s}${sign[2]}`;

		return str;
	}

	/**
	 * 使用时间返回所需要的字符串格式"2016年06月12日"
	 * @param {number} time 时间戳（ms）
	 * @param {string} fmt 返回格式，例如："yyyy年MM月dd日 hh时mm分ss秒"
	 * @return {string} 返回指点格式字符串
	 */
	public millisecondsToDate(time: number, fmt: string = 'yyyy.MM.dd hh:mm:ss'): string {
		const d: Date = new Date(time);
		const o: any = {
			'M+': d.getMonth() + 1,
			'd+': d.getDate(),
			'h+': d.getHours(),
			'H+': d.getHours(),
			'm+': d.getMinutes(),
			's+': d.getSeconds(),
			'q+': Math.floor((d.getMonth() + 3) / 3),
			S: d.getMilliseconds() //毫秒
		};
		const week: any = {
			'0': '\u65e5',
			'1': '\u4e00',
			'2': '\u4e8c',
			'3': '\u4e09',
			'4': '\u56db',
			'5': '\u4e94',
			'6': '\u516d'
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		if (/(E+)/.test(fmt)) {
			fmt = fmt.replace(
				RegExp.$1,
				(RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') +
					week[d.getDay() + '']
			);
		}
		for (const k in o) {
			if (new RegExp('(' + k + ')').test(fmt)) {
				fmt = fmt.replace(
					RegExp.$1,
					RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
				);
			}
		}
		return fmt;
	}

	/**
	 * 根据时间获取星期
	 * @param time ms
	 * @returns
	 */
	public getWeek(time: number): number {
		const d: Date = new Date(time);
		const day = d.getDay();
		if (day === 0) {
			return 7;
		} else {
			return day;
		}
	}

	/**
	 * 使用相差时间返回所需要的字符串格式"天:时:分|时:分:秒"
	 * @param {number} diffT 间隔时间戳（ms）
	 * @return {string} 返回指点格式字符串
	 */
	public getResidueTime(diffT: number): string {
		if (diffT > 0) {
			const oneDay = 24 * 60 * 60 * 1000;
			const day = Math.floor(diffT / oneDay);
			const dayStr = day > 0 ? `${day}天` : '';
			const milDiffT = Math.ceil(diffT % oneDay);
			const milStr = this.formatTime(milDiffT / 1000, 3, ['时', '分', '秒']);
			let secStr = milStr;
			if (day > 0) {
				secStr = milStr.slice(0, milStr.length - 3);
			}
			const strT = dayStr + secStr;
			return strT;
		} else {
			return '00时00分00秒';
		}
	}
}
