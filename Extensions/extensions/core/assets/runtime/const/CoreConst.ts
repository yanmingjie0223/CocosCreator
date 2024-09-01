import { Asset } from 'cc';

export interface ResFile {
	url: string;
	bundle: string;
	title?: string;
	type: new (...args: any[]) => Asset;
}

export class DirAsset extends Asset { }
