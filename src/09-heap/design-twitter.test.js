import { describe, it } from 'node:test';
import { runOps, makeRng } from '../../lib/testutil.js';
import { Twitter } from './design-twitter.js';

const make = (...a) => new Twitter(...a);

/** Brute-force model used to compute expected feeds for the randomized test. */
class Model {
  constructor() {
    this.tweets = []; // [userId, tweetId] in posting order
    this.follows = new Map();
  }

  post(u, t) {
    this.tweets.push([u, t]);
  }

  follow(a, b) {
    if (!this.follows.has(a)) this.follows.set(a, new Set());
    this.follows.get(a).add(b);
  }

  unfollow(a, b) {
    this.follows.get(a)?.delete(b);
  }

  feed(u) {
    const f = this.follows.get(u);
    const out = [];
    for (let i = this.tweets.length - 1; i >= 0 && out.length < 10; i--) {
      const [owner, id] = this.tweets[i];
      if (owner === u || (owner !== u && f?.has(owner))) out.push(id);
    }
    return out;
  }
}

describe('Design Twitter', () => {
  it('official example', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'getNewsFeed', 'follow', 'postTweet', 'getNewsFeed', 'unfollow', 'getNewsFeed'],
      [[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]],
      [null, null, [5], null, null, [6, 5], null, [5]],
    );
  });

  it('empty feed for a user who never tweeted or followed', () => {
    runOps(make, ['Twitter', 'getNewsFeed', 'getNewsFeed'], [[], [1], [500]], [null, [], []]);
  });

  it('user sees own tweets newest first', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'postTweet', 'postTweet', 'getNewsFeed'],
      [[], [1, 10], [1, 11], [1, 12], [1]],
      [null, null, null, null, [12, 11, 10]],
    );
  });

  it('follower does not appear in the followee feed (follow is one-directional)', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'postTweet', 'follow', 'getNewsFeed', 'getNewsFeed'],
      [[], [1, 1], [2, 2], [1, 2], [1], [2]],
      [null, null, null, null, [2, 1], [2]],
    );
  });

  it('feed only contains the 10 most recent tweets', () => {
    const ids = Array.from({ length: 15 }, (_, i) => 100 + i);
    runOps(
      make,
      ['Twitter', ...ids.map(() => 'postTweet'), 'getNewsFeed'],
      [[], ...ids.map((t) => [1, t]), [1]],
      [null, ...ids.map(() => null), [114, 113, 112, 111, 110, 109, 108, 107, 106, 105]],
    );
  });

  it('merges tweets from several followees in global recency order', () => {
    runOps(
      make,
      [
        'Twitter', 'postTweet', 'postTweet', 'postTweet', 'postTweet', 'postTweet', 'postTweet',
        'follow', 'follow', 'getNewsFeed',
      ],
      [[], [2, 1], [3, 2], [1, 3], [2, 4], [3, 5], [4, 6], [1, 2], [1, 3], [1]],
      [null, null, null, null, null, null, null, null, null, [5, 4, 3, 2, 1]],
    );
  });

  it('only the latest 10 across all followees are returned', () => {
    const ops = ['Twitter'];
    const args = [[]];
    const exp = [null];
    let id = 0;
    for (let round = 0; round < 6; round++) {
      for (const u of [2, 3, 4]) {
        ops.push('postTweet');
        args.push([u, id++]);
        exp.push(null);
      }
    }
    ops.push('follow', 'follow', 'follow', 'getNewsFeed');
    args.push([1, 2], [1, 3], [1, 4], [1]);
    exp.push(null, null, null, [17, 16, 15, 14, 13, 12, 11, 10, 9, 8]);
    runOps(make, ops, args, exp);
  });

  it('unfollow removes only that followee tweets, the rest remain', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'postTweet', 'postTweet', 'follow', 'follow', 'unfollow', 'getNewsFeed'],
      [[], [1, 1], [2, 2], [3, 3], [1, 2], [1, 3], [1, 2], [1]],
      [null, null, null, null, null, null, null, [3, 1]],
    );
  });

  it('unfollow of a user you do not follow is harmless', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'unfollow', 'getNewsFeed'],
      [[], [1, 7], [1, 2], [1]],
      [null, null, null, [7]],
    );
  });

  it('following twice and unfollowing once leaves them unfollowed', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'follow', 'follow', 'unfollow', 'getNewsFeed'],
      [[], [2, 9], [1, 2], [1, 2], [1, 2], [1]],
      [null, null, null, null, null, []],
    );
  });

  it('re-following after unfollow brings their tweets back', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'follow', 'unfollow', 'follow', 'getNewsFeed'],
      [[], [2, 9], [1, 2], [1, 2], [1, 2], [1]],
      [null, null, null, null, null, [9]],
    );
  });

  it('a tweet posted before following still shows up after following', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'postTweet', 'follow', 'getNewsFeed'],
      [[], [2, 1], [1, 2], [1, 2], [1]],
      [null, null, null, null, [2, 1]],
    );
  });

  it('following yourself does not duplicate your tweets', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'follow', 'postTweet', 'getNewsFeed'],
      [[], [1, 1], [1, 1], [1, 2], [1]],
      [null, null, null, null, [2, 1]],
    );
  });

  it('tweet ids are not ordered: recency is by posting time, not by id', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'postTweet', 'postTweet', 'follow', 'follow', 'getNewsFeed'],
      [[], [1, 9000], [2, 3], [3, 500], [4, 1], [4, 2], [4]],
      [null, null, null, null, null, null, [3, 9000]],
    );
  });

  it('tweet id 0 is a valid id', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'getNewsFeed'],
      [[], [1, 0], [1]],
      [null, null, [0]],
    );
  });

  it('feeds of several users stay independent', () => {
    runOps(
      make,
      ['Twitter', 'postTweet', 'postTweet', 'getNewsFeed', 'getNewsFeed', 'getNewsFeed'],
      [[], [1, 1], [2, 2], [1], [2], [3]],
      [null, null, null, [1], [2], []],
    );
  });

  it('20000 random operations across 60 users match a brute-force model', { timeout: 2000 }, () => {
    const rng = makeRng(355);
    const model = new Model();
    const ops = ['Twitter'];
    const args = [[]];
    const exp = [null];
    let nextTweet = 0;
    for (let i = 0; i < 20000; i++) {
      const r = rng.next();
      if (r < 0.4 && nextTweet <= 10000) {
        const u = rng.int(1, 60);
        model.post(u, nextTweet);
        ops.push('postTweet');
        args.push([u, nextTweet++]);
        exp.push(null);
      } else if (r < 0.6) {
        const a = rng.int(1, 60);
        const b = rng.int(1, 60);
        if (a === b) continue;
        model.follow(a, b);
        ops.push('follow');
        args.push([a, b]);
        exp.push(null);
      } else if (r < 0.7) {
        const a = rng.int(1, 60);
        const b = rng.int(1, 60);
        if (a === b) continue;
        model.unfollow(a, b);
        ops.push('unfollow');
        args.push([a, b]);
        exp.push(null);
      } else {
        const u = rng.int(1, 60);
        ops.push('getNewsFeed');
        args.push([u]);
        exp.push(model.feed(u));
      }
    }
    runOps(make, ops, args, exp);
  });

  it('one user following 499 others with a feed read after every post', { timeout: 2000 }, () => {
    const model = new Model();
    const ops = ['Twitter'];
    const args = [[]];
    const exp = [null];
    for (let u = 2; u <= 500; u++) {
      model.follow(1, u);
      ops.push('follow');
      args.push([1, u]);
      exp.push(null);
    }
    const rng = makeRng(3551);
    for (let t = 0; t < 1500; t++) {
      const u = rng.int(2, 500);
      model.post(u, t);
      ops.push('postTweet', 'getNewsFeed');
      args.push([u, t], [1]);
      exp.push(null, model.feed(1));
    }
    runOps(make, ops, args, exp);
  });
});
