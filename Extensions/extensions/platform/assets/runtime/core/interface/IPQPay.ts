export interface IPQOrder {
	/**订单拼接加密字符串 */
	signature: string;
}

export interface IPQPay {

	/**
	 * 请求支付
	 * @param order
	 * @param success 支付成功
	 * @param fail 支付失败
	 * @param complete 完成回调未支付
	 */
	pay(
		order: IPQOrder,
		success: () => void,
		fail: () => void,
		complete: () => void
	): void;

}
