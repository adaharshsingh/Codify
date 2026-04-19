// Mock CP problems — 3 topics × 4 problems each
// User will replace/extend this with real content later

export const topics = [
  {
    id: 't1',
    title: 'Binary Search',
    icon: '🔍',
    color: 'emerald',
    problems: [
      {
        id: 'p1',
        topicId: 't1',
        topicTitle: 'Binary Search',
        title: 'Search in a Sorted Array',
        difficulty: 'Easy',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/binary-search/',
        statement:
          'Given a sorted array of integers `nums` and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise return `-1`.\n\nYou must write an algorithm with **O(log n)** runtime complexity.',
        constraints: '• 1 ≤ nums.length ≤ 10⁴\n• -10⁴ < nums[i], target < 10⁴\n• All integers in nums are unique\n• nums is sorted in ascending order',
        examples: [
          { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums at index 4.' },
          { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums.' },
        ],
      },
      {
        id: 'p2',
        topicId: 't1',
        topicTitle: 'Binary Search',
        title: 'Find Peak Element',
        difficulty: 'Medium',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/find-peak-element/',
        statement:
          'A peak element is an element that is strictly greater than its neighbors.\n\nGiven a 0-indexed integer array `nums`, find a peak element and return its index. If the array contains multiple peaks, return the index of any peak.\n\nYou may imagine `nums[-1] = nums[n] = −∞`. Solve in **O(log n)** time.',
        constraints: '• 1 ≤ nums.length ≤ 1000\n• -2³¹ ≤ nums[i] ≤ 2³¹ − 1\n• nums[i] ≠ nums[i+1] for all valid i',
        examples: [
          { input: 'nums = [1,2,3,1]', output: '2', explanation: 'nums[2] = 3 is a peak element.' },
          { input: 'nums = [1,2,1,3,5,6,4]', output: '5', explanation: 'nums[5] = 6 is a peak element.' },
        ],
      },
      {
        id: 'p3',
        topicId: 't1',
        topicTitle: 'Binary Search',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        statement:
          'There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not.',
        constraints: '• 1 ≤ nums.length ≤ 5000\n• -10⁴ ≤ nums[i] ≤ 10⁴\n• All values in nums are unique\n• nums is an ascending array rotated at some pivot',
        examples: [
          { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
          { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
        ],
      },
      {
        id: 'p4',
        topicId: 't1',
        topicTitle: 'Binary Search',
        title: 'First Bad Version',
        difficulty: 'Easy',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/first-bad-version/',
        statement:
          'You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all versions after a bad version are also bad.\n\nGiven `n` versions, find the first bad one using the API `bool isBadVersion(version)`. Minimize the number of API calls.',
        constraints: '• 1 ≤ bad ≤ n ≤ 2³¹ − 1',
        examples: [
          { input: 'n = 5, bad = 4', output: '4', explanation: 'Versions 1,2,3 are good; 4 and 5 are bad.' },
          { input: 'n = 1, bad = 1', output: '1' },
        ],
      },
    ],
  },
  {
    id: 't2',
    title: 'Dynamic Programming',
    icon: '⚡',
    color: 'violet',
    problems: [
      {
        id: 'p5',
        topicId: 't2',
        topicTitle: 'Dynamic Programming',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/climbing-stairs/',
        statement:
          'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
        constraints: '• 1 ≤ n ≤ 45',
        examples: [
          { input: 'n = 2', output: '2', explanation: '1+1 or 2.' },
          { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' },
        ],
      },
      {
        id: 'p6',
        topicId: 't2',
        topicTitle: 'Dynamic Programming',
        title: 'House Robber',
        difficulty: 'Medium',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/house-robber/',
        statement:
          'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected and will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array `nums`, return the maximum amount of money you can rob without alerting the police.',
        constraints: '• 1 ≤ nums.length ≤ 100\n• 0 ≤ nums[i] ≤ 400',
        examples: [
          { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 1 (1) then house 3 (3). Total = 4.' },
          { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob houses 1, 3, and 5. Total = 12.' },
        ],
      },
      {
        id: 'p7',
        topicId: 't2',
        topicTitle: 'Dynamic Programming',
        title: 'Coin Change',
        difficulty: 'Medium',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/coin-change/',
        statement:
          'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins needed to make up that amount. If no combination makes the amount, return `-1`.\n\nYou may assume you have an infinite number of each denomination.',
        constraints: '• 1 ≤ coins.length ≤ 12\n• 1 ≤ coins[i] ≤ 2³¹ − 1\n• 0 ≤ amount ≤ 10⁴',
        examples: [
          { input: 'coins = [1,5,6,9], amount = 11', output: '2', explanation: '5+6 = 11.' },
          { input: 'coins = [2], amount = 3', output: '-1' },
        ],
      },
      {
        id: 'p8',
        topicId: 't2',
        topicTitle: 'Dynamic Programming',
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/longest-increasing-subsequence/',
        statement:
          'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\nA subsequence is derived from an array by deleting some (or none) of the elements without changing the order of the remaining elements.',
        constraints: '• 1 ≤ nums.length ≤ 2500\n• -10⁴ ≤ nums[i] ≤ 10⁴',
        examples: [
          { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'LIS is [2,3,7,101].' },
          { input: 'nums = [0,1,0,3,2,3]', output: '4' },
        ],
      },
    ],
  },
  {
    id: 't3',
    title: 'Graph Algorithms',
    icon: '🌐',
    color: 'sky',
    problems: [
      {
        id: 'p9',
        topicId: 't3',
        topicTitle: 'Graph Algorithms',
        title: 'Number of Islands',
        difficulty: 'Medium',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/number-of-islands/',
        statement:
          'Given an `m × n` 2D binary grid `grid` which represents a map of `\'1\'` (land) and `\'0\'` (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
        constraints: '• m == grid.length, n == grid[i].length\n• 1 ≤ m, n ≤ 300\n• grid[i][j] is \'0\' or \'1\'',
        examples: [
          { input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2' },
          { input: 'grid = [["1","0","0"],["0","1","0"],["0","0","1"]]', output: '3' },
        ],
      },
      {
        id: 'p10',
        topicId: 't3',
        topicTitle: 'Graph Algorithms',
        title: 'Course Schedule',
        difficulty: 'Medium',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/course-schedule/',
        statement:
          'There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates you must take course `bi` first to take course `ai`.\n\nReturn `true` if you can finish all courses. Otherwise return `false`.',
        constraints: '• 1 ≤ numCourses ≤ 2000\n• 0 ≤ prerequisites.length ≤ 5000\n• prerequisites[i].length == 2\n• All pairs are unique',
        examples: [
          { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true', explanation: 'Take 0 then 1.' },
          { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false', explanation: 'Cycle detected.' },
        ],
      },
      {
        id: 'p11',
        topicId: 't3',
        topicTitle: 'Graph Algorithms',
        title: 'Word Ladder',
        difficulty: 'Hard',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/word-ladder/',
        statement:
          'A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words where:\n• Each consecutive pair differs by exactly one letter.\n• Every word in the sequence is in `wordList`.\n\nReturn the number of words in the shortest transformation sequence, or `0` if no such sequence exists.',
        constraints: '• 1 ≤ beginWord.length ≤ 10\n• endWord.length == beginWord.length\n• 1 ≤ wordList.length ≤ 5000\n• All words have equal length and consist of lowercase English letters',
        examples: [
          { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'hit→hot→dot→dog→cog' },
          { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0' },
        ],
      },
      {
        id: 'p12',
        topicId: 't3',
        topicTitle: 'Graph Algorithms',
        title: 'Clone Graph',
        difficulty: 'Medium',
        platform: 'LeetCode',
        lcLink: 'https://leetcode.com/problems/clone-graph/',
        statement:
          'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.\n\nEach node contains a value (`int`) and a list of its neighbors (`List[Node]`). The graph is represented as an adjacency list.',
        constraints: '• The number of nodes in the graph is in range [0, 100]\n• 1 ≤ Node.val ≤ 100\n• Node.val is unique for each node\n• No repeated edges; no self-loops\n• The graph is connected',
        examples: [
          { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' },
          { input: 'adjList = [[]]', output: '[[]]' },
        ],
      },
    ],
  },
];

// Lookup map for fast access
export const problemMap = {};
topics.forEach((t) => t.problems.forEach((p) => (problemMap[p.id] = p)));
