export interface IState<E> {
	enter(entity: E, onComplete?: () => void): void;
	update(entity: E, dt: number): void;
	exit(entity: E): void;
}
