import { _decorator, Button, Component, EditBox, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {

    @property({ type: EditBox })
    private editBox: EditBox;
    @property(Button)
    private button: Button;
    @property(Label)
    private label: Label;

    private messages: string[] = [];

    start() {
        this.button.node.on(Button.EventType.CLICK, this.onBtnClick, this);
        // 监听来自主进程的消息
        (window as any).electronAPI.onFromMain((event, e2cMsg) => {
            this.messages.push(e2cMsg);
            this.showAllMessage();
        });
    }

    private onBtnClick(): void {
        const c2eMsg = this.editBox.string;
        this.messages.push(c2eMsg);
        (window as any).electronAPI.sendToMain(c2eMsg);
        this.showAllMessage();
    }

    private showAllMessage(): void {
        let labelStr = "";
        for (let i = 0, len = this.messages.length; i < len; i++) {
            labelStr += `${this.messages[i]}\n`;
        }
        this.label.string = labelStr;
    }

}

