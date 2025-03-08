import { IPQOrder, IPQPay } from '../interface/IPQPay';

export class PQPay implements IPQPay {
	public constructor() { }
	public pay(
		order: IPQOrder,
		success: () => void,
		fail: () => void,
		complete: () => void
	): void { }
}
