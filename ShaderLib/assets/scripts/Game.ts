import { _decorator, Component, DynamicAtlasManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    start() {
        DynamicAtlasManager.instance.enabled = false;
    }
}
