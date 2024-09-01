import { RichText } from 'cc';
import * as i18n from './LanguageData';
import { _decorator, Component, Label } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('LocalizedLabel')
@executeInEditMode
export class LocalizedLabel extends Component {
	@property
	_key: string = '';
	@property
	get key(): string {
		return this._key;
	}
	set key(v: string) {
		if (this._key !== v) {
			this._key = v;
			this.updateLabel();
		}
	}

	@property _trimMiddleSpace = false;

	@property
	get trimMiddleSpace(): boolean {
		return this._trimMiddleSpace;
	}
	set trimMiddleSpace(v: boolean) {
		if (this._trimMiddleSpace !== v) {
			this._trimMiddleSpace = v;
			this.updateLabel();
		}
	}

	@property b: boolean = false;

	private _label: Label | RichText = null!;
	private _valueData: Record<string, string | number> = {};

	resetValue(): void {
		this._valueData = {};
	}

	getValue(): Record<string, string | number> {
		return this._valueData;
	}

	setValue(valueData: Record<string, string | number>): void {
		if (valueData) {
			for (const key in valueData) {
				if (Object.prototype.hasOwnProperty.call(valueData, key)) {
					this._valueData[key] = valueData[key];
				}
			}
			this.updateLabel();
		}
	}

	setKeyAndValue(i18nKey: string, valueData: Record<string, string | number>): void {
		this._key = i18nKey;
		if (valueData) {
			for (const key in valueData) {
				if (Object.prototype.hasOwnProperty.call(valueData, key)) {
					this._valueData[key] = valueData[key];
				}
			}
		}
		this.updateLabel();
	}

	onLoad() {
		if (!i18n.ready) {
			i18n.init('zh');
		}
		this.fetchRender();
	}

	fetchRender() {
		let label = this.getComponent(Label) ?? this.getComponent(RichText);
		if (label) {
			this._label = label;
			this.updateLabel();
			return;
		}
	}

	updateLabel() {
		let data = i18n.t(this.key, this._valueData);
		if (this.trimMiddleSpace) {
			data = data.replace(/\s+/g, "");
		}

		if(this.b && this._label instanceof RichText){
			data = `<b>${data}</b>`;
		}

		this._label && (this._label.string = data);
	}
}
