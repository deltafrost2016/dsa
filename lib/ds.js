/**
 * Data-structure helpers shared by tests (and by solutions that need the node classes).
 * Formats follow LeetCode so examples can be pasted straight into tests.
 */

/** Safety cap so a cyclic structure can never hang a helper. */
const MAX_NODES = 100000;

// ---------------------------------------------------------------- linked list

/** Singly linked list node. */
export class ListNode {
  /**
   * @param {number} [val=0]
   * @param {ListNode|null} [next=null]
   */
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * Build a singly linked list from an array.
 * @param {number[]} arr
 * @returns {ListNode|null} head, or null for an empty array
 */
export function buildList(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = new ListNode(arr[i], head);
  return head;
}

/**
 * Convert a list to an array. Stops after 100000 nodes so a cycle never hangs.
 * @param {ListNode|null} head
 * @returns {number[]}
 */
export function listToArray(head) {
  const out = [];
  let cur = head;
  while (cur && out.length < MAX_NODES) {
    out.push(cur.val);
    cur = cur.next;
  }
  return out;
}

/**
 * Build a list whose tail points back to the node at index `pos` (LeetCode "pos").
 * @param {number[]} arr
 * @param {number} pos index the tail links to; -1 means no cycle
 * @returns {ListNode|null} head, or null for an empty array
 */
export function buildCyclicList(arr, pos) {
  const head = buildList(arr);
  if (!head || pos < 0) return head;
  if (pos >= arr.length) throw new RangeError(`pos ${pos} out of range for length ${arr.length}`);
  let target = null;
  let tail = head;
  for (let i = 0; ; i++) {
    if (i === pos) target = tail;
    if (!tail.next) break;
    tail = tail.next;
  }
  tail.next = target;
  return head;
}

/** Linked list node with an extra `random` pointer. */
export class RandomListNode {
  /**
   * @param {number} [val=0]
   * @param {RandomListNode|null} [next=null]
   * @param {RandomListNode|null} [random=null]
   */
  constructor(val = 0, next = null, random = null) {
    this.val = val;
    this.next = next;
    this.random = random;
  }
}

/**
 * Build a random-pointer list from LeetCode's `[[val, randomIndex|null], ...]` format.
 * @param {Array<[number, number|null]>} pairs
 * @returns {RandomListNode|null}
 */
export function buildRandomList(pairs) {
  const nodes = pairs.map(([val]) => new RandomListNode(val));
  pairs.forEach(([, r], i) => {
    if (i + 1 < nodes.length) nodes[i].next = nodes[i + 1];
    nodes[i].random = r === null || r === undefined ? null : nodes[r];
  });
  return nodes[0] ?? null;
}

/**
 * Inverse of buildRandomList. Random pointers to nodes outside the list yield -1.
 * @param {RandomListNode|null} head
 * @returns {Array<[number, number|null]>}
 */
export function randomListToArray(head) {
  const nodes = [];
  const index = new Map();
  for (let cur = head; cur && nodes.length < MAX_NODES && !index.has(cur); cur = cur.next) {
    index.set(cur, nodes.length);
    nodes.push(cur);
  }
  return nodes.map((n) => [n.val, n.random ? (index.has(n.random) ? index.get(n.random) : -1) : null]);
}

// ----------------------------------------------------------------------- tree

/** Binary tree node. */
export class TreeNode {
  /**
   * @param {number} [val=0]
   * @param {TreeNode|null} [left=null]
   * @param {TreeNode|null} [right=null]
   */
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Build a tree from LeetCode level-order format, e.g. [3,9,20,null,null,15,7].
 * @param {Array<number|null>} levelOrder
 * @returns {TreeNode|null}
 */
export function buildTree(levelOrder) {
  if (!levelOrder.length || levelOrder[0] === null || levelOrder[0] === undefined) return null;
  const root = new TreeNode(levelOrder[0]);
  const queue = [root];
  let head = 0;
  let i = 1;
  while (head < queue.length && i < levelOrder.length) {
    const node = queue[head++];
    const l = levelOrder[i++];
    if (l !== null && l !== undefined) {
      node.left = new TreeNode(l);
      queue.push(node.left);
    }
    if (i < levelOrder.length) {
      const r = levelOrder[i++];
      if (r !== null && r !== undefined) {
        node.right = new TreeNode(r);
        queue.push(node.right);
      }
    }
  }
  return root;
}

/**
 * Serialize a tree to LeetCode level-order format (trailing nulls trimmed).
 * @param {TreeNode|null} root
 * @returns {Array<number|null>}
 */
export function treeToArray(root) {
  if (!root) return [];
  const out = [];
  const queue = [root];
  let head = 0;
  while (head < queue.length && out.length < MAX_NODES) {
    const node = queue[head++];
    if (node === null) {
      out.push(null);
      continue;
    }
    out.push(node.val);
    queue.push(node.left ?? null, node.right ?? null);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

/**
 * Find the first node (preorder) with the given value.
 * @param {TreeNode|null} root
 * @param {number} val
 * @returns {TreeNode|null}
 */
export function findNode(root, val) {
  const stack = root ? [root] : [];
  while (stack.length) {
    const node = stack.pop();
    if (node.val === val) return node;
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return null;
}

// ---------------------------------------------------------------------- graph

/** Undirected graph node (LeetCode Clone Graph). */
export class GraphNode {
  /**
   * @param {number} [val=0]
   * @param {GraphNode[]} [neighbors=[]]
   */
  constructor(val = 0, neighbors = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

/**
 * Build a graph from LeetCode's 1-indexed adjacency list: adj[i] lists the
 * neighbor values of node i+1. Returns node 1, or null for an empty list.
 * @param {number[][]} adj
 * @returns {GraphNode|null}
 */
export function buildGraph(adj) {
  if (!adj.length) return null;
  const nodes = adj.map((_, i) => new GraphNode(i + 1));
  adj.forEach((ns, i) => {
    nodes[i].neighbors = ns.map((v) => nodes[v - 1]);
  });
  return nodes[0];
}

/**
 * Inverse of buildGraph: walks everything reachable from `node` and returns
 * the adjacency list indexed by val-1 (neighbor order preserved). Assumes
 * vals are 1..n; gaps become empty arrays.
 * @param {GraphNode|null} node
 * @returns {number[][]}
 */
export function graphToAdjList(node) {
  if (!node) return [];
  const seen = new Map([[node.val, node]]);
  const queue = [node];
  let head = 0;
  while (head < queue.length && seen.size < MAX_NODES) {
    const cur = queue[head++];
    for (const nb of cur.neighbors) {
      if (!seen.has(nb.val)) {
        seen.set(nb.val, nb);
        queue.push(nb);
      }
    }
  }
  const n = Math.max(...seen.keys());
  const out = Array.from({ length: n }, () => []);
  for (const [val, nd] of seen) out[val - 1] = nd.neighbors.map((x) => x.val);
  return out;
}
