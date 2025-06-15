import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import Colyseus from 'db://colyseus-sdk/colyseus.js';
import * as proto from "../../protocol/index";
import EventManager from "../manager/EventManager";
import { MessageEvent } from "../manager/WSManager";
import DebugUtils from "./DebugUtils";

/**
 * Obtain the protocol Class based on the protocol id
 * @param msgId
 * @returns
 */
export function getProtocolClass(msgId: proto.msg.MsgId): any {
	const idName = proto.msg.MsgId[msgId];
	if (!idName) {
		DebugUtils.getInstance<DebugUtils>().error(`not found in msg.proto. id: ${msgId}`);
		return null;
	}

	const idNameArr = idName.split("_");
	if (idNameArr.length < 3) {
		DebugUtils.getInstance<DebugUtils>().error(`Protocol naming: Protocol-pkg_end-to-end_protocol-name. for example: Login_C2S_Login`);
		return null;
	}

	const pkgName = idNameArr.shift()!.toLowerCase();
	const pkgClass = (proto as any)[pkgName];
	if (!pkgClass) {
		DebugUtils.getInstance<DebugUtils>().error(`not found protocol pkg: ${pkgName}.proto`);
		return null;
	}

	const protoName = idNameArr.join('_');
	const protoClass = pkgClass[protoName];
	if (!protoClass) {
		DebugUtils.getInstance<DebugUtils>().error(`not found in ${pkgName}.proto: ${protoName}`);
		return null;
	}

	return protoClass;
}

/**
 * 处理分发协议
 * @param uint8s
 */
export function dealProtocol(uint8s: Uint8Array): void {
	const reader = new BinaryReader(uint8s);
	const msgId = reader.int32();
	if (!msgId) {
		DebugUtils.getInstance<DebugUtils>().error(`This Uint8Array parsing error checks whether the protocol id header has been written`);
		return;
	}

	const protoClass = getProtocolClass(msgId);
	if (!protoClass) {
		DebugUtils.getInstance<DebugUtils>().error(`This Uint8Array parsing error: ${msgId}`);
		return;
	}

	const protoObj = protoClass.decode(reader);
	EventManager.getInstance<EventManager>().emitEvent(msgId, protoObj);
}

/**
 * Obtain the transmission Uint8Array based on the protocol id and protocol object
 * @param msgId
 * @param protoObj
 * @returns
 */
export function getProtocolUint8Array(msgId: proto.msg.MsgId, protoObj: any): Uint8Array | null {
	const protoClass = getProtocolClass(msgId);
	if (!protoClass) {
		return null;
	}
	// Write protocol id
	const writer = new BinaryWriter();
	writer.int32(msgId);
	protoClass.encode(protoObj, writer);
	const uint8s = writer.finish();
	return uint8s;
}

/**
 * Send protocol data
 * @param room
 * @param msgId
 * @param protoObj
 * @param event
 * @returns
 */
export function sendProtocol(
	room: Colyseus.Room,
	msgId: proto.msg.MsgId,
	protoObj: any,
	event: MessageEvent = MessageEvent.PROTO
): void {
	const uint8s = getProtocolUint8Array(msgId, protoObj);
	if (!uint8s) {
		return;
	}
	room.send(event, uint8s);
}
