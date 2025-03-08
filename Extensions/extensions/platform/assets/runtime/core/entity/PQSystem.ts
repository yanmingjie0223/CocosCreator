import { IPQSystem, PQSafeArea } from "../interface/IPQSystem";
import { PQLanguageType, PQPlatformType } from "./PQConst";

export class PQSystem implements IPQSystem {
	public system: string;
	public brand: string;
	public model: string;
	public screenWidth: number;
	public screenHeight: number;
	public windowWidth: number;
	public windowHeight: number;
	public language: PQLanguageType;
	public version: string;
	public platform: PQPlatformType;
	public benchmarkLevel: number;
	public safeArea: PQSafeArea | null;

	public constructor() {
		this.system = '';
		this.brand = '';
		this.model = '';
		this.screenWidth = 0;
		this.screenHeight = 0;
		this.windowWidth = 0;
		this.windowHeight = 0;
		this.benchmarkLevel = -1;
		this.language = PQLanguageType.UNKNOWN;
		this.version = '';
		this.safeArea = null!;
		this.platform = PQPlatformType.PT_UNKNOWN;
	}

}
