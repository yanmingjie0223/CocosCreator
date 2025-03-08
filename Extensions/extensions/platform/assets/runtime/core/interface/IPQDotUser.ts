export interface IPQDotUser {
	/**
	 * 角色id
	 */
	roleId: string;
	/**
	 * 角色名字
	 */
	roleName: string;
	/**
	 * 服务器id
	 */
	serverId: string;
	/**
	 * vip等级
	 */
	vip: number;
	/**
	 * 角色等级
	 */
	level?: number;
	/**
	 * 角色战斗力
	 */
	power?: number;
	/**
	 * 钻石数量
	 */
	diamond?: number;
	/**
	 * 金币
	 */
	coin?: number;
	/**
	 * 关卡
	 */
	stage?: string;
	/**
	 * 联盟币
	 */
	guildCoin?: number;
	/**
	 * 竞技币
	 */
	arenaCoin?: number;
	/**
	 * 推演币
	 */
	deductionCoin?: number;
}
