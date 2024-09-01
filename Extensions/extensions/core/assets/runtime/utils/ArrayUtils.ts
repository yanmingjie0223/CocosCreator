import Singleton from '../base/Singleton';

export class ArrayUtils extends Singleton {
	/**
	 * 打乱数组中的元素
	 * @param {Array} arr
	 */
	public upset(arr: Array<any>): void {
		arr.sort(() => Math.random() - 0.5);
	}

	/**
	 * 有序数组中二分插入
	 * @param array
	 * @param insertItem
	 * @param lessThan
	 */
	public binaryInsert<T>(
		array: T[],
		insertItem: T,
		lessThan: (insertItem: T, arrItem: T) => number
	): void {
		const arrLen = array.length;
		if (arrLen === 0) {
			array.push(insertItem);
		} else if (lessThan(insertItem, array[0]) < 0) {
			array.splice(0, 0, insertItem);
		} else if (lessThan(insertItem, array[arrLen - 1]) > 0) {
			array.push(insertItem);
		} else {
			let low = 0;
			let high = arrLen - 1;
			let middle = high >>> 1;
			for (; low <= high; middle = (low + high) >>> 1) {
				const lValue = lessThan(insertItem, array[middle]);
				let index: number;
				if (lValue < 0) {
					high = middle;
					index = middle;
				} else {
					low = middle;
					index = middle + 1;
				}
				if (high === low || high - 1 === low) {
					array.splice(index, 0, insertItem);
					break;
				}
			}
		}
	}

	/**
	 * 有序数组中二分查找
	 * @param array
	 * @param searchValue
	 * @param lessThan
	 * @returns
	 */
	public binarySearch<T, U>(
		array: T[],
		searchValue: U,
		lessThan: (searchValue: U, arrItem: T) => number
	): number {
		let low = 0;
		let high = array.length - 1;
		let middle = high >>> 1;
		for (; low <= high; middle = (low + high) >>> 1) {
			const lValue = lessThan(searchValue, array[middle]);
			if (lValue < 0) {
				high = middle - 1;
			} else if (lValue > 0) {
				low = middle + 1;
			} else {
				return middle;
			}
		}
		return ~low;
	}

	/**
	 * 倒序插入，适用于有序列插入递增或递减项
	 * @param arr
	 * @param insertItem
	 * @param lessThan
	 *
	 * exp:
	 * 		const arr = [1, 4, 6];
	 * 		ArrayUtils.getInstance<ArrayUtils>().reverseInsert(arr, 5, (insertItem, arrItem) => { return insertItem - arrItem; });
	 *
	 * exp2:
	 * 		const arr = [{a: 1}, {a: 2}, {a: 3}];
	 * 		ArrayUtils.getInstance<ArrayUtils>().reverseInsert(arr, {a: 5}, (insertItem, arrItem) => { return insertItem.a - arrItem.a; });
	 */
	public reverseInsert<T>(
		arr: T[],
		insertItem: T,
		lessThan: (insertItem: T, arrItem: T) => number | bigint
	): void {
		const len = arr.length;
		if (len === 0) {
			arr.push(insertItem);
		} else {
			for (let i = len - 1; i > -1; i--) {
				const less = lessThan(insertItem, arr[i]);
				if (less >= 0) {
					arr.splice(i + 1, 0, insertItem);
					break;
				} else if (i === 0) {
					arr.splice(0, 0, insertItem);
				}
			}
		}
	}

	/**
	 * 倒序查找-对应上面的倒序插入
	 * @param arr
	 * @param searchValue
	 * @param lessThan
	 * @returns
	 */
	public reverseSearch<T, U>(
		arr: T[],
		searchValue: U,
		lessThan: (searchValue: U, arrItem: T) => number
	): number {
		const len = arr.length;
		for (let i = len - 1; i > -1; i--) {
			const less = lessThan(searchValue, arr[i]);
			if (less === 0) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * 获取数组中对应对象临近排序列表
	 * @param arr
	 * @param index
	 * @returns
	 */
	public near<T>(arr: Array<T>, index: number): Array<T> {
		const sortArr: Array<T> = [];
		const arrLen = arr.length;
		const halfMaxLen = Math.ceil(arrLen / 2) + 1;
		let pCount = 0;
		for (let i = 0; i < halfMaxLen; i++) {
			let leftIndex = index - i;
			if (leftIndex < 0) {
				leftIndex += arrLen;
			}
			let rightIndex = index + i;
			if (rightIndex >= arrLen) {
				rightIndex -= arrLen;
			}

			const leftItem = arr[leftIndex];
			sortArr.push(leftItem);
			++pCount;

			if (leftIndex !== rightIndex) {
				const rightItem = arr[rightIndex];
				sortArr.push(rightItem);
				++pCount;
			}

			if (pCount >= arrLen) {
				break;
			}
		}
		return sortArr;
	}

	/**
	 * 判断两数组是否内容相同
	 * @param a
	 * @param b
	 * @returns
	 */
	public equal(a: string[] | number[], b: string[] | number[]): boolean {
		if (a === b) {
			return true;
		}

		if (!a || !b) {
			return false;
		}

		if (a.length !== b.length) {
			return false;
		}

		for (let i = 0, len = a.length; i < len; i++) {
			const index = b.indexOf(a[i] as never);
			if (index === -1) {
				return false;
			}
		}

		return true;
	}
}
