/**
 * Problem: Time Based Key-Value Store
 * LeetCode: #981
 * Difficulty: Medium
 * URL: https://leetcode.com/problems/time-based-key-value-store/
 *
 * Design a store that keeps several timestamped values per key. set(key, value, timestamp)
 * records a value; get(key, timestamp) returns the value whose timestamp is the largest
 * one that is <= the requested timestamp, or "" if the key is unknown or nothing that
 * early exists. Calls to set for a given key always use strictly increasing timestamps.
 *
 * Constraints: 1 <= key.length, value.length <= 100, 1 <= timestamp <= 10^7, up to 2 * 10^5 calls
 * Target: set O(1), get O(log n) time
 */

export class TimeMap {
  constructor() {
    // TODO: implement
  }

  /**
   * @param {string} key
   * @param {string} value
   * @param {number} timestamp strictly increasing per key
   * @returns {void}
   */
  set(key, value, timestamp) {
    // TODO: implement
    throw new Error('Not implemented');
  }

  /**
   * @param {string} key
   * @param {number} timestamp
   * @returns {string} value at the latest timestamp <= given one, or ""
   */
  get(key, timestamp) {
    // TODO: implement
    throw new Error('Not implemented');
  }
}
