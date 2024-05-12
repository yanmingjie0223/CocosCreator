'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const Vue = require('vue/dist/vue.common.prod');
const languageRoot = 'i18n/config';
const languageFileRoot = 'extensions/i18n/assets/config';
const languageContentTemplate = `import { languages } from "../LanguageData";\nlanguages.{{name}} = { // TODO: Dat };`;
module.exports = Editor.Panel.define({
    template: `
    <div class="content">
        <header>
            <ui-button class="transparent add"
                @confirm="add()"
            >
                <ui-icon value="add"></ui-icon>
            </ui-button>
            <ui-button class="transparent refresh"
                @confirm="refresh()"
            >
                <ui-icon value="refresh"></ui-icon>
            </ui-button>

			<ui-button class="transparent dwnload"
                @confirm="importEx()"
            >
                <ui-icon value="download"></ui-icon>
            </ui-button>

        </header>
        <section>
            <div v-for="item of list">
                <ui-icon value="eye-open"
                    v-if="item === current"
                ></ui-icon>
                <ui-icon value="eye-close"
                    v-else
                    @click="select(item)"
                ></ui-icon>
                <span>{{item}}</span>
                <ui-icon class="option" value="del"
                    @click="del(item)"
                ></ui-icon>
            </div>

            <div v-if="showAddInput">
                <ui-input ref="addInput"
                    @confirm="generateLanguageFile($event)"
                ></ui-input>
            </div>
        </section>
    <div>
    `,
    style: `
    :host { display: flex; padding: 6px; flex-direction: column; }
    :host .content { flex: 1; display: flex; flex-direction: column; }
    header { margin-bottom: 6px; }
    header > ui-button.refresh { float: right; }
    section { flex: 1; background: var(--color-normal-fill-emphasis); border-radius: calc( var(--size-normal-radius)* 1px); padding: 6px; }
    section > div { padding: 0 10px; }
    section > div > .slider { margin-right: 4px; }
    section > div > .option { float: right; display: none; }
    section > div > ui-icon { cursor: pointer; color: var(--color-warn-fill-normal); }
    section > div > ui-icon[value=eye-open] { color: var(--color-success-fill-normal); }
    section > div > ui-icon[value=del] { color: var(--color-danger-fill-normal); }
    section > div:hover { background: var(--color-normal-fill); border-radius: calc( var(--size-normal-radius)* 1px); }
    section > div:hover > .option { display: inline; }
    `,
    $: {
        content: '.content'
    },
    ready() {
        const vm = new Vue({
            el: this.$.content,
            data: {
                current: '',
                list: [],
                showAddInput: false
            },
            watch: {
                current() {
                    const vm = this;
                    Editor.Message.send('scene', 'execute-scene-script', {
                        name: 'i18n',
                        method: 'changeCurrentLanguage',
                        args: [vm.current || '']
                    });
                }
            },
            methods: {
                add() {
                    vm.showAddInput = true;
                    requestAnimationFrame(() => {
                        vm.$refs.addInput.focus();
                    });
                },
                importEx() {
                    const vm = this;
                    Editor.Message.send('scene', 'execute-scene-script', {
                        name: 'i18n',
                        method: 'importExcel',
                        args: [vm.current || '']
                    });
                },
                select(language) {
                    vm.current = language;
                },
                async del(name) {
                    const result = await Editor.Dialog.info(`确定删除 ${name} 语言文件？`, {
                        buttons: ['确认', '取消'],
                        default: 0,
                        cancel: 1
                    });
                    if (result.response === 0) {
                        let filename = name;
                        await Editor.Message.request('asset-db', 'delete-asset', `db://${languageRoot}/${filename}.ts`);
                        vm.refresh();
                    }
                },
                async refresh() {
                    const dir = (0, path_1.join)(Editor.Project.path, languageFileRoot);
                    if (!(0, fs_1.existsSync)(dir)) {
                        return;
                    }
                    vm.current =
                        (await Editor.Message.request('scene', 'execute-scene-script', {
                            name: 'i18n',
                            method: 'queryCurrentLanguage',
                            args: []
                        })) || '';
                    const names = (0, fs_1.readdirSync)(dir);
                    vm.$set(vm, 'list', []);
                    names.forEach((name) => {
                        const language = name.replace(/\.[^\.]+$/, '');
                        if (!/\./.test(language)) {
                            vm.list.push(language);
                        }
                    });
                },
                async generateLanguageFile(event) {
                    // @ts-ignore
                    const language = event.target.value;
                    if (!/[a-zA-Z]/.test(language)) {
                        console.warn(`语言名称只允许使用 a-z A-Z, ${language} 不合法`);
                        return;
                    }
                    const languageContent = languageContentTemplate.replace(/{{name}}/g, language);
                    vm.showAddInput = false;
                    await Editor.Message.request('asset-db', 'create-asset', `db://${languageRoot}/${language}.ts`, languageContent);
                    vm.refresh();
                }
            }
        });
        vm.refresh();
    }
});
