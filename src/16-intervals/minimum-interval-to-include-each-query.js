/**
 * Problem: Minimum Interval to Include Each Query
 * LeetCode: #1851
 * Difficulty: Hard
 * URL: https://leetcode.com/problems/minimum-interval-to-include-each-query/
 *
 * Each interval [l, r] has size r - l + 1. For every query value q, find the size
 * of the smallest interval with l <= q <= r, or -1 if no interval contains q.
 * Return the answers in the same order as the queries (so queries must not be
 * reordered in the output).
 *
 * Constraints: 1 <= intervals.length, queries.length <= 10^5; 1 <= l <= r <= 10^7; 1 <= q <= 10^7
 * Target: O((n + q) log(n + q)) time, O(n + q) space
 * Note: a brute-force O(n * q) scan is far too slow for the largest inputs.
 */

/**
 * @param {number[][]} intervals array of [left, right] pairs
 * @param {number[]} queries
 * @returns {number[]} answer per query, in query order
 */
export function minInterval(intervals, queries) {
  // TODO: implement
  throw new Error('Not implemented');
}
