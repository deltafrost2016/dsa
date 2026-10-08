/**
 * Problem: Cheapest Flights Within K Stops
 * LeetCode: #787
 * Difficulty: Medium
 * URL: https://leetcode.com/problems/cheapest-flights-within-k-stops/
 *
 * Cities 0..n-1 are linked by one-way flights [from, to, price]. Find the
 * cheapest price to travel from src to dst using at most k intermediate
 * stops (so at most k + 1 flights). Return -1 if no such route exists.
 *
 * Constraints: 1 <= n <= 100; 0 <= k < n; up to n*(n-1)/2 flights; prices in [1, 10^4]; src != dst.
 * Target: O(k * E) time (Bellman-Ford style), O(n) space
 */

/**
 * @param {number} n number of cities
 * @param {number[][]} flights list of [from, to, price]
 * @param {number} src starting city
 * @param {number} dst destination city
 * @param {number} k maximum number of stops between src and dst
 * @returns {number} cheapest price, or -1 if unreachable within k stops
 */
export function findCheapestPrice(n, flights, src, dst, k) {
  // TODO: implement
  throw new Error('Not implemented');
}
