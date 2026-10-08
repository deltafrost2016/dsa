/**
 * Problem: Design Twitter
 * LeetCode: #355
 * Difficulty: Medium
 * URL: https://leetcode.com/problems/design-twitter/
 *
 * Design a tiny social feed. Users post tweets (unique ids), follow and unfollow
 * each other, and can fetch a news feed: the 10 most recent tweet ids posted by
 * themselves or by anyone they follow, newest first. A user always sees their own
 * tweets, and a tweet never appears twice in a feed.
 *
 * Constraints: user ids 1..500, tweet ids 0..10^4 (unique); up to 3 * 10^4 calls
 * Target: postTweet/follow/unfollow O(1); getNewsFeed O(F log F) or better (F = followees)
 */

export class Twitter {
  constructor() {
    // TODO: implement
  }

  /**
   * Compose a new tweet.
   * @param {number} userId
   * @param {number} tweetId
   * @returns {void}
   */
  postTweet(userId, tweetId) {
    // TODO: implement
    throw new Error('Not implemented');
  }

  /**
   * Retrieve up to the 10 most recent tweet ids in the user's feed, newest first.
   * @param {number} userId
   * @returns {number[]}
   */
  getNewsFeed(userId) {
    // TODO: implement
    throw new Error('Not implemented');
  }

  /**
   * followerId starts following followeeId (no-op if already following).
   * @param {number} followerId
   * @param {number} followeeId
   * @returns {void}
   */
  follow(followerId, followeeId) {
    // TODO: implement
    throw new Error('Not implemented');
  }

  /**
   * followerId stops following followeeId (no-op if not following).
   * @param {number} followerId
   * @param {number} followeeId
   * @returns {void}
   */
  unfollow(followerId, followeeId) {
    // TODO: implement
    throw new Error('Not implemented');
  }
}
