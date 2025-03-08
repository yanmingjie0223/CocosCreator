import { PQPay } from '../core/base/PQPay';
import { IPQOrder } from '../core/interface/IPQPay';

export class PQWxPay extends PQPay {

	public pay(
		order: IPQOrder,
		success: () => void,
		fail: () => void,
		complete: () => void
	): void {

	}

}
