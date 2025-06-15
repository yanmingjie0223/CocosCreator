export type Float = number;
export type Double = number;
export type Int8 = number;
export type Int32 = number;
export type Nullable<T> = T | null | undefined;
export type ValueOf<T> = T[keyof T];

/**
 * 深度拷贝
 * @param obj
 * @returns
 */
export function deepClone(obj: any) {
	const newObj: any = Array.isArray(obj) ? [] : {};
	if (obj && typeof obj === 'object') {
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (obj[key] === null) {
					newObj[key] = null;
				} else if (obj[key] === undefined) {
					newObj[key] = undefined;
				} else {
					newObj[key] =
						obj && typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
				}
			}
		}
	}
	return newObj;
}
