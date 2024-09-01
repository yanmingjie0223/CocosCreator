import { IState } from './IState';

export interface IStateMachine<E, S extends IState<E>> {
	getOwner(): E;
	update(dt: number): void;
	addState(newState: S): void;
	addArrayState(newStates: S[]): void;
	getCurrState(): S;
	changeState(newState: S, onComplete?: () => void): void;
	destroy(): void;
}
