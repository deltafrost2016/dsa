/**
 * Problem: Network Delay Time
 * LeetCode: #743
 * Difficulty: Medium
 * URL: https://leetcode.com/problems/network-delay-time/
 *
 * A network has nodes labelled 1..n. Each entry of `times` is a directed edge
 * [from, to, travelTime]. A signal starts at node k. Return how long it takes
 * until every node has received it (the largest shortest-path distance from k),
 * or -1 if some node can never be reached.
 *
 * Constraints: 1 <= k <= n <= 100 in LeetCode (tests also use n up to 10000);
 * 0 <= travel time <= 100; parallel edges and cycles are possible.
 * Target: O(E log V) time, O(V + E) space
 */

/**
 * @param {number[][]} times directed edges [from, to, travelTime]
 * @param {number} n number of nodes (labelled 1..n)
 * @param {number} k source node
 * @returns {number} minimum time for all nodes to receive the signal, or -1
 */
export function networkDelayTime(times, n, k) {
  // TODO: implement
  throw new Error('Not implemented');
}
