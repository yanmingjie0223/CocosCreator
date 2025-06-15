import Colyseus from 'db://colyseus-sdk/colyseus.js';
import ColyseusConfig from '../../config/ColyseusConfig';
import * as proto from "../../protocol/index";
import Singleton from '../base/Singleton';
import DebugUtils from '../utils/DebugUtils';
import { dealProtocol, sendProtocol } from '../utils/ProtocolUtils';

/**
 * 服务器和客户端之间通信事件
 */
export enum MessageEvent {
	PROTO = "proto",
	LOGIN = 'login',
}

export class WSManager extends Singleton {

	private _client: Colyseus.Client | null = null;
	private _room: Colyseus.Room = null!;

	private get address(): string {
		return `ws://${ColyseusConfig.host}:${ColyseusConfig.port}`;
	}

	public get room() {
		return this._room;
	}

	private set room(value: Colyseus.Room) {
		this._room = value;
	}

	public initialize(): void {
		this._client = new Colyseus.Client(this.address);
	}

	public async login(name: string): Promise<void> {
		if (!this._client) {
			DebugUtils.getInstance<DebugUtils>().error('WSManager客户端未初始!');
			return;
		}

		this._room = await this._client!.joinOrCreate('app-room', {
			secret: ColyseusConfig.secret
		});
		this.registerHandlers();

		const loginData = proto.user.C2S_Login.create();
		loginData.nickname = name;
		sendProtocol(this._room, proto.msg.MsgId.User_C2S_Login, loginData, MessageEvent.LOGIN);
	}

	private registerHandlers(): void {
		if (this.room) {
			this.room.onLeave.once(this.onLeaveGridRoom);
			this.room.onStateChange.once(this.onRoomStateChange);
			this.room.onMessage("proto", (uint8s: Uint8Array) => {
				dealProtocol(uint8s);
			});
		} else {
			console.error(`Cannot register room handlers, room is null!`);
		}
	}

	private unregisterHandlers(): void {
		if (this.room) {
			this.room.onLeave.remove(this.onLeaveGridRoom);
			this.room.onStateChange.remove(this.onRoomStateChange);
		}
	}

	private onLeaveGridRoom(code: number): void {
		console.log(`We have left the current grid room - ${code}`);
		this.unregisterHandlers();
	}

	private onRoomStateChange(state: any): void { }

}
