/**
 * Problem: Detect Squares
 * LeetCode: #2013
 * Difficulty: Medium
 * URL: https://leetcode.com/problems/detect-squares/
 *
 * Design a structure that collects points on a 2D plane (duplicates allowed and
 * each copy counts separately). count(point) returns how many ways exist to pick
 * three stored points that, together with the query point, form an axis-aligned
 * square with positive area.
 *
 * Constraints: points are [x, y] with 0 <= x, y <= 1000; at most 3000 calls to add and count
 * Target: add O(1); count O(number of distinct stored points)
 * Note: stored duplicates multiply the count (two copies of a corner doubles the ways).
 */
export class DetectSquares {
  constructor() {
    // TODO: implement
  }

  /**
   * Add a point to the data structure.
   * @param {number[]} point [x, y]
   * @returns {void}
   */
  add(point) {
    // TODO: implement
    throw new Error('Not implemented');
  }

  /**
   * Count the ways to form an axis-aligned square with positive area using the query point.
   * @param {number[]} point [x, y]
   * @returns {number}
   */
  count(point) {
    // TODO: implement
    throw new Error('Not implemented');
  }
}
