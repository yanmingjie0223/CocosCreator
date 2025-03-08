/**
 * PQStudio A group of unknown boys who create happy games
 * PQStudio The first stage 2021-2031
 */
import { PQExpoType, pqPlatformSdk, PQPlatformType } from "../core/PQIndex";
import { PQVideoExpo } from "./PQVideoExpo";
import { PQWxDotInfo } from './PQWxDotInfo';
import { PQWxLogin } from "./PQWxLogin";
import { PQWxPay } from './PQWxPay';
import { PQWxPlatform } from "./PQWxPlatform";
export * from '../core/PQIndex';

const loginMananger = pqPlatformSdk.loginMananger;
const expoMananger = pqPlatformSdk.expoMananger;
const platformMananger = pqPlatformSdk.platformMananger;

if (window['wx']) {
	platformMananger.pay = new PQWxPay();
	platformMananger.dotInfo = new PQWxDotInfo();
	loginMananger.login = new PQWxLogin();
	platformMananger.platform = new PQWxPlatform();
	platformMananger.plarmType = PQPlatformType.PT_WX;
	platformMananger.platform.keepScreenOn();
	expoMananger.register(PQExpoType.VIDEO, PQVideoExpo);
}
