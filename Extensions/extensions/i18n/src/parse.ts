import xlsx from 'xlsx';
import { remote } from 'electron';
import { join } from 'path';

export interface XlsxData {
	name: string;
	cells: Array<{ fc: string; v: number | string }[]>;
}

export function searchFile(pathUrl: string, complete: (data: XlsxData) => void): void {
	remote.dialog
		.showOpenDialog({
			title: '请选择文件',
			//修改确认按钮
			buttonLabel: '确认读取',
			//文件过滤
			filters: [{ name: 'txt', extensions: ['xlsx'] }],
			defaultPath: join(Editor.Project.path, pathUrl)
		})
		.then((result) => {
			const fileName: string = result.filePaths[0];
			if (fileName) {
				const xlsxData = parseXlsx(fileName);
				complete && complete(xlsxData);
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

function numToChar(number: number): string {
	let numeric = (number - 1) % 26;
	let letter = chr(65 + numeric);
	//@ts-ignore
	let number2 = parseInt((number - 1) / 26);
	if (number2 > 0) {
		return numToChar(number2) + letter;
	} else {
		return letter;
	}
}

function chr(codePt: number) {
	if (codePt > 0xffff) {
		codePt -= 0x10000;
		return String.fromCharCode(0xd800 + (codePt >> 10), 0xdc00 + (codePt & 0x3ff));
	}
	return String.fromCharCode(codePt);
}

function charToNum(val: string) {
	let base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let baseNumber = base.length;

	let runningTotal = 0;
	let characterIndex = 0;
	let indexExponent = val.length - 1;

	while (characterIndex < val.length) {
		let digit = val[characterIndex];
		let digitValue = base.indexOf(digit) + 1;
		runningTotal += Math.pow(baseNumber, indexExponent) * digitValue;

		characterIndex += 1;
		indexExponent -= 1;
	}

	return runningTotal;
}

function parseXlsx(filePath: string): XlsxData {
	const wb = xlsx.readFile(filePath, { cellStyles: true });
	const name = filePath.split('\\').pop()!;
	// sheet 内容
	const value = wb.Sheets['Sheet1'];
	if (!value) {
		console.error(`地图表默认Sheet1即可、不需要做多余的修改!`);
		return { name: name, cells: [] };
	}

	// 说明是个空sheet
	if (!value['!ref']) {
		return { name: name, cells: [] };
	}

	//@ts-ignore
	const ref = value['!ref'].split(':');
	// 提取row
	const max_row = ref[1].match(/[A-Z]/g)!.join('');

	// 提取col
	const max_col = +ref[1].match(/[0-9]/gi)!.join('');
	const max_row_value = charToNum(max_row);

	// 需要的json必须外层是rows,内层是cells
	const sheetDatas: Array<{ fc: string; v: number }[]> = [];
	for (let i = 1, l = max_col; i <= l; i++) {
		const cells: { fc: string; v: number }[] = [];
		for (let j = 1, len = max_row_value; j <= len; j++) {
			let key = numToChar(j) + i;
			const cell = value[key];
			// 关键描述
			// v 原始值（详见数据类型部分）
			// w 格式化文本（如适用）
			// t 类型：b布尔值，e错误，n数字，d日期，s文本，z存根
			// f 单元格公式编码为A1样式的字符串（如果适用）
			// F 如果公式是数组公式，则包围数组的范围（如果适用）
			// r 富文本编码(如果适用)
			// h 丰富文本的HTML渲染（如适用）
			// c 与该电池有关的评论
			// z 与单元格相关联的数字格式字符串（如果要求）
			// l 单元格超链接对象（.Target为链接，.Tooltip为工具提示）
			// s 是单元格的风格/主题（如果适用）
			if (cell) {
				const cellObj = { fc: '', v: 0 };
				cells[j - 1] = cellObj;
				if (cell.s && cell.s.fgColor) {
					cellObj.fc = cell.s.fgColor.rgb;
				}
				if (cell.v) {
					cellObj.v = cell.v;
				}
			}
		}
		if (cells.length > 0) {
			sheetDatas.push(cells);
		}
	}
	return { name: name, cells: sheetDatas };
}
