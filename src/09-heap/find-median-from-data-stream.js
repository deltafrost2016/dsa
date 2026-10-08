/**
 * Problem: Find Median from Data Stream
 * LeetCode: #295
 * Difficulty: Hard
 * URL: https://leetcode.com/problems/find-median-from-data-stream/
 *
 * Maintain a growing collection of numbers that can report its median at any time.
 * For an odd count the median is the middle value; for an even count it is the
 * average of the two middle values.
 *
 * Constraints: values in [-10^5, 10^5]; findMedian is only called after at least one addNum; up to ~5 * 10^4 calls
 * Target: addNum O(log n), findMedian O(1)
 */

export class MedianFinder {
  constructor() {
    // TODO: implement
  }

  /**
   * Add a number to the collection.
   * @param {number} num
   * @returns {void}
   */
  addNum(num) {
    // TODO: implement
    throw new Error('Not implemented');
  }

  /**
   * Median of everything added so far.
   * @returns {number}
   */
  findMedian() {
    // TODO: implement
    throw new Error('Not implemented');
  }
}
