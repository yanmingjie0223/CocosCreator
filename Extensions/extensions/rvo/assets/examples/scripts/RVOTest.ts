import { Component, Node, Prefab, _decorator, instantiate } from "cc";
import Simulator from "../../runtime/Simulator";
import RVOMath from "../../runtime/RVOMath";
const { ccclass, property } = _decorator;

@ccclass("RVOTest")
export class RVOTest extends Component {
	@property(Prefab)
	private cubePrefab: Prefab = null!;

	private simulator: Simulator = null!;
	private _cubes: Node[] = [];

	protected start(): void {
		console.log("================================================");
		console.log("RVOTest");
		console.log("================================================");

		this.simulator = new Simulator();
		const simulator = this.simulator;
		window['simulator'] = simulator;
		simulator.setTimeStep(0.5);
		simulator.setAgentDefaults(
			//在寻找周围邻居的搜索距离，这个值设置越大，会让小球在越远距离做出避障行为
			80, // neighbor distance (min = radius * radius)

			//寻找周围邻居的最大数目，这个值设置越大，最终计算的速度越 精确，但会加大计算量
			10, // max neighbors

			//计算动态的物体时的时间窗口
			100, // time horizon

			//代表计算静态的物体时的时间窗口，比如在RTS游戏中，小兵 向城墙移动时，没必要做出避障，这个值需要设置的很
			1, // time horizon obstacles

			//代表计算ORCA时的小球的半径，这个值不一定与小球实际显示的半径 一样，偏小有利于小球移动顺畅
			5, // agent radius

			//小球最大速度值
			2, // max speed
			//初始速度
			0, // default velocity for x
			0, // default velocity for y
		);

		let counts = 50;
		for (let i = 0; i < counts; i++) {
			let x = 30 * Math.round(i / 5) - 150;
			let y = 30 * (i % 10) - 100;
			simulator.addAgent();
			simulator.setAgentPosition(i, x - 300, y);
			simulator.setAgentGoal(i, x + 300, y);
		}
		for (let i = 0; i < counts; i++) {
			let x = 30 * Math.round(i / 5) - 150;
			let y = 30 * (i % 10) - 100;
			const ci = 50 + i;
			simulator.addAgent();
			simulator.setAgentPosition(ci, x + 300, y);
			simulator.setAgentGoal(ci, x - 300, y);
		}

		for (let i = 0; i < simulator.getNumAgents(); ++i) {
			const cube = instantiate(this.cubePrefab);
			this._cubes.push(cube);
			this.node.addChild(cube);
			const apos = simulator.getAgentPosition(i);
			cube.setPosition(apos.x, apos.y);
		}

		// const obstacle: Vector2D[] = [];
		// obstacle.push(new Vector2D(-80.0, 80.0));
		// obstacle.push(new Vector2D(-80.0, -80.0));
		// obstacle.push(new Vector2D(80.0, -80.0));
		// obstacle.push(new Vector2D(80.0, 80.0));
		// simulator.addObstacle(obstacle);

		simulator.processObstacles();
	}

	protected update(dt: number): void {
		let simulator = this.simulator;

		for (let i = 0; i < simulator.getNumAgents(); ++i) {
			if (
				RVOMath.absSq(
					simulator.getGoal(i).minus(simulator.getAgentPosition(i))
				) < RVOMath.RVO_EPSILON
			) {
				// Agent is within one radius of its goal, set preferred velocity to zero
				simulator.setAgentPrefVelocity(i, 0.0, 0.0);
				// console.log('finish ' + i);
			} else {
				// Agent is far away from its goal, set preferred velocity as unit vector towards agent's goal.
				let v = RVOMath.normalize(
					simulator.getGoal(i).minus(simulator.getAgentPosition(i))
				).scale(2);
				simulator.setAgentPrefVelocity(i, v.x, v.y);
			}
		}

		simulator.run();

		// update render
		// console.log('update render');
		for (let i = 0; i < simulator.getNumAgents(); ++i) {
			const apos = simulator.getAgentPosition(i);
			const cube = this._cubes[i];
			if (cube) {
				cube.setPosition(apos.x, apos.y);
				// console.log(apos.x, apos.y);
			}
		}

		if (simulator.reachedGoal()) {
			console.log("finish");
		}
	}
}
