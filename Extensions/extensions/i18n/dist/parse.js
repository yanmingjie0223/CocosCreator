"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFile = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const electron_1 = require("electron");
const path_1 = require("path");
function searchFile(pathUrl, complete) {
    electron_1.remote.dialog
        .showOpenDialog({
        title: '请选择文件',
        //修改确认按钮
        buttonLabel: '确认读取',
        //文件过滤
        filters: [{ name: 'txt', extensions: ['xlsx'] }],
        defaultPath: (0, path_1.join)(Editor.Project.path, pathUrl)
    })
        .then((result) => {
        const fileName = result.filePaths[0];
        if (fileName) {
            const xlsxData = parseXlsx(fileName);
            complete && complete(xlsxData);
        }
    })
        .catch((err) => {
        console.log(err);
    });
}
exports.searchFile = searchFile;
function numToChar(number) {
    let numeric = (number - 1) % 26;
    let letter = chr(65 + numeric);
    //@ts-ignore
    let number2 = parseInt((number - 1) / 26);
    if (number2 > 0) {
        return numToChar(number2) + letter;
    }
    else {
        return letter;
    }
}
function chr(codePt) {
    if (codePt > 0xffff) {
        codePt -= 0x10000;
        return String.fromCharCode(0xd800 + (codePt >> 10), 0xdc00 + (codePt & 0x3ff));
    }
    return String.fromCharCode(codePt);
}
function charToNum(val) {
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
function parseXlsx(filePath) {
    const wb = xlsx_1.default.readFile(filePath, { cellStyles: true });
    const name = filePath.split('\\').pop();
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
    const max_row = ref[1].match(/[A-Z]/g).join('');
    // 提取col
    const max_col = +ref[1].match(/[0-9]/gi).join('');
    const max_row_value = charToNum(max_row);
    // 需要的json必须外层是rows,内层是cells
    const sheetDatas = [];
    for (let i = 1, l = max_col; i <= l; i++) {
        const cells = [];
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
