/**
 * PQStudio A group of unknown boys who create happy games
 * PQStudio The first stage 2021-2031
 */
import { PQExpoType, pqPlatformSdk, PQPlatformType } from "../core/PQIndex";
import { PQWebDotInfo } from './PQWebDotInfo';
import { PQWebLogin } from './PQWebLogin';
import { PQWebPay } from './PQWebPay';
import { PQWebPlatform } from './PQWebPlatform';
import { PQWebVideoExpo } from './PQWebVideoExpo';
export * from '../core/PQIndex';

const loginMananger = pqPlatformSdk.loginMananger;
const expoMananger = pqPlatformSdk.expoMananger;
const platformMananger = pqPlatformSdk.platformMananger;

platformMananger.pay = new PQWebPay();
platformMananger.dotInfo = new PQWebDotInfo();
loginMananger.login = new PQWebLogin();
platformMananger.platform = new PQWebPlatform();
platformMananger.plarmType = PQPlatformType.PT_WEB;
expoMananger.register(PQExpoType.VIDEO, PQWebVideoExpo);
