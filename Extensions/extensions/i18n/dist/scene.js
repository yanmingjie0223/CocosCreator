'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.unload = exports.load = void 0;
const parse_1 = require("./parse");
function load() { }
exports.load = load;
function unload() { }
exports.unload = unload;
exports.methods = {
    queryCurrentLanguage() {
        const win = window;
        return win._languageData.language;
    },
    changeCurrentLanguage(lang) {
        const win = window;
        win._languageData.init(lang);
        win._languageData.updateSceneRenderers();
        // @ts-ignore
        cce.Engine.repaintInEditMode();
    },
    importExcel() {
        const path = 'extensions/i18n/excel/language.xlsx';
        (0, parse_1.searchFile)(path, (data) => {
            // console.log('==> ', JSON.stringify(data));
            if (data.cells.length < 3) {
                console.error(`导入文件无内容或者格式错误!`);
            }
            // 语种
            const languages = {};
            const langs = data.cells[1];
            for (let i = 1; i < langs.length; i++) {
                languages[`${langs[i].v}`] = {};
            }
            // 字段
            for (let i = 2, len = data.cells.length; i < len; i++) {
                const cell = data.cells[i];
                const attribute = `${cell[0].v}`;
                for (let k = 1, kLen = cell.length; k < kLen; k++) {
                    const lang = `${langs[k].v}`;
                    languages[lang][attribute] = `${cell[k].v}`;
                }
            }
            // 文件
            for (const key in languages) {
                if (Object.prototype.hasOwnProperty.call(languages, key)) {
                    let languageContent = `import { languages } from "../LanguageData";`;
                    languageContent += `\nlanguages.${key} = ${JSON.stringify(languages[key])};`;
                    Editor.Message.request('asset-db', 'create-asset', `db://i18n/config/${key}.ts`, languageContent, {
                        overwrite: true
                    });
                }
            }
            console.log('import success!');
        });
    }
};
