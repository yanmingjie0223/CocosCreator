// @ts-nocheck

/**
 * for example:
 *
 * const graph = new Graph();
 * const vertex1 = new GraphVertex(1);
 * const vertex2 = new GraphVertex(2);
 * const vertex3 = new GraphVertex(3);
 * const edge = new GraphEdge(vertex1, vertex2, 2);
 * const edge2 = new GraphEdge(vertex1, vertex3, 4);
 * const edge3 = new GraphEdge(vertex2, vertex3, 1);
 * graph.addVertex(vertex1);
 * graph.addVertex(vertex2);
 * graph.addVertex(vertex3);
 * graph.addEdge(edge);
 * graph.addEdge(edge2);
 * graph.addEdge(edge3);
 *
 *
 * const pathInfo = dijkstra(graph, vertex1, vertex3);
 * const vertexInfo = pathInfo.previousVertices;
 * const paths: GraphVertex[] = [];
 * let aimVertex: GraphVertex | null = vertex3;
 * while (aimVertex) {
 * 		paths.push(aimVertex);
 * 		aimVertex = vertexInfo[aimVertex.getKey()];
 * }
 */

export interface ShortestPaths {
	/**
	 * shortest distances to all vertices
	 */
	distances: Record<string, number>;
	/**
	 * shortest paths to all vertices
	 */
	previousVertices: Record<string, GraphVertex | null>;
}

/**
 * Implementation of Dijkstra algorithm of finding the shortest paths to graph nodes.
 * @param {Graph} graph - graph we're going to traverse.
 * @param {GraphVertex} startVertex - traversal start vertex.
 * @param {GraphVertex} endVertex - traversal end vertex.
 * @return {ShortestPaths}
 */
export function dijkstra(
	graph: Graph,
	startVertex: GraphVertex,
	endVertex?: GraphVertex
): ShortestPaths {
	// Init helper variables that we will need for Dijkstra algorithm.
	const distances = {};
	const visitedVertices = {};
	const previousVertices = {};
	const queue = new PriorityQueue();

	// Init all distances with infinity assuming that currently we can't reach
	// any of the vertices except the start one.
	graph.getAllVertices().forEach((vertex) => {
		distances[vertex.getKey()] = Infinity;
		previousVertices[vertex.getKey()] = null;
	});

	// We are already at the startVertex so the distance to it is zero.
	distances[startVertex.getKey()] = 0;

	// Init vertices queue.
	queue.add(startVertex, distances[startVertex.getKey()]);

	// Iterate over the priority queue of vertices until it is empty.
	while (!queue.isEmpty()) {
		// Fetch next closest vertex.
		const currentVertex = queue.poll();

		// Iterate over every unvisited neighbor of the current vertex.
		currentVertex.getNeighbors().forEach((neighbor) => {
			// Don't visit already visited vertices.
			if (!visitedVertices[neighbor.getKey()]) {
				// Update distances to every neighbor from current vertex.
				const edge = graph.findEdge(currentVertex, neighbor);

				const existingDistanceToNeighbor = distances[neighbor.getKey()];
				const distanceToNeighborFromCurrent =
					distances[currentVertex.getKey()] + edge.weight;

				// If we've found shorter path to the neighbor - update it.
				if (distanceToNeighborFromCurrent < existingDistanceToNeighbor) {
					distances[neighbor.getKey()] = distanceToNeighborFromCurrent;

					// Change priority of the neighbor in a queue since it might have became closer.
					if (queue.hasValue(neighbor)) {
						queue.changePriority(neighbor, distances[neighbor.getKey()]);
					}

					// Remember previous closest vertex.
					previousVertices[neighbor.getKey()] = currentVertex;
				}

				// Add neighbor to the queue for further visiting.
				if (!queue.hasValue(neighbor)) {
					queue.add(neighbor, distances[neighbor.getKey()]);
				}
			}
		});

		// Add current vertex to visited ones to avoid visiting it again later.
		visitedVertices[currentVertex.getKey()] = currentVertex;
		// 当结束点已经是需要的点后，已找到点退出
		if (endVertex === currentVertex) {
			break;
		}
	}

	// Return the set of shortest distances to all vertices and the set of
	// shortest paths to all vertices in a graph.
	return {
		distances,
		previousVertices
	};
}

class Comparator {
	public compare: Function;

	/**
	 * Constructor.
	 * @param {function(a: *, b: *)} [compareFunction] - It may be custom compare function that, let's
	 * say may compare custom objects together.
	 */
	constructor(compareFunction) {
		this.compare = compareFunction || Comparator.defaultCompareFunction;
	}

	/**
	 * Default comparison function. It just assumes that "a" and "b" are strings or numbers.
	 * @param {(string|number)} a
	 * @param {(string|number)} b
	 * @returns {number}
	 */
	static defaultCompareFunction(a, b) {
		if (a === b) {
			return 0;
		}

		return a < b ? -1 : 1;
	}

	/**
	 * Checks if two variables are equal.
	 * @param {*} a
	 * @param {*} b
	 * @return {boolean}
	 */
	equal(a, b) {
		return this.compare(a, b) === 0;
	}

	/**
	 * Checks if variable "a" is less than "b".
	 * @param {*} a
	 * @param {*} b
	 * @return {boolean}
	 */
	lessThan(a, b) {
		return this.compare(a, b) < 0;
	}

	/**
	 * Checks if variable "a" is greater than "b".
	 * @param {*} a
	 * @param {*} b
	 * @return {boolean}
	 */
	greaterThan(a, b) {
		return this.compare(a, b) > 0;
	}

	/**
	 * Checks if variable "a" is less than or equal to "b".
	 * @param {*} a
	 * @param {*} b
	 * @return {boolean}
	 */
	lessThanOrEqual(a, b) {
		return this.lessThan(a, b) || this.equal(a, b);
	}

	/**
	 * Checks if variable "a" is greater than or equal to "b".
	 * @param {*} a
	 * @param {*} b
	 * @return {boolean}
	 */
	greaterThanOrEqual(a, b) {
		return this.greaterThan(a, b) || this.equal(a, b);
	}

	/**
	 * Reverses the comparison order.
	 */
	reverse() {
		const compareOriginal = this.compare;
		this.compare = (a, b) => compareOriginal(b, a);
	}
}

export class Graph {
	private vertices: Record<string, GraphVertex>;
	private edges: Record<string, GraphEdge>;
	private isDirected: boolean;

	/**
	 * @param {boolean} isDirected
	 */
	constructor(isDirected = false) {
		this.vertices = {};
		this.edges = {};
		this.isDirected = isDirected;
	}

	/**
	 * @param {GraphVertex} newVertex
	 * @returns {Graph}
	 */
	addVertex(newVertex: GraphVertex) {
		this.vertices[newVertex.getKey()] = newVertex;

		return this;
	}

	/**
	 * @param {string} vertexKey
	 * @returns GraphVertex
	 */
	getVertexByKey(vertexKey) {
		return this.vertices[vertexKey];
	}

	/**
	 * @param {GraphVertex} vertex
	 * @returns {GraphVertex[]}
	 */
	getNeighbors(vertex) {
		return vertex.getNeighbors();
	}

	/**
	 * @return {GraphVertex[]}
	 */
	getAllVertices(): GraphVertex[] {
		return Object.values(this.vertices);
	}

	/**
	 * @return {GraphEdge[]}
	 */
	getAllEdges(): GraphEdge[] {
		return Object.values(this.edges);
	}

	/**
	 * @param {GraphEdge} edge
	 * @returns {Graph}
	 */
	addEdge(edge: GraphEdge) {
		// Try to find and end start vertices.
		let startVertex = this.getVertexByKey(edge.startVertex.getKey());
		let endVertex = this.getVertexByKey(edge.endVertex.getKey());

		// Insert start vertex if it wasn't inserted.
		if (!startVertex) {
			this.addVertex(edge.startVertex);
			startVertex = this.getVertexByKey(edge.startVertex.getKey());
		}

		// Insert end vertex if it wasn't inserted.
		if (!endVertex) {
			this.addVertex(edge.endVertex);
			endVertex = this.getVertexByKey(edge.endVertex.getKey());
		}

		// Check if edge has been already added.
		if (this.edges[edge.getKey()]) {
			throw new Error('Edge has already been added before');
		} else {
			this.edges[edge.getKey()] = edge;
		}

		// Add edge to the vertices.
		if (this.isDirected) {
			// If graph IS directed then add the edge only to start vertex.
			startVertex.addEdge(edge);
		} else {
			// If graph ISN'T directed then add the edge to both vertices.
			startVertex.addEdge(edge);
			endVertex.addEdge(edge);
		}

		return this;
	}

	/**
	 * @param {GraphEdge} edge
	 */
	deleteEdge(edge) {
		// Delete edge from the list of edges.
		if (this.edges[edge.getKey()]) {
			delete this.edges[edge.getKey()];
		} else {
			throw new Error('Edge not found in graph');
		}

		// Try to find and end start vertices and delete edge from them.
		const startVertex = this.getVertexByKey(edge.startVertex.getKey());
		const endVertex = this.getVertexByKey(edge.endVertex.getKey());

		startVertex.deleteEdge(edge);
		endVertex.deleteEdge(edge);
	}

	/**
	 * @param {GraphVertex} startVertex
	 * @param {GraphVertex} endVertex
	 * @return {(GraphEdge|null)}
	 */
	findEdge(startVertex, endVertex) {
		const vertex = this.getVertexByKey(startVertex.getKey());

		if (!vertex) {
			return null;
		}

		return vertex.findEdge(endVertex);
	}

	/**
	 * @return {number}
	 */
	getWeight() {
		return this.getAllEdges().reduce((weight, graphEdge) => {
			return weight + graphEdge.weight;
		}, 0);
	}

	/**
	 * Reverse all the edges in directed graph.
	 * @return {Graph}
	 */
	reverse() {
		/** @param {GraphEdge} edge */
		this.getAllEdges().forEach((edge) => {
			// Delete straight edge from graph and from vertices.
			this.deleteEdge(edge);

			// Reverse the edge.
			edge.reverse();

			// Add reversed edge back to the graph and its vertices.
			this.addEdge(edge);
		});

		return this;
	}

	/**
	 * @return {object}
	 */
	getVerticesIndices() {
		const verticesIndices = {};
		this.getAllVertices().forEach((vertex, index) => {
			verticesIndices[vertex.getKey()] = index;
		});

		return verticesIndices;
	}

	/**
	 * @return {*[][]}
	 */
	getAdjacencyMatrix() {
		const vertices = this.getAllVertices();
		const verticesIndices = this.getVerticesIndices();

		// Init matrix with infinities meaning that there is no ways of
		// getting from one vertex to another yet.
		const adjacencyMatrix = Array(vertices.length)
			.fill(null)
			.map(() => {
				return Array(vertices.length).fill(Infinity);
			});

		// Fill the columns.
		vertices.forEach((vertex, vertexIndex) => {
			vertex.getNeighbors().forEach((neighbor) => {
				const neighborIndex = verticesIndices[neighbor.getKey()];
				adjacencyMatrix[vertexIndex][neighborIndex] = this.findEdge(
					vertex,
					neighbor
				).weight;
			});
		});

		return adjacencyMatrix;
	}

	/**
	 * @return {string}
	 */
	toString() {
		return Object.keys(this.vertices).toString();
	}
}

export class GraphEdge {
	public weight: number;
	public startVertex: GraphVertex;
	public endVertex: GraphVertex;

	/**
	 * @param {GraphVertex} startVertex
	 * @param {GraphVertex} endVertex
	 * @param {number} [weight=1]
	 */
	constructor(startVertex, endVertex, weight = 0) {
		this.startVertex = startVertex;
		this.endVertex = endVertex;
		this.weight = weight;
	}

	/**
	 * @return {string}
	 */
	getKey() {
		const startVertexKey = this.startVertex.getKey();
		const endVertexKey = this.endVertex.getKey();

		return `${startVertexKey}_${endVertexKey}`;
	}

	/**
	 * @return {GraphEdge}
	 */
	reverse() {
		const tmp = this.startVertex;
		this.startVertex = this.endVertex;
		this.endVertex = tmp;

		return this;
	}

	/**
	 * @return {string}
	 */
	toString() {
		return this.getKey();
	}
}

export class GraphVertex {
	private edges: LinkedList;
	private value: string;

	/**
	 * @param {*} value
	 */
	constructor(value) {
		if (value === undefined) {
			throw new Error('Graph vertex must have a value');
		}

		/**
		 * @param {GraphEdge} edgeA
		 * @param {GraphEdge} edgeB
		 */
		const edgeComparator = (edgeA, edgeB) => {
			if (edgeA.getKey() === edgeB.getKey()) {
				return 0;
			}

			return edgeA.getKey() < edgeB.getKey() ? -1 : 1;
		};

		// Normally you would store string value like vertex name.
		// But generally it may be any object as well
		this.value = value;
		this.edges = new LinkedList(edgeComparator);
	}

	/**
	 * @param {GraphEdge} edge
	 * @returns {GraphVertex}
	 */
	addEdge(edge) {
		this.edges.append(edge);

		return this;
	}

	/**
	 * @param {GraphEdge} edge
	 */
	deleteEdge(edge) {
		this.edges.delete(edge);
	}

	/**
	 * @returns {GraphVertex[]}
	 */
	getNeighbors() {
		const edges = this.edges.toArray();

		/** @param {LinkedListNode} node */
		const neighborsConverter = (node) => {
			return node.value.startVertex === this ? node.value.endVertex : node.value.startVertex;
		};

		// Return either start or end vertex.
		// For undirected graphs it is possible that current vertex will be the end one.
		return edges.map(neighborsConverter);
	}

	/**
	 * @return {GraphEdge[]}
	 */
	getEdges() {
		return this.edges.toArray().map((linkedListNode) => linkedListNode.value);
	}

	/**
	 * @return {number}
	 */
	getDegree() {
		return this.edges.toArray().length;
	}

	/**
	 * @param {GraphEdge} requiredEdge
	 * @returns {boolean}
	 */
	hasEdge(requiredEdge) {
		const edgeNode = this.edges.find({
			callback: (edge) => edge === requiredEdge
		});

		return !!edgeNode;
	}

	/**
	 * @param {GraphVertex} vertex
	 * @returns {boolean}
	 */
	hasNeighbor(vertex) {
		const vertexNode = this.edges.find({
			callback: (edge) => edge.startVertex === vertex || edge.endVertex === vertex
		});

		return !!vertexNode;
	}

	/**
	 * @param {GraphVertex} vertex
	 * @returns {(GraphEdge|null)}
	 */
	findEdge(vertex) {
		const edgeFinder = (edge) => {
			return edge.startVertex === vertex || edge.endVertex === vertex;
		};

		const edge = this.edges.find({ callback: edgeFinder });

		return edge ? edge.value : null;
	}

	/**
	 * @returns {string}
	 */
	getKey(): string {
		return this.value;
	}

	/**
	 * @return {GraphVertex}
	 */
	deleteAllEdges() {
		this.getEdges().forEach((edge) => this.deleteEdge(edge));

		return this;
	}

	/**
	 * @param {function} [callback]
	 * @returns {string}
	 */
	toString(callback) {
		return callback ? callback(this.value) : `${this.value}`;
	}
}

/**
 * Parent class for Min and Max Heaps.
 */
class Heap {
	public compare: Comparator;
	private heapContainer: any[];

	/**
	 * @constructs Heap
	 * @param {Function} [comparatorFunction]
	 */
	constructor(comparatorFunction) {
		if (new.target === Heap) {
			throw new TypeError('Cannot construct Heap instance directly');
		}

		// Array representation of the heap.
		this.heapContainer = [];
		this.compare = new Comparator(comparatorFunction);
	}

	/**
	 * @param {number} parentIndex
	 * @return {number}
	 */
	getLeftChildIndex(parentIndex) {
		return 2 * parentIndex + 1;
	}

	/**
	 * @param {number} parentIndex
	 * @return {number}
	 */
	getRightChildIndex(parentIndex) {
		return 2 * parentIndex + 2;
	}

	/**
	 * @param {number} childIndex
	 * @return {number}
	 */
	getParentIndex(childIndex) {
		return Math.floor((childIndex - 1) / 2);
	}

	/**
	 * @param {number} childIndex
	 * @return {boolean}
	 */
	hasParent(childIndex) {
		return this.getParentIndex(childIndex) >= 0;
	}

	/**
	 * @param {number} parentIndex
	 * @return {boolean}
	 */
	hasLeftChild(parentIndex) {
		return this.getLeftChildIndex(parentIndex) < this.heapContainer.length;
	}

	/**
	 * @param {number} parentIndex
	 * @return {boolean}
	 */
	hasRightChild(parentIndex) {
		return this.getRightChildIndex(parentIndex) < this.heapContainer.length;
	}

	/**
	 * @param {number} parentIndex
	 * @return {*}
	 */
	leftChild(parentIndex) {
		return this.heapContainer[this.getLeftChildIndex(parentIndex)];
	}

	/**
	 * @param {number} parentIndex
	 * @return {*}
	 */
	rightChild(parentIndex) {
		return this.heapContainer[this.getRightChildIndex(parentIndex)];
	}

	/**
	 * @param {number} childIndex
	 * @return {*}
	 */
	parent(childIndex) {
		return this.heapContainer[this.getParentIndex(childIndex)];
	}

	/**
	 * @param {number} indexOne
	 * @param {number} indexTwo
	 */
	swap(indexOne, indexTwo) {
		const tmp = this.heapContainer[indexTwo];
		this.heapContainer[indexTwo] = this.heapContainer[indexOne];
		this.heapContainer[indexOne] = tmp;
	}

	/**
	 * @return {*}
	 */
	peek() {
		if (this.heapContainer.length === 0) {
			return null;
		}

		return this.heapContainer[0];
	}

	/**
	 * @return {*}
	 */
	poll() {
		if (this.heapContainer.length === 0) {
			return null;
		}

		if (this.heapContainer.length === 1) {
			return this.heapContainer.pop();
		}

		const item = this.heapContainer[0];

		// Move the last element from the end to the head.
		this.heapContainer[0] = this.heapContainer.pop();
		this.heapifyDown();

		return item;
	}

	/**
	 * @param {*} item
	 * @return {Heap}
	 */
	add(item) {
		this.heapContainer.push(item);
		this.heapifyUp();
		return this;
	}

	/**
	 * @param {*} item
	 * @param {Comparator} [comparator]
	 * @return {Heap}
	 */
	remove(item, comparator = this.compare) {
		// Find number of items to remove.
		const numberOfItemsToRemove = this.find(item, comparator).length;

		for (let iteration = 0; iteration < numberOfItemsToRemove; iteration += 1) {
			// We need to find item index to remove each time after removal since
			// indices are being changed after each heapify process.
			const indexToRemove = this.find(item, comparator).pop();

			// If we need to remove last child in the heap then just remove it.
			// There is no need to heapify the heap afterwards.
			if (indexToRemove === this.heapContainer.length - 1) {
				this.heapContainer.pop();
			} else {
				// Move last element in heap to the vacant (removed) position.
				this.heapContainer[indexToRemove] = this.heapContainer.pop();

				// Get parent.
				const parentItem = this.parent(indexToRemove);

				// If there is no parent or parent is in correct order with the node
				// we're going to delete then heapify down. Otherwise heapify up.
				if (
					this.hasLeftChild(indexToRemove) &&
					(!parentItem ||
						this.pairIsInCorrectOrder(parentItem, this.heapContainer[indexToRemove]))
				) {
					this.heapifyDown(indexToRemove);
				} else {
					this.heapifyUp(indexToRemove);
				}
			}
		}

		return this;
	}

	/**
	 * @param {*} item
	 * @param {Comparator} [comparator]
	 * @return {Number[]}
	 */
	find(item, comparator = this.compare) {
		const foundItemIndices = [];

		for (let itemIndex = 0; itemIndex < this.heapContainer.length; itemIndex += 1) {
			if (comparator.equal(item, this.heapContainer[itemIndex])) {
				foundItemIndices.push(itemIndex);
			}
		}

		return foundItemIndices;
	}

	/**
	 * @return {boolean}
	 */
	isEmpty() {
		return !this.heapContainer.length;
	}

	/**
	 * @return {string}
	 */
	toString() {
		return this.heapContainer.toString();
	}

	/**
	 * @param {number} [customStartIndex]
	 */
	heapifyUp(customStartIndex = undefined) {
		// Take the last element (last in array or the bottom left in a tree)
		// in the heap container and lift it up until it is in the correct
		// order with respect to its parent element.
		let currentIndex = customStartIndex || this.heapContainer.length - 1;

		while (
			this.hasParent(currentIndex) &&
			!this.pairIsInCorrectOrder(this.parent(currentIndex), this.heapContainer[currentIndex])
		) {
			this.swap(currentIndex, this.getParentIndex(currentIndex));
			currentIndex = this.getParentIndex(currentIndex);
		}
	}

	/**
	 * @param {number} [customStartIndex]
	 */
	heapifyDown(customStartIndex = 0) {
		// Compare the parent element to its children and swap parent with the appropriate
		// child (smallest child for MinHeap, largest child for MaxHeap).
		// Do the same for next children after swap.
		let currentIndex = customStartIndex;
		let nextIndex = null;

		while (this.hasLeftChild(currentIndex)) {
			if (
				this.hasRightChild(currentIndex) &&
				this.pairIsInCorrectOrder(
					this.rightChild(currentIndex),
					this.leftChild(currentIndex)
				)
			) {
				nextIndex = this.getRightChildIndex(currentIndex);
			} else {
				nextIndex = this.getLeftChildIndex(currentIndex);
			}

			if (
				this.pairIsInCorrectOrder(
					this.heapContainer[currentIndex],
					this.heapContainer[nextIndex]
				)
			) {
				break;
			}

			this.swap(currentIndex, nextIndex);
			currentIndex = nextIndex;
		}
	}

	/**
	 * Checks if pair of heap elements is in correct order.
	 * For MinHeap the first element must be always smaller or equal.
	 * For MaxHeap the first element must be always bigger or equal.
	 *
	 * @param {*} firstElement
	 * @param {*} secondElement
	 * @return {boolean}
	 */
	/* istanbul ignore next */
	pairIsInCorrectOrder(firstElement, secondElement) {
		console.error(
			`You have to implement heap pair comparision method for ${firstElement} and ${secondElement} values.`
		);
		return null;
	}
}

class LinkedList {
	private compare: Comparator;
	private head: LinkedListNode;
	private tail: LinkedListNode;

	/**
	 * @param {Function} [comparatorFunction]
	 */
	constructor(comparatorFunction) {
		/** @var LinkedListNode */
		this.head = null;

		/** @var LinkedListNode */
		this.tail = null;

		this.compare = new Comparator(comparatorFunction);
	}

	/**
	 * @param {*} value
	 * @return {LinkedList}
	 */
	prepend(value) {
		// Make new node to be a head.
		const newNode = new LinkedListNode(value, this.head);
		this.head = newNode;

		// If there is no tail yet let's make new node a tail.
		if (!this.tail) {
			this.tail = newNode;
		}

		return this;
	}

	/**
	 * @param {*} value
	 * @return {LinkedList}
	 */
	append(value) {
		const newNode = new LinkedListNode(value);

		// If there is no head yet let's make new node a head.
		if (!this.head) {
			this.head = newNode;
			this.tail = newNode;

			return this;
		}

		// Attach new node to the end of linked list.
		this.tail.next = newNode;
		this.tail = newNode;

		return this;
	}

	/**
	 * @param {*} value
	 * @return {LinkedListNode}
	 */
	delete(value) {
		if (!this.head) {
			return null;
		}

		let deletedNode = null;

		// If the head must be deleted then make next node that is different
		// from the head to be a new head.
		while (this.head && this.compare.equal(this.head.value, value)) {
			deletedNode = this.head;
			this.head = this.head.next;
		}

		let currentNode = this.head;

		if (currentNode !== null) {
			// If next node must be deleted then make next node to be a next next one.
			while (currentNode.next) {
				if (this.compare.equal(currentNode.next.value, value)) {
					deletedNode = currentNode.next;
					currentNode.next = currentNode.next.next;
				} else {
					currentNode = currentNode.next;
				}
			}
		}

		// Check if tail must be deleted.
		if (this.compare.equal(this.tail.value, value)) {
			this.tail = currentNode;
		}

		return deletedNode;
	}

	/**
	 * @param {Object} findParams
	 * @param {*} findParams.value
	 * @param {function} [findParams.callback]
	 * @return {LinkedListNode}
	 */
	find({ value = undefined, callback = undefined }) {
		if (!this.head) {
			return null;
		}

		let currentNode = this.head;

		while (currentNode) {
			// If callback is specified then try to find node by callback.
			if (callback && callback(currentNode.value)) {
				return currentNode;
			}

			// If value is specified then try to compare by value..
			if (value !== undefined && this.compare.equal(currentNode.value, value)) {
				return currentNode;
			}

			currentNode = currentNode.next;
		}

		return null;
	}

	/**
	 * @return {LinkedListNode}
	 */
	deleteTail() {
		const deletedTail = this.tail;

		if (this.head === this.tail) {
			// There is only one node in linked list.
			this.head = null;
			this.tail = null;

			return deletedTail;
		}

		// If there are many nodes in linked list...

		// Rewind to the last node and delete "next" link for the node before the last one.
		let currentNode = this.head;
		while (currentNode.next) {
			if (!currentNode.next.next) {
				currentNode.next = null;
			} else {
				currentNode = currentNode.next;
			}
		}

		this.tail = currentNode;

		return deletedTail;
	}

	/**
	 * @return {LinkedListNode}
	 */
	deleteHead() {
		if (!this.head) {
			return null;
		}

		const deletedHead = this.head;

		if (this.head.next) {
			this.head = this.head.next;
		} else {
			this.head = null;
			this.tail = null;
		}

		return deletedHead;
	}

	/**
	 * @param {*[]} values - Array of values that need to be converted to linked list.
	 * @return {LinkedList}
	 */
	fromArray(values) {
		values.forEach((value) => this.append(value));

		return this;
	}

	/**
	 * @return {LinkedListNode[]}
	 */
	toArray() {
		const nodes = [];

		let currentNode = this.head;
		while (currentNode) {
			nodes.push(currentNode);
			currentNode = currentNode.next;
		}

		return nodes;
	}

	/**
	 * @param {function} [callback]
	 * @return {string}
	 */
	toString(callback) {
		return this.toArray()
			.map((node) => node.toString(callback))
			.toString();
	}

	/**
	 * Reverse a linked list.
	 * @returns {LinkedList}
	 */
	reverse() {
		let currNode = this.head;
		let prevNode = null;
		let nextNode = null;

		while (currNode) {
			// Store next node.
			nextNode = currNode.next;

			// Change next node of the current node so it would link to previous node.
			currNode.next = prevNode;

			// Move prevNode and currNode nodes one step forward.
			prevNode = currNode;
			currNode = nextNode;
		}

		// Reset head and tail.
		this.tail = this.head;
		this.head = prevNode;

		return this;
	}
}

class LinkedListNode {
	public value: any;
	public next: LinkedListNode;

	constructor(value, next = null) {
		this.value = value;
		this.next = next;
	}

	toString(callback) {
		return callback ? callback(this.value) : `${this.value}`;
	}
}

class MinHeap extends Heap {
	/**
	 * Checks if pair of heap elements is in correct order.
	 * For MinHeap the first element must be always smaller or equal.
	 * For MaxHeap the first element must be always bigger or equal.
	 *
	 * @param {*} firstElement
	 * @param {*} secondElement
	 * @return {boolean}
	 */
	pairIsInCorrectOrder(firstElement, secondElement) {
		return this.compare.lessThanOrEqual(firstElement, secondElement);
	}
}

// It is the same as min heap except that when comparing two elements
// we take into account its priority instead of the element's value.
class PriorityQueue extends MinHeap {
	private priorities: Map<any, number>;

	constructor() {
		// Call MinHip constructor first.
		super(null);

		// Setup priorities map.
		this.priorities = new Map();

		// Use custom comparator for heap elements that will take element priority
		// instead of element value into account.
		this.compare = new Comparator(this.comparePriority.bind(this));
	}

	/**
	 * Add item to the priority queue.
	 * @param {*} item - item we're going to add to the queue.
	 * @param {number} [priority] - items priority.
	 * @return {PriorityQueue}
	 */
	add(item, priority = 0) {
		this.priorities.set(item, priority);
		super.add(item);
		return this;
	}

	/**
	 * Remove item from priority queue.
	 * @param {*} item - item we're going to remove.
	 * @param {Comparator} [customFindingComparator] - custom function for finding the item to remove
	 * @return {PriorityQueue}
	 */
	remove(item, customFindingComparator) {
		super.remove(item, customFindingComparator);
		this.priorities.delete(item);
		return this;
	}

	/**
	 * Change priority of the item in a queue.
	 * @param {*} item - item we're going to re-prioritize.
	 * @param {number} priority - new item's priority.
	 * @return {PriorityQueue}
	 */
	changePriority(item, priority) {
		this.remove(item, new Comparator(this.compareValue));
		this.add(item, priority);
		return this;
	}

	/**
	 * Find item by ite value.
	 * @param {*} item
	 * @return {Number[]}
	 */
	findByValue(item) {
		return this.find(item, new Comparator(this.compareValue));
	}

	/**
	 * Check if item already exists in a queue.
	 * @param {*} item
	 * @return {boolean}
	 */
	hasValue(item) {
		return this.findByValue(item).length > 0;
	}

	/**
	 * Compares priorities of two items.
	 * @param {*} a
	 * @param {*} b
	 * @return {number}
	 */
	comparePriority(a, b) {
		if (this.priorities.get(a) === this.priorities.get(b)) {
			return 0;
		}
		return this.priorities.get(a) < this.priorities.get(b) ? -1 : 1;
	}

	/**
	 * Compares values of two items.
	 * @param {*} a
	 * @param {*} b
	 * @return {number}
	 */
	compareValue(a, b) {
		if (a === b) {
			return 0;
		}
		return a < b ? -1 : 1;
	}
}
