import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie
 * @Date: 2019-12-17 23:30:15
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-07-19 23:26:44
 */
export default class SoundManager extends Singleton {

    private _musicId: number;
    private _effect: { [url: string]: number };

    public init(): void {
        this._musicId = null;
        this._effect = {};
    }

    /**
     * 播放背景音乐
     * @param url
     * @param isLoop
     * @param isRes 是否resources中资源
     */
    public playMusic(url: string, isLoop: boolean = true, isRes: boolean = true): void {
        if (isRes) {
            cc.resources.load(url, cc.AudioClip, (err, clip: cc.AudioClip) => {
                if (err) {
                    cc.error(`加载资源出错 ${url}`);
                    return;
                }
                if (this._musicId) {
                    cc.audioEngine.stop(this._musicId);
                }
                this._musicId = cc.audioEngine.playMusic(clip, isLoop);
            });
        }
        else {
            cc.assetManager.loadRemote(url, (err, clip: cc.AudioClip) => {
                if (err) {
                    cc.error(`加载资源出错 ${url}`);
                    return;
                }
                if (this._musicId) {
                    cc.audioEngine.stop(this._musicId);
                }
                this._musicId = cc.audioEngine.playMusic(clip, isLoop);
            });
        }
    }

    /**
     * 播放音效
     * @param url
     * @param isLoop
     * @param isRes 是否resources中资源
     */
    public playEffect(url: string, isLoop: boolean = false, isRes: boolean = true): void {
        if (isRes) {
            cc.resources.load(url, cc.AudioClip, (err, clip: cc.AudioClip) => {
                if (err) {
                    cc.error(`加载资源出错 ${url}`);
                    return;
                }
                const audioID = cc.audioEngine.playEffect(clip, isLoop);
                if (this._effect[url]) {
                    cc.audioEngine.stop(this._effect[url]);
                }
                this._effect[url] = audioID;
            });
        }
        else {
            cc.assetManager.loadRemote(url, (err, clip: cc.AudioClip) => {
                if (err) {
                    cc.error(`加载资源出错 ${url}`);
                    return;
                }
                const audioID = cc.audioEngine.playEffect(clip, isLoop);
                if (this._effect[url]) {
                    cc.audioEngine.stop(this._effect[url]);
                }
                this._effect[url] = audioID;
            });
        }

    }

    public stopMusic(): void {
        cc.audioEngine.stopMusic();
    }

    public stopEffect(url: string): void {
        if (this._effect[url]) {
            cc.audioEngine.stopEffect(this._effect[url]);
            delete this._effect[url];
        }
    }

    public effectPlaying(url: string): boolean {
        const audioID = this._effect[url];
        if (audioID) {
            const state = cc.audioEngine.getState(audioID);
            if (state === cc.audioEngine.AudioState.PLAYING) {
                return true;
            }
        }
        return false;
    }

    public stopAllEffect(): void {
        for (const url in this._effect) {
            if (this._effect.hasOwnProperty(url)) {
                cc.audioEngine.stopEffect(this._effect[url]);
            }
        }
        this._effect = {};
    }

    public pauseMusic(): void {
        cc.audioEngine.pause(this._musicId);
    }

    public resumeMusic(): void {
        cc.audioEngine.resumeMusic();
    }

}