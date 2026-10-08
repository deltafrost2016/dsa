/**
 * Problem: Kth Largest Element in a Stream
 * LeetCode: #703
 * Difficulty: Easy
 * URL: https://leetcode.com/problems/kth-largest-element-in-a-stream/
 *
 * Build a tracker that starts from an initial list of scores and then accepts new
 * scores one at a time. After every new score, report the k-th largest value seen
 * so far (counting duplicates as separate entries, so the 2nd largest of
 * [9, 9, 3] is 9).
 *
 * Constraints: k >= 1; up to ~10^4 initial numbers (may be empty) and ~10^4 add calls; values in [-10^4, 10^4]. The k-th largest always exists when add is called.
 * Target: O(log k) time per add, O(k) space
 */

export class KthLargest {
  /**
   * @param {number} k which largest element to track (1 = maximum)
   * @param {number[]} nums initial numbers, possibly empty
   */
  constructor(k, nums) {
    // TODO: implement
  }

  /**
   * Add a value to the stream.
   * @param {number} val
   * @returns {number} the k-th largest value in the stream so far
   */
  add(val) {
    // TODO: implement
    throw new Error('Not implemented');
  }
}
