import { PQPay } from '../core/base/PQPay';
import { IPQOrder } from '../core/interface/IPQPay';

export class PQWebPay extends PQPay {

	public pay(
		order: IPQOrder,
		success: () => void,
		fail: () => void,
		complete: () => void
	): void {
		success && success();
	}

}
