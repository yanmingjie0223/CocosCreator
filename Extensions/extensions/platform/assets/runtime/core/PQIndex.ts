import { PQPlatformSDK } from "./manager/PQPlatformSDK";

/**
 * PQStudio A group of unknown boys who create happy games
 * PQStudio The first stage 2021-2031
 */
export * from "./base/PQDotInfo";
export * from "./base/PQExpo";
export * from "./base/PQLogin";
export * from "./base/PQPlatform";
export * from "./entity/PQConst";
export * from "./entity/PQErrorCode";
export * from "./entity/PQSystem";
export * from "./entity/PQUser";
export * from "./interface/IPQExpo";
export * from "./interface/IPQLogin";
export * from "./interface/IPQPlatform";
export * from "./interface/IPQSystem";
export * from "./interface/IPQUser";
export * from "./manager/PQExpoManager";
export * from "./manager/PQLoginManager";
export * from "./manager/PQPlatformManager";
export const pqPlatformSdk = new PQPlatformSDK();
