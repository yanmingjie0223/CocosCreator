import { IState } from './IState';
import { IStateMachine } from './IStateMachine';

export default class StateMachine<E, S extends IState<E>> implements IStateMachine<E, S> {
	protected owner: E;
	protected states: S[];
	protected currentState: S;

	public constructor(owner: E, states: S[]) {
		this.owner = owner;
		this.states = [];
		this.currentState = null!;
		this.addArrayState(states);
	}

	public getCurrState(): S {
		return this.currentState;
	}

	public getOwner(): E {
		return this.owner;
	}

	public addState(newState: S): void {
		this.states.push(newState);
	}

	public addArrayState(newStates: S[]): void {
		newStates.forEach((state: S) => {
			this.states.push(state);
		});
	}

	public update(dt: number): void {
		if (this.currentState !== null) {
			this.currentState.update(this.owner, dt);
		}
	}

	public changeState(newState: S, onComplete?: () => void): void {
		if (this.currentState && newState === this.currentState) {
			return;
		}
		if (this.currentState) {
			this.currentState.exit(this.owner);
		}

		this.currentState = newState;
		if (this.currentState) {
			this.currentState.enter(this.owner, onComplete);
		}
	}

	public destroy(): void {
		this.owner = null!;
		this.states.length = 0;
		this.currentState = null!;
	}
}
