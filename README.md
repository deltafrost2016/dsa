# NeetCode 150 — JavaScript practice

150 problems from the NeetCode list. Every problem is an empty stub plus a thorough test file; **you write the solutions**. A stub looks like this and throws until you replace the body:

```js
export function containsDuplicate(nums) {
  // TODO: implement
  throw new Error('Not implemented');
}
```

Plain JavaScript (ES modules), Node 20+ (`.nvmrc` = 20), zero dependencies — only `node:test` and `node:assert/strict`.

## Running things

| Command | What it does |
|---|---|
| `npm test` | Run every problem's tests (`src/**/*.test.js`) |
| `npm run cat -- 04-stack` | Run one category (full folder name, or a unique part like `stack`) |
| `npm run one -- trapping-rain-water` | Run one problem's test file by file name |
| `npm run watch -- trapping-rain-water` | Same as `one`, re-runs on every save |
| `npm run progress` | Report solved / total per category and list unsolved problems (always exits 0) |
| `npm run test:lib` | Tests for the shared helpers in `lib/` |

Until you implement a problem, its tests fail with `Not implemented` — that is expected. A problem counts as solved in `npm run progress` only when every test in its file passes.

## Layout

```
src/<NN-category>/<problem>.js        stub: header comment (description, constraints, target complexity) + JSDoc'd export
src/<NN-category>/<problem>.test.js   tests: official examples, edge cases, a large performance case
lib/ds.js         ListNode, TreeNode, RandomListNode, GraphNode + builders/converters (buildList, buildTree, ...)
lib/testutil.js   sameMembers, closeTo, clone, runOps, makeRng (seeded PRNG), fmt
scripts/          test runners and the progress reporter
```

Notes worth knowing:

- Large-input tests have a `{ timeout: 2000 }`, so a brute-force solution will time out where it should.
- Answers accepted in any order are compared order-insensitively; problems with several valid answers (Alien Dictionary, Course Schedule II) are validated against the constraints.
- In-place problems (Reorder List, Rotate Image, Set Matrix Zeroes, Surrounded Regions, Walls and Gates) are checked on the mutated input.
- JS numbers are 64-bit floats, so the 32-bit problems (Reverse Integer, Reverse Bits, Sum of Two Integers) state their 32-bit expectations in the stub header.
- Meeting Rooms I/II are LeetCode Premium; they take `number[][]` of `[start, end]` pairs, and touching endpoints do not overlap.

## Checklist

Tick the *Done* box yourself as you go (`npm run progress` is the source of truth).

### Arrays & Hashing — 01-arrays-hashing (9)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 217 | [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) | Easy | `containsDuplicate` | `src/01-arrays-hashing/contains-duplicate.js` |
| [ ] | 242 | [Valid Anagram](https://leetcode.com/problems/valid-anagram/) | Easy | `isAnagram` | `src/01-arrays-hashing/valid-anagram.js` |
| [ ] | 1 | [Two Sum](https://leetcode.com/problems/two-sum/) | Easy | `twoSum` | `src/01-arrays-hashing/two-sum.js` |
| [ ] | 49 | [Group Anagrams](https://leetcode.com/problems/group-anagrams/) | Medium | `groupAnagrams` | `src/01-arrays-hashing/group-anagrams.js` |
| [ ] | 347 | [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | Medium | `topKFrequent` | `src/01-arrays-hashing/top-k-frequent-elements.js` |
| [ ] | 271 | [Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/) | Medium | `encode`, `decode` | `src/01-arrays-hashing/encode-and-decode-strings.js` |
| [ ] | 238 | [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) | Medium | `productExceptSelf` | `src/01-arrays-hashing/product-of-array-except-self.js` |
| [ ] | 36 | [Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) | Medium | `isValidSudoku` | `src/01-arrays-hashing/valid-sudoku.js` |
| [ ] | 128 | [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) | Medium | `longestConsecutive` | `src/01-arrays-hashing/longest-consecutive-sequence.js` |

### Two Pointers — 02-two-pointers (5)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 125 | [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) | Easy | `isPalindrome` | `src/02-two-pointers/valid-palindrome.js` |
| [ ] | 167 | [Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) | Medium | `twoSum` | `src/02-two-pointers/two-sum-ii-input-array-is-sorted.js` |
| [ ] | 15 | [3Sum](https://leetcode.com/problems/3sum/) | Medium | `threeSum` | `src/02-two-pointers/3sum.js` |
| [ ] | 11 | [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | Medium | `maxArea` | `src/02-two-pointers/container-with-most-water.js` |
| [ ] | 42 | [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) | Hard | `trap` | `src/02-two-pointers/trapping-rain-water.js` |

### Sliding Window — 03-sliding-window (6)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 121 | [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | Easy | `maxProfit` | `src/03-sliding-window/best-time-to-buy-and-sell-stock.js` |
| [ ] | 3 | [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Medium | `lengthOfLongestSubstring` | `src/03-sliding-window/longest-substring-without-repeating-characters.js` |
| [ ] | 424 | [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) | Medium | `characterReplacement` | `src/03-sliding-window/longest-repeating-character-replacement.js` |
| [ ] | 567 | [Permutation in String](https://leetcode.com/problems/permutation-in-string/) | Medium | `checkInclusion` | `src/03-sliding-window/permutation-in-string.js` |
| [ ] | 76 | [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) | Hard | `minWindow` | `src/03-sliding-window/minimum-window-substring.js` |
| [ ] | 239 | [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) | Hard | `maxSlidingWindow` | `src/03-sliding-window/sliding-window-maximum.js` |

### Stack — 04-stack (7)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 20 | [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) | Easy | `isValid` | `src/04-stack/valid-parentheses.js` |
| [ ] | 155 | [Min Stack](https://leetcode.com/problems/min-stack/) | Medium | `MinStack` | `src/04-stack/min-stack.js` |
| [ ] | 150 | [Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) | Medium | `evalRPN` | `src/04-stack/evaluate-reverse-polish-notation.js` |
| [ ] | 22 | [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) | Medium | `generateParenthesis` | `src/04-stack/generate-parentheses.js` |
| [ ] | 739 | [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) | Medium | `dailyTemperatures` | `src/04-stack/daily-temperatures.js` |
| [ ] | 853 | [Car Fleet](https://leetcode.com/problems/car-fleet/) | Medium | `carFleet` | `src/04-stack/car-fleet.js` |
| [ ] | 84 | [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | Hard | `largestRectangleArea` | `src/04-stack/largest-rectangle-in-histogram.js` |

### Binary Search — 05-binary-search (7)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 704 | [Binary Search](https://leetcode.com/problems/binary-search/) | Easy | `search` | `src/05-binary-search/binary-search.js` |
| [ ] | 74 | [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/) | Medium | `searchMatrix` | `src/05-binary-search/search-a-2d-matrix.js` |
| [ ] | 875 | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | Medium | `minEatingSpeed` | `src/05-binary-search/koko-eating-bananas.js` |
| [ ] | 153 | [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Medium | `findMin` | `src/05-binary-search/find-minimum-in-rotated-sorted-array.js` |
| [ ] | 33 | [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Medium | `search` | `src/05-binary-search/search-in-rotated-sorted-array.js` |
| [ ] | 981 | [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/) | Medium | `TimeMap` | `src/05-binary-search/time-based-key-value-store.js` |
| [ ] | 4 | [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Hard | `findMedianSortedArrays` | `src/05-binary-search/median-of-two-sorted-arrays.js` |

### Linked List — 06-linked-list (11)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 206 | [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) | Easy | `reverseList` | `src/06-linked-list/reverse-linked-list.js` |
| [ ] | 21 | [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) | Easy | `mergeTwoLists` | `src/06-linked-list/merge-two-sorted-lists.js` |
| [ ] | 141 | [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) | Easy | `hasCycle` | `src/06-linked-list/linked-list-cycle.js` |
| [ ] | 143 | [Reorder List](https://leetcode.com/problems/reorder-list/) | Medium | `reorderList` | `src/06-linked-list/reorder-list.js` |
| [ ] | 19 | [Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | Medium | `removeNthFromEnd` | `src/06-linked-list/remove-nth-node-from-end-of-list.js` |
| [ ] | 138 | [Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/) | Medium | `copyRandomList` | `src/06-linked-list/copy-list-with-random-pointer.js` |
| [ ] | 2 | [Add Two Numbers](https://leetcode.com/problems/add-two-numbers/) | Medium | `addTwoNumbers` | `src/06-linked-list/add-two-numbers.js` |
| [ ] | 287 | [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) | Medium | `findDuplicate` | `src/06-linked-list/find-the-duplicate-number.js` |
| [ ] | 146 | [LRU Cache](https://leetcode.com/problems/lru-cache/) | Medium | `LRUCache` | `src/06-linked-list/lru-cache.js` |
| [ ] | 23 | [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | Hard | `mergeKLists` | `src/06-linked-list/merge-k-sorted-lists.js` |
| [ ] | 25 | [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) | Hard | `reverseKGroup` | `src/06-linked-list/reverse-nodes-in-k-group.js` |

### Trees — 07-trees (15)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 226 | [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) | Easy | `invertTree` | `src/07-trees/invert-binary-tree.js` |
| [ ] | 104 | [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Easy | `maxDepth` | `src/07-trees/maximum-depth-of-binary-tree.js` |
| [ ] | 543 | [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/) | Easy | `diameterOfBinaryTree` | `src/07-trees/diameter-of-binary-tree.js` |
| [ ] | 110 | [Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/) | Easy | `isBalanced` | `src/07-trees/balanced-binary-tree.js` |
| [ ] | 100 | [Same Tree](https://leetcode.com/problems/same-tree/) | Easy | `isSameTree` | `src/07-trees/same-tree.js` |
| [ ] | 572 | [Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree/) | Easy | `isSubtree` | `src/07-trees/subtree-of-another-tree.js` |
| [ ] | 235 | [Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) | Medium | `lowestCommonAncestor` | `src/07-trees/lowest-common-ancestor-of-a-binary-search-tree.js` |
| [ ] | 102 | [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Medium | `levelOrder` | `src/07-trees/binary-tree-level-order-traversal.js` |
| [ ] | 199 | [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/) | Medium | `rightSideView` | `src/07-trees/binary-tree-right-side-view.js` |
| [ ] | 1448 | [Count Good Nodes in Binary Tree](https://leetcode.com/problems/count-good-nodes-in-binary-tree/) | Medium | `goodNodes` | `src/07-trees/count-good-nodes-in-binary-tree.js` |
| [ ] | 98 | [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) | Medium | `isValidBST` | `src/07-trees/validate-binary-search-tree.js` |
| [ ] | 230 | [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | Medium | `kthSmallest` | `src/07-trees/kth-smallest-element-in-a-bst.js` |
| [ ] | 105 | [Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) | Medium | `buildTree` | `src/07-trees/construct-binary-tree-from-preorder-and-inorder-traversal.js` |
| [ ] | 124 | [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | Hard | `maxPathSum` | `src/07-trees/binary-tree-maximum-path-sum.js` |
| [ ] | 297 | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Hard | `serialize`, `deserialize` | `src/07-trees/serialize-and-deserialize-binary-tree.js` |

### Tries — 08-tries (3)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 208 | [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/) | Medium | `Trie` | `src/08-tries/implement-trie-prefix-tree.js` |
| [ ] | 211 | [Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/) | Medium | `WordDictionary` | `src/08-tries/design-add-and-search-words-data-structure.js` |
| [ ] | 212 | [Word Search II](https://leetcode.com/problems/word-search-ii/) | Hard | `findWords` | `src/08-tries/word-search-ii.js` |

### Heap / Priority Queue — 09-heap (7)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 703 | [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | Easy | `KthLargest` | `src/09-heap/kth-largest-element-in-a-stream.js` |
| [ ] | 1046 | [Last Stone Weight](https://leetcode.com/problems/last-stone-weight/) | Easy | `lastStoneWeight` | `src/09-heap/last-stone-weight.js` |
| [ ] | 973 | [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/) | Medium | `kClosest` | `src/09-heap/k-closest-points-to-origin.js` |
| [ ] | 215 | [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Medium | `findKthLargest` | `src/09-heap/kth-largest-element-in-an-array.js` |
| [ ] | 621 | [Task Scheduler](https://leetcode.com/problems/task-scheduler/) | Medium | `leastInterval` | `src/09-heap/task-scheduler.js` |
| [ ] | 355 | [Design Twitter](https://leetcode.com/problems/design-twitter/) | Medium | `Twitter` | `src/09-heap/design-twitter.js` |
| [ ] | 295 | [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Hard | `MedianFinder` | `src/09-heap/find-median-from-data-stream.js` |

### Backtracking — 10-backtracking (9)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 78 | [Subsets](https://leetcode.com/problems/subsets/) | Medium | `subsets` | `src/10-backtracking/subsets.js` |
| [ ] | 39 | [Combination Sum](https://leetcode.com/problems/combination-sum/) | Medium | `combinationSum` | `src/10-backtracking/combination-sum.js` |
| [ ] | 40 | [Combination Sum II](https://leetcode.com/problems/combination-sum-ii/) | Medium | `combinationSum2` | `src/10-backtracking/combination-sum-ii.js` |
| [ ] | 46 | [Permutations](https://leetcode.com/problems/permutations/) | Medium | `permute` | `src/10-backtracking/permutations.js` |
| [ ] | 90 | [Subsets II](https://leetcode.com/problems/subsets-ii/) | Medium | `subsetsWithDup` | `src/10-backtracking/subsets-ii.js` |
| [ ] | 79 | [Word Search](https://leetcode.com/problems/word-search/) | Medium | `exist` | `src/10-backtracking/word-search.js` |
| [ ] | 131 | [Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/) | Medium | `partition` | `src/10-backtracking/palindrome-partitioning.js` |
| [ ] | 17 | [Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | Medium | `letterCombinations` | `src/10-backtracking/letter-combinations-of-a-phone-number.js` |
| [ ] | 51 | [N-Queens](https://leetcode.com/problems/n-queens/) | Hard | `solveNQueens` | `src/10-backtracking/n-queens.js` |

### Graphs — 11-graphs (13)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 200 | [Number of Islands](https://leetcode.com/problems/number-of-islands/) | Medium | `numIslands` | `src/11-graphs/number-of-islands.js` |
| [ ] | 695 | [Max Area of Island](https://leetcode.com/problems/max-area-of-island/) | Medium | `maxAreaOfIsland` | `src/11-graphs/max-area-of-island.js` |
| [ ] | 133 | [Clone Graph](https://leetcode.com/problems/clone-graph/) | Medium | `cloneGraph` | `src/11-graphs/clone-graph.js` |
| [ ] | 286 | [Walls and Gates](https://leetcode.com/problems/walls-and-gates/) | Medium | `wallsAndGates` | `src/11-graphs/walls-and-gates.js` |
| [ ] | 994 | [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) | Medium | `orangesRotting` | `src/11-graphs/rotting-oranges.js` |
| [ ] | 417 | [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/) | Medium | `pacificAtlantic` | `src/11-graphs/pacific-atlantic-water-flow.js` |
| [ ] | 130 | [Surrounded Regions](https://leetcode.com/problems/surrounded-regions/) | Medium | `solve` | `src/11-graphs/surrounded-regions.js` |
| [ ] | 207 | [Course Schedule](https://leetcode.com/problems/course-schedule/) | Medium | `canFinish` | `src/11-graphs/course-schedule.js` |
| [ ] | 210 | [Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) | Medium | `findOrder` | `src/11-graphs/course-schedule-ii.js` |
| [ ] | 261 | [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/) | Medium | `validTree` | `src/11-graphs/graph-valid-tree.js` |
| [ ] | 323 | [Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Medium | `countComponents` | `src/11-graphs/number-of-connected-components-in-an-undirected-graph.js` |
| [ ] | 684 | [Redundant Connection](https://leetcode.com/problems/redundant-connection/) | Medium | `findRedundantConnection` | `src/11-graphs/redundant-connection.js` |
| [ ] | 127 | [Word Ladder](https://leetcode.com/problems/word-ladder/) | Hard | `ladderLength` | `src/11-graphs/word-ladder.js` |

### Advanced Graphs — 12-advanced-graphs (6)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 743 | [Network Delay Time](https://leetcode.com/problems/network-delay-time/) | Medium | `networkDelayTime` | `src/12-advanced-graphs/network-delay-time.js` |
| [ ] | 332 | [Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary/) | Hard | `findItinerary` | `src/12-advanced-graphs/reconstruct-itinerary.js` |
| [ ] | 1584 | [Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/) | Medium | `minCostConnectPoints` | `src/12-advanced-graphs/min-cost-to-connect-all-points.js` |
| [ ] | 778 | [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/) | Hard | `swimInWater` | `src/12-advanced-graphs/swim-in-rising-water.js` |
| [ ] | 269 | [Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) | Hard | `alienOrder` | `src/12-advanced-graphs/alien-dictionary.js` |
| [ ] | 787 | [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | Medium | `findCheapestPrice` | `src/12-advanced-graphs/cheapest-flights-within-k-stops.js` |

### 1-D DP — 13-dp-1d (12)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 70 | [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) | Easy | `climbStairs` | `src/13-dp-1d/climbing-stairs.js` |
| [ ] | 746 | [Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) | Easy | `minCostClimbingStairs` | `src/13-dp-1d/min-cost-climbing-stairs.js` |
| [ ] | 198 | [House Robber](https://leetcode.com/problems/house-robber/) | Medium | `rob` | `src/13-dp-1d/house-robber.js` |
| [ ] | 213 | [House Robber II](https://leetcode.com/problems/house-robber-ii/) | Medium | `rob2` | `src/13-dp-1d/house-robber-ii.js` |
| [ ] | 5 | [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) | Medium | `longestPalindrome` | `src/13-dp-1d/longest-palindromic-substring.js` |
| [ ] | 647 | [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/) | Medium | `countSubstrings` | `src/13-dp-1d/palindromic-substrings.js` |
| [ ] | 91 | [Decode Ways](https://leetcode.com/problems/decode-ways/) | Medium | `numDecodings` | `src/13-dp-1d/decode-ways.js` |
| [ ] | 322 | [Coin Change](https://leetcode.com/problems/coin-change/) | Medium | `coinChange` | `src/13-dp-1d/coin-change.js` |
| [ ] | 152 | [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) | Medium | `maxProduct` | `src/13-dp-1d/maximum-product-subarray.js` |
| [ ] | 139 | [Word Break](https://leetcode.com/problems/word-break/) | Medium | `wordBreak` | `src/13-dp-1d/word-break.js` |
| [ ] | 300 | [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) | Medium | `lengthOfLIS` | `src/13-dp-1d/longest-increasing-subsequence.js` |
| [ ] | 416 | [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) | Medium | `canPartition` | `src/13-dp-1d/partition-equal-subset-sum.js` |

### 2-D DP — 14-dp-2d (11)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 62 | [Unique Paths](https://leetcode.com/problems/unique-paths/) | Medium | `uniquePaths` | `src/14-dp-2d/unique-paths.js` |
| [ ] | 1143 | [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) | Medium | `longestCommonSubsequence` | `src/14-dp-2d/longest-common-subsequence.js` |
| [ ] | 309 | [Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) | Medium | `maxProfit` | `src/14-dp-2d/best-time-to-buy-and-sell-stock-with-cooldown.js` |
| [ ] | 518 | [Coin Change II](https://leetcode.com/problems/coin-change-ii/) | Medium | `change` | `src/14-dp-2d/coin-change-ii.js` |
| [ ] | 494 | [Target Sum](https://leetcode.com/problems/target-sum/) | Medium | `findTargetSumWays` | `src/14-dp-2d/target-sum.js` |
| [ ] | 97 | [Interleaving String](https://leetcode.com/problems/interleaving-string/) | Medium | `isInterleave` | `src/14-dp-2d/interleaving-string.js` |
| [ ] | 329 | [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) | Hard | `longestIncreasingPath` | `src/14-dp-2d/longest-increasing-path-in-a-matrix.js` |
| [ ] | 115 | [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/) | Hard | `numDistinct` | `src/14-dp-2d/distinct-subsequences.js` |
| [ ] | 72 | [Edit Distance](https://leetcode.com/problems/edit-distance/) | Medium | `minDistance` | `src/14-dp-2d/edit-distance.js` |
| [ ] | 312 | [Burst Balloons](https://leetcode.com/problems/burst-balloons/) | Hard | `maxCoins` | `src/14-dp-2d/burst-balloons.js` |
| [ ] | 10 | [Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/) | Hard | `isMatch` | `src/14-dp-2d/regular-expression-matching.js` |

### Greedy — 15-greedy (8)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 53 | [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) | Medium | `maxSubArray` | `src/15-greedy/maximum-subarray.js` |
| [ ] | 55 | [Jump Game](https://leetcode.com/problems/jump-game/) | Medium | `canJump` | `src/15-greedy/jump-game.js` |
| [ ] | 45 | [Jump Game II](https://leetcode.com/problems/jump-game-ii/) | Medium | `jump` | `src/15-greedy/jump-game-ii.js` |
| [ ] | 134 | [Gas Station](https://leetcode.com/problems/gas-station/) | Medium | `canCompleteCircuit` | `src/15-greedy/gas-station.js` |
| [ ] | 846 | [Hand of Straights](https://leetcode.com/problems/hand-of-straights/) | Medium | `isNStraightHand` | `src/15-greedy/hand-of-straights.js` |
| [ ] | 1899 | [Merge Triplets to Form Target Triplet](https://leetcode.com/problems/merge-triplets-to-form-target-triplet/) | Medium | `mergeTriplets` | `src/15-greedy/merge-triplets-to-form-target-triplet.js` |
| [ ] | 763 | [Partition Labels](https://leetcode.com/problems/partition-labels/) | Medium | `partitionLabels` | `src/15-greedy/partition-labels.js` |
| [ ] | 678 | [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string/) | Medium | `checkValidString` | `src/15-greedy/valid-parenthesis-string.js` |

### Intervals — 16-intervals (6)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 57 | [Insert Interval](https://leetcode.com/problems/insert-interval/) | Medium | `insert` | `src/16-intervals/insert-interval.js` |
| [ ] | 56 | [Merge Intervals](https://leetcode.com/problems/merge-intervals/) | Medium | `merge` | `src/16-intervals/merge-intervals.js` |
| [ ] | 435 | [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) | Medium | `eraseOverlapIntervals` | `src/16-intervals/non-overlapping-intervals.js` |
| [ ] | 252 | [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) | Easy | `canAttendMeetings` | `src/16-intervals/meeting-rooms.js` |
| [ ] | 253 | [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) | Medium | `minMeetingRooms` | `src/16-intervals/meeting-rooms-ii.js` |
| [ ] | 1851 | [Minimum Interval to Include Each Query](https://leetcode.com/problems/minimum-interval-to-include-each-query/) | Hard | `minInterval` | `src/16-intervals/minimum-interval-to-include-each-query.js` |

### Math & Geometry — 17-math-geometry (8)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 48 | [Rotate Image](https://leetcode.com/problems/rotate-image/) | Medium | `rotate` | `src/17-math-geometry/rotate-image.js` |
| [ ] | 54 | [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/) | Medium | `spiralOrder` | `src/17-math-geometry/spiral-matrix.js` |
| [ ] | 73 | [Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/) | Medium | `setZeroes` | `src/17-math-geometry/set-matrix-zeroes.js` |
| [ ] | 202 | [Happy Number](https://leetcode.com/problems/happy-number/) | Easy | `isHappy` | `src/17-math-geometry/happy-number.js` |
| [ ] | 66 | [Plus One](https://leetcode.com/problems/plus-one/) | Easy | `plusOne` | `src/17-math-geometry/plus-one.js` |
| [ ] | 50 | [Pow(x, n)](https://leetcode.com/problems/powx-n/) | Medium | `myPow` | `src/17-math-geometry/pow-x-n.js` |
| [ ] | 43 | [Multiply Strings](https://leetcode.com/problems/multiply-strings/) | Medium | `multiply` | `src/17-math-geometry/multiply-strings.js` |
| [ ] | 2013 | [Detect Squares](https://leetcode.com/problems/detect-squares/) | Medium | `DetectSquares` | `src/17-math-geometry/detect-squares.js` |

### Bit Manipulation — 18-bit-manipulation (7)

| Done | # | Problem | Difficulty | Export | File |
|---|---|---|---|---|---|
| [ ] | 136 | [Single Number](https://leetcode.com/problems/single-number/) | Easy | `singleNumber` | `src/18-bit-manipulation/single-number.js` |
| [ ] | 191 | [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) | Easy | `hammingWeight` | `src/18-bit-manipulation/number-of-1-bits.js` |
| [ ] | 338 | [Counting Bits](https://leetcode.com/problems/counting-bits/) | Easy | `countBits` | `src/18-bit-manipulation/counting-bits.js` |
| [ ] | 190 | [Reverse Bits](https://leetcode.com/problems/reverse-bits/) | Easy | `reverseBits` | `src/18-bit-manipulation/reverse-bits.js` |
| [ ] | 268 | [Missing Number](https://leetcode.com/problems/missing-number/) | Easy | `missingNumber` | `src/18-bit-manipulation/missing-number.js` |
| [ ] | 371 | [Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/) | Medium | `getSum` | `src/18-bit-manipulation/sum-of-two-integers.js` |
| [ ] | 7 | [Reverse Integer](https://leetcode.com/problems/reverse-integer/) | Medium | `reverse` | `src/18-bit-manipulation/reverse-integer.js` |
