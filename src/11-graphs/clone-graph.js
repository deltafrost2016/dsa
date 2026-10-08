/**
 * Problem: Clone Graph
 * LeetCode: #133
 * Difficulty: Medium
 * URL: https://leetcode.com/problems/clone-graph/
 *
 * Deep-copy a connected undirected graph given one of its nodes. The copy must have the same shape (values and neighbor order) and share no node objects with the original.
 *
 * Constraints: 0 <= nodes <= 100 (tests also try larger graphs); node values are unique and equal to their 1-based index; no self loops or repeated edges. The graph is connected. A null input returns null.
 * Target: O(V + E) time, O(V) space
 */
import { GraphNode } from '../../lib/ds.js';

/**
 * @param {GraphNode|null} node any node of the graph (GraphNode from lib/ds.js has val and neighbors)
 * @returns {GraphNode|null} the copy of the given node
 */
export function cloneGraph(node) {
  // TODO: implement
  throw new Error('Not implemented');
}
