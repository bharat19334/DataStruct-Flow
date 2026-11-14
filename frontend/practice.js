// Complete Curated DSA Sheet Dataset from uploaded Excel Sheet (539 Questions)
const TOPICS = [
  "All",
  "Array",
  "Strings",
  "Two Pointers",
  "Sliding Window",
  "Hashing",
  "Stack",
  "Queue",
  "Binary Search",
  "Linked List",
  "Trees",
  "Binary Search Tree",
  "Heap / Priority Queue",
  "Graph",
  "Greedy",
  "Backtracking",
  "Trie",
  "Bit Manipulation",
  "Dynamic Programming"
];

const TIER_TEMPLATE = [
  { key: "EASY", badgeClass: "badge-easy", subtitle: "Core Needs", dotColor: "#10b981" },
  { key: "MEDIUM", badgeClass: "badge-medium", subtitle: "Intermediate", dotColor: "#f59e0b" },
  { key: "HARD", badgeClass: "badge-hard", subtitle: "Advanced Logic", dotColor: "#ef4444" },
  { key: "PLACEMENT", badgeClass: "badge-placement", subtitle: "Top Company Rounds", dotColor: "#0d9488" },
  { key: "INTERVIEW", badgeClass: "badge-interview", subtitle: "FAANG & Product MNCs", dotColor: "#6366f1" }
];

const QUESTION_BANK = {
  "Array": {
    "EASY": ["LC 1920: Build Array from Permutation", "LC 1929: Concatenation of Array", "LC 1480: Running Sum of 1D Array", "LC 1672: Richest Customer Wealth", "LC 26: Remove Duplicates from Sorted Array", "LC 27: Remove Element", "LC 88: Merge Sorted Array", "LC 66: Plus One", "LC 169: Majority Element", "LC 121: Best Time to Buy and Sell Stock", "LC 283: Move Zeroes", "LC 217: Contains Duplicate", "LC 268: Missing Number", "LC 136: Single Number", "LC 414: Third Maximum Number"],
    "MEDIUM": ["LC 53: Maximum Subarray", "LC 238: Product of Array Except Self", "LC 189: Rotate Array", "LC 560: Subarray Sum Equals K", "LC 31: Next Permutation", "LC 75: Sort Colors"],
    "HARD": ["LC 41: First Missing Positive", "LC 42: Trapping Rain Water", "LC 84: Largest Rectangle in Histogram"],
    "PLACEMENT": ["LC 229: Majority Element II", "LC 54: Spiral Matrix", "LC 73: Set Matrix Zeroes"],
    "INTERVIEW": ["LC 48: Rotate Image", "LC 287: Find the Duplicate Number"]
  },
  "Strings": {
    "EASY": ["LC 344: Reverse String", "LC 125: Valid Palindrome", "LC 242: Valid Anagram", "LC 20: Valid Parentheses", "LC 14: Longest Common Prefix", "LC 409: Longest Palindrome", "LC 387: First Unique Character in a String", "LC 28: Find the Index of the First Occurrence in a String", "LC 58: Length of Last Word", "LC 383: Ransom Note", "LC 551: Student Attendance Record I", "LC 415: Add Strings", "LC 67: Add Binary", "LC 459: Repeated Substring Pattern", "LC 520: Detect Capital", "LC 389: Find the Difference"],
    "MEDIUM": ["LC 3: Longest Substring Without Repeating Characters", "LC 5: Longest Palindromic Substring", "LC 8: String to Integer (atoi)", "LC 49: Group Anagrams", "LC 151: Reverse Words in a String", "LC 6: Zigzag Conversion", "LC 12: Integer to Roman", "LC 13: Roman to Integer", "LC 43: Multiply Strings", "LC 165: Compare Version Numbers", "LC 187: Repeated DNA Sequences"],
    "HARD": ["LC 76: Minimum Window Substring", "LC 30: Substring with Concatenation of All Words", "LC 65: Valid Number"],
    "PLACEMENT": ["LC 557: Reverse Words in a String III", "LC 205: Isomorphic Strings", "LC 290: Word Pattern"],
    "INTERVIEW": ["LC 443: String Compression", "LC 648: Replace Words", "LC 8: String to Integer (atoi)"]
  },
  "Two Pointers": {
    "EASY": ["LC 125: Valid Palindrome", "LC 344: Reverse String", "LC 977: Squares of a Sorted Array", "LC 345: Reverse Vowels of a String", "LC 680: Valid Palindrome II", "LC 283: Move Zeroes", "LC 26: Remove Duplicates from Sorted Array", "LC 27: Remove Element", "LC 88: Merge Sorted Array", "LC 350: Intersection of Two Arrays II", "LC 141: Linked List Cycle", "LC 876: Middle of the Linked List", "LC 160: Intersection of Two Linked Lists"],
    "MEDIUM": ["LC 15: 3Sum", "LC 16: 3Sum Closest", "LC 18: 4Sum", "LC 11: Container With Most Water", "LC 75: Sort Colors", "LC 80: Remove Duplicates from Sorted Array II", "LC 209: Minimum Size Subarray Sum", "LC 167: Two Sum II - Input Array Is Sorted", "LC 1574: Shortest Subarray to be Removed to Make Array Sorted", "LC 633: Sum of Square Numbers", "LC 524: Longest Word in Dictionary through Deleting", "LC 881: Boats to Save People", "LC 923: 3Sum With Multiplicity", "LC 986: Interval List Intersections", "LC 713: Subarray Product Less Than K", "LC 424: Longest Repeating Character Replacement"],
    "HARD": ["LC 42: Trapping Rain Water"]
  },
  "Sliding Window": {
    "EASY": ["LC 643: Maximum Average Subarray I", "LC 219: Contains Duplicate II"],
    "MEDIUM": ["LC 3: Longest Substring Without Repeating Characters", "LC 209: Minimum Size Subarray Sum", "LC 438: Find All Anagrams in a String", "LC 567: Permutation in String", "LC 1004: Max Consecutive Ones III", "LC 1456: Maximum Number of Vowels in a Substring of Given Length", "LC 1248: Count Number of Nice Subarrays", "LC 930: Binary Subarrays With Sum", "LC 992: Subarrays with K Different Integers", "LC 340: Longest Substring with At Most K Distinct Characters", "LC 159: Longest Substring with At Most Two Distinct Characters", "LC 424: Longest Repeating Character Replacement", "LC 76.1: Sliding Window Maximum (Variant)", "LC 239: Sliding Window Maximum", "LC 1438: Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit", "LC 1658: Minimum Operations to Reduce X to Zero", "LC 1838: Frequency of the Most Frequent Element", "LC 1208: Get Equal Substrings Within Budget", "LC 904: Fruit Into Baskets", "LC 2962: Count Subarrays Where Max Element Appears at Least K Times", "LC 2779: Maximum Beauty of an Array After Applying Operation", "LC 2958: Length of Longest Subarray With at Most K Frequency", "LC 2302: Count Subarrays With Score Less Than K", "LC 2461: Maximum Sum of Distinct Subarrays With Length K"],
    "HARD": ["LC 76: Minimum Window Substring", "LC 30: Substring with Concatenation of All Words", "LC 632: Smallest Range Covering Elements from K Lists", "LC 992: Subarrays with K Different Integers"]
  },
  "Hashing": {
    "EASY": ["LC 1: Two Sum", "LC 217: Contains Duplicate", "LC 219: Contains Duplicate II", "LC 242: Valid Anagram", "LC 383: Ransom Note", "LC 349: Intersection of Two Arrays", "LC 350: Intersection of Two Arrays II", "LC 387: First Unique Character in a String", "LC 500: Keyboard Row", "LC 575: Distribute Candies", "LC 594: Longest Harmonious Subsequence", "LC 705: Design HashSet"],
    "MEDIUM": ["LC 49: Group Anagrams", "LC 128: Longest Consecutive Sequence", "LC 560: Subarray Sum Equals K", "LC 525: Contiguous Array", "LC 325: Maximum Size Subarray Sum Equals k", "LC 974: Subarray Sums Divisible by K", "LC 380: Insert Delete GetRandom O(1)", "LC 355: Design Twitter", "LC 692: Top K Frequent Words", "LC 347: Top K Frequent Elements", "LC 451: Sort Characters By Frequency", "LC 811: Subdomain Visit Count", "LC 953: Verifying an Alien Dictionary", "LC 299: Bulls and Cows"],
    "HARD": ["LC 76: Minimum Window Substring", "LC 30: Substring with Concatenation of All Words", "LC 149: Max Points on a Line", "LC 218: The Skyline Problem"]
  },
  "Stack": {
    "EASY": ["LC 20: Valid Parentheses", "LC 155: Min Stack", "LC 232: Implement Queue using Stacks", "LC 682: Baseball Game", "LC 844: Backspace String Compare", "LC 1047: Remove All Adjacent Duplicates In String", "LC 496: Next Greater Element I", "LC 1598: Crawler Log Folder"],
    "MEDIUM": ["LC 150: Evaluate Reverse Polish Notation", "LC 739: Daily Temperatures", "LC 503: Next Greater Element II", "LC 456: 132 Pattern", "LC 394: Decode String", "LC 71: Simplify Path", "LC 901: Online Stock Span", "LC 907: Sum of Subarray Minimums", "LC 227: Basic Calculator II", "LC 853: Car Fleet", "LC 946: Validate Stack Sequences", "LC 1190: Reverse Substrings Between Each Pair of Parentheses", "LC 1541: Minimum Insertions to Balance a Parentheses String", "LC 1673: Find the Most Competitive Subsequence", "LC 2104: Sum of Subarray Ranges"],
    "HARD": ["LC 84: Largest Rectangle in Histogram", "LC 85: Maximal Rectangle", "LC 32: Longest Valid Parentheses", "LC 224: Basic Calculator", "LC 42: Trapping Rain Water", "LC 768: Max Chunks To Make Sorted II", "LC 895: Maximum Frequency Stack"]
  },
  "Queue": {
    "EASY": ["LC 225: Implement Stack using Queues", "LC 933: Number of Recent Calls", "LC 346: Moving Average from Data Stream", "LC 1700: Number of Students Unable to Eat Lunch", "LC 2073: Time Needed to Buy Tickets", "LC 2259: Remove Digit From Number to Maximize Result"],
    "MEDIUM": ["LC 239: Sliding Window Maximum", "LC 346: Moving Average", "LC 622: Design Circular Queue", "LC 641: Design Circular Deque", "LC 950: Reveal Cards In Increasing Order", "LC 962: Maximum Width Ramp", "LC 1438: Longest Continuous Subarray With Absolute Diff", "LC 1658: Minimum Operations to Reduce X to Zero", "LC 1823: Find the Winner of the Circular Game", "LC 2071: Maximum Number of Tasks You Can Assign", "LC 2104: Sum of Subarray Ranges", "LC 2398: Maximum Number of Robots Within Budget", "LC 2439: Minimize Maximum of Array", "LC 2542: Maximum Subsequence Score", "LC 2816: Double a Number Represented as a Linked List", "LC 2862: Maximum Element-Sum of a Complete Subset", "LC 297: Serialize and Deserialize Binary Tree", "LC 994: Rotting Oranges"],
    "HARD": ["LC 239: Sliding Window Maximum", "LC 862: Shortest Subarray with Sum at Least K", "LC 1425: Constrained Subsequence Sum", "LC 1696: Jump Game VI", "LC 2398: Maximum Number of Robots Within Budget", "LC 321: Create Maximum Number"]
  },
  "Binary Search": {
    "EASY": ["LC 704: Binary Search", "LC 35: Search Insert Position", "LC 374: Guess Number Higher or Lower", "LC 69: Sqrt(x)", "LC 367: Valid Perfect Square", "LC 278: First Bad Version", "LC 441: Arranging Coins", "LC 1385: Find the Distance Value Between Two Arrays"],
    "MEDIUM": ["LC 34: Find First and Last Position of Element in Sorted Array", "LC 33: Search in Rotated Sorted Array", "LC 81: Search in Rotated Sorted Array II", "LC 153: Find Minimum in Rotated Sorted Array", "LC 162: Find Peak Element", "LC 540: Single Element in a Sorted Array", "LC 852: Peak Index in a Mountain Array", "LC 1095: Find in Mountain Array", "LC 658: Find K Closest Elements", "LC 875: Koko Eating Bananas", "LC 1011: Capacity To Ship Packages Within D Days", "LC 1482: Minimum Number of Days to Make m Bouquets", "LC 1283: Find the Smallest Divisor Given a Threshold", "LC 1870: Minimum Speed to Arrive on Time", "LC 2187: Minimum Time to Complete Trips", "LC 2529: Maximum Count of Positive Integer and Negative Integer", "LC 2564: Substring XOR Queries"],
    "HARD": ["LC 4: Median of Two Sorted Arrays", "LC 410: Split Array Largest Sum", "LC 1235: Maximum Profit in Job Scheduling", "LC 778: Swim in Rising Water", "LC 878: Nth Magical Number"]
  },
  "Linked List": {
    "EASY": ["LC 206: Reverse Linked List", "LC 21: Merge Two Sorted Lists", "LC 141: Linked List Cycle", "LC 876: Middle of the Linked List", "LC 234: Palindrome Linked List", "LC 1290: Convert Binary Number in a Linked List to Integer", "LC 203: Remove Linked List Elements", "LC 83: Remove Duplicates from Sorted List", "LC 160: Intersection of Two Linked Lists"],
    "MEDIUM": ["LC 19: Remove Nth Node From End of List", "LC 2: Add Two Numbers", "LC 24: Swap Nodes in Pairs", "LC 61: Rotate List", "LC 142: Linked List Cycle II", "LC 143: Reorder List", "LC 328: Odd Even Linked List", "LC 445: Add Two Numbers II", "LC 82: Remove Duplicates from Sorted List II", "LC 725: Split Linked List in Parts", "LC 1721: Swapping Nodes in a Linked List", "LC 2095: Delete the Middle Node of a Linked List", "LC 2130: Maximum Twin Sum of a Linked List", "LC 2181: Merge Nodes in Between Zeros", "LC 2487: Remove Nodes From Linked List", "LC 2807: Insert Greatest Common Divisors in Linked List", "LC 1171: Remove Zero Sum Consecutive Nodes from Linked List", "LC 23: Merge k Sorted Lists"],
    "HARD": ["LC 25: Reverse Nodes in k-Group", "LC 138: Copy List with Random Pointer", "LC 460: LFU Cache"]
  },
  "Trees": {
    "EASY": ["LC 104: Maximum Depth of Binary Tree", "LC 226: Invert Binary Tree", "LC 543: Diameter of Binary Tree", "LC 100: Same Tree", "LC 101: Symmetric Tree", "LC 112: Path Sum", "LC 257: Binary Tree Paths", "LC 404: Sum of Left Leaves", "LC 572: Subtree of Another Tree", "LC 617: Merge Two Binary Trees", "LC 637: Average of Levels in Binary Tree", "LC 872: Leaf-Similar Trees"],
    "MEDIUM": ["LC 102: Binary Tree Level Order Traversal", "LC 103: Binary Tree Zigzag Level Order Traversal", "LC 199: Binary Tree Right Side View", "LC 114: Flatten Binary Tree to Linked List", "LC 129: Sum Root to Leaf Numbers", "LC 236: Lowest Common Ancestor of a Binary Tree", "LC 437: Path Sum III", "LC 508: Most Frequent Subtree Sum", "LC 662: Maximum Width of Binary Tree", "LC 988: Smallest String Starting From Leaf", "LC 1302: Deepest Leaves Sum", "LC 1315: Sum of Nodes with Even-Valued Grandparent", "LC 1379: Find a Corresponding Node of a Binary Tree in a Clone of That Tree", "LC 1448: Count Good Nodes in Binary Tree"],
    "HARD": ["LC 124: Binary Tree Maximum Path Sum", "LC 297: Serialize and Deserialize Binary Tree", "LC 968: Binary Tree Cameras", "LC 1373: Maximum Sum BST in Binary Tree"]
  },
  "Binary Search Tree": {
    "EASY": ["LC 700: Search in a Binary Search Tree", "LC 938: Range Sum of BST", "LC 653: Two Sum IV - Input is a BST", "LC 530: Minimum Absolute Difference in BST", "LC 501: Find Mode in Binary Search Tree", "LC 897: Increasing Order Search Tree", "LC 235: Lowest Common Ancestor of a Binary Search Tree"],
    "MEDIUM": ["LC 98: Validate Binary Search Tree", "LC 450: Delete Node in a BST", "LC 701: Insert into a Binary Search Tree", "LC 230: Kth Smallest Element in a BST", "LC 108: Convert Sorted Array to Binary Search Tree", "LC 109: Convert Sorted List to Binary Search Tree", "LC 173: Binary Search Tree Iterator", "LC 538: Convert BST to Greater Tree", "LC 669: Trim a Binary Search Tree", "LC 1382: Balance a Binary Search Tree", "LC 2476: Closest Nodes Queries in a Binary Search Tree", "LC 1305: All Elements in Two Binary Search Trees", "LC 96: Unique Binary Search Trees", "LC 95: Unique Binary Search Trees II", "LC 820: Short Encoding of Words", "LC 331: Verify Preorder Serialization of a Binary Tree", "LC 449: Serialize and Deserialize BST", "LC 510: Inorder Successor in BST II"],
    "HARD": ["LC 99: Recover Binary Search Tree", "LC 272: Closest Binary Search Tree Value II", "LC 1932: Merge BSTs to Create Single BST", "LC 1373: Maximum Sum BST in Binary Tree", "LC 308: Range Sum Query 2D - Mutable"]
  },
  "Heap / Priority Queue": {
    "EASY": ["LC 703: Kth Largest Element in a Stream", "LC 1046: Last Stone Weight", "LC 2335: Minimum Amount of Time to Fill Cups"],
    "MEDIUM": ["LC 215: Kth Largest Element in an Array", "LC 347: Top K Frequent Elements", "LC 451: Sort Characters By Frequency", "LC 658: Find K Closest Elements", "LC 973: K Closest Points to Origin", "LC 373: Find K Pairs with Smallest Sums", "LC 621: Task Scheduler", "LC 767: Reorganize String", "LC 846: Hand of Straights", "LC 1054: Distant Barcodes", "LC 1642: Furthest Building You Can Reach", "LC 1834: Single-Threaded CPU", "LC 1962: Remove Stones to Minimize the Total", "LC 2034: Stock Price Fluctuation", "LC 2208: Minimum Operations to Halve Array Sum", "LC 2336: Smallest Number in Infinite Set", "LC 2353: Design a Food Rating System", "LC 2402: Meeting Rooms III", "LC 2542: Maximum Subsequence Score", "LC 2558: Take Gifts From the Richest Pile"],
    "HARD": ["LC 295: Find Median from Data Stream", "LC 23: Merge k Sorted Lists", "LC 502: IPO", "LC 786: K-th Smallest Prime Fraction", "LC 857: Minimum Cost to Hire K Workers", "LC 1383: Maximum Performance of a Team", "LC 218: The Skyline Problem"]
  },
  "Graph": {
    "EASY": ["LC 1971: Find if Path Exists in Graph", "LC 1791: Find Center of Star Graph", "LC 733: Flood Fill", "LC 997: Find the Town Judge"],
    "MEDIUM": ["LC 207: Course Schedule", "LC 210: Course Schedule II", "LC 841: Keys and Rooms", "LC 547: Number of Provinces", "LC 684: Redundant Connection", "LC 1319: Number of Operations to Make Network Connected", "LC 785: Is Graph Bipartite?", "LC 1334: Find the City With the Smallest Number of Neighbors at a Threshold Distance", "LC 743: Network Delay Time", "LC 1514: Path with Maximum Probability", "LC 1631: Path With Minimum Effort", "LC 787: Cheapest Flights Within K Stops", "LC 1976: Number of Ways to Arrive at Destination", "LC 1091: Shortest Path in Binary Matrix", "LC 542: Matrix 01", "LC 1020: Number of Enclaves", "LC 1254: Number of Closed Islands", "LC 130: Surrounded Regions", "LC 994: Rotting Oranges", "LC 1162: As Far from Land as Possible", "LC 1129: Shortest Path with Alternating Colors"],
    "HARD": ["LC 127: Word Ladder", "LC 126: Word Ladder II", "LC 310: Minimum Height Trees", "LC 803: Bricks Falling When Hit", "LC 834: Sum of Distances in Tree"]
  },
  "Greedy": {
    "EASY": ["LC 455: Assign Cookies", "LC 860: Lemonade Change", "LC 1005: Maximize Sum Of Array After K Negations", "LC 1217: Minimum Cost to Move Chips to The Same Position", "LC 2160: Minimum Sum of Four Digit Number After Splitting Digits", "LC 2244: Minimum Rounds to Complete All Tasks"],
    "MEDIUM": ["LC 55: Jump Game", "LC 45: Jump Game II", "LC 134: Gas Station", "LC 135: Candy", "LC 406: Queue Reconstruction by Height", "LC 435: Non-overlapping Intervals", "LC 452: Minimum Number of Arrows to Burst Balloons", "LC 605: Can Place Flowers", "LC 646: Maximum Length of Pair Chain", "LC 678: Valid Parenthesis String", "LC 738: Monotone Increasing Digits", "LC 763: Partition Labels", "LC 870: Advantage Shuffle", "LC 881: Boats to Save People", "LC 948: Bag of Tokens", "LC 991: Broken Calculator", "LC 1029: Two City Scheduling", "LC 1094: Car Pooling"],
    "HARD": ["LC 135: Candy", "LC 502: IPO", "LC 630: Course Schedule III", "LC 757: Set Intersection Size At Least Two", "LC 871: Minimum Number of Refueling Stops", "LC 1383: Maximum Performance of a Team"]
  },
  "Backtracking": {
    "EASY": ["LC 257: Binary Tree Paths", "LC 401: Binary Watch", "LC 784: Letter Case Permutation"],
    "MEDIUM": ["LC 46: Permutations", "LC 47: Permutations II", "LC 78: Subsets", "LC 90: Subsets II", "LC 39: Combination Sum", "LC 40: Combination Sum II", "LC 216: Combination Sum III", "LC 377: Combination Sum IV", "LC 77: Combinations", "LC 131: Palindrome Partitioning", "LC 93: Restore IP Addresses", "LC 79: Word Search", "LC 17: Letter Combinations of a Phone Number", "LC 1239: Maximum Length of a Concatenated String with Unique Characters", "LC 473: Matchsticks to Square", "LC 698: Partition to K Equal Sum Subsets", "LC 842: Split Array into Fibonacci Sequence", "LC 1079: Letter Tile Possibilities", "LC 1255: Maximum Score Words Formed by Letters", "LC 1415: The k-th Lexicographical String of All Happy Strings"],
    "HARD": ["LC 51: N-Queens", "LC 52: N-Queens II", "LC 37: Sudoku Solver", "LC 212: Word Search II", "LC 301: Remove Invalid Parentheses", "LC 842: Split Array into Fibonacci Sequence", "LC 1240: Tiling a Rectangle with the Fewest Squares"]
  },
  "Trie": {
    "EASY": ["LC 208: Implement Trie (Prefix Tree)", "LC 14: Longest Common Prefix"],
    "MEDIUM": ["LC 211: Design Add and Search Words Data Structure", "LC 677: Map Sum Pairs", "LC 1268: Search Suggestions System", "LC 1804: Implement Trie II (Complete)", "LC 421: Maximum XOR of Two Numbers in an Array", "LC 642: Design Search Autocomplete System", "LC 720: Longest Word in Dictionary", "LC 820: Short Encoding of Words", "LC 1032: Stream of Characters", "LC 140: Word Break II", "LC 472: Concatenated Words", "LC 588: Design In-Memory File System", "LC 616: Add Bold Tag in String", "LC 745: Prefix and Suffix Search", "LC 1233: Remove Sub-Folders from the Filesystem"],
    "HARD": ["LC 212: Word Search II", "LC 1707: Maximum XOR With an Element From Array", "LC 336: Palindrome Pairs", "LC 2935: Maximum Strong Pair XOR II", "LC 2416: Sum of Prefix Scores of Strings", "LC 3093: Longest Common Suffix Queries", "LC 1948: Delete Duplicate Folders in System", "LC 732: My Calendar III", "LC 1157: Online Majority Element In Query Array", "LC 2354: Number of Excellent Pairs", "LC 30: Substring with Concatenation of All Words", "LC 1268: Search Suggestions System", "LC 421: Maximum XOR of Two Numbers in an Array"]
  },
  "Bit Manipulation": {
    "EASY": ["LC 191: Number of 1 Bits", "LC 338: Counting Bits", "LC 461: Hamming Distance", "LC 136: Single Number", "LC 231: Power of Two", "LC 342: Power of Four", "LC 476: Number Complement", "LC 693: Binary Number with Alternating Bits", "LC 868: Binary Gap", "LC 1009: Complement of Base 10 Integer", "LC 1486: XOR Operation in an Array", "LC 1720: Decode XORed Array"],
    "MEDIUM": ["LC 137: Single Number II", "LC 260: Single Number III", "LC 371: Sum of Integers", "LC 201: Bitwise AND of Numbers Range", "LC 393: UTF-8 Validation", "LC 421: Maximum XOR of Two Numbers in an Array", "LC 477: Total Hamming Distance", "LC 89: Gray Code", "LC 1290: Convert Binary Number in a Linked List to Integer", "LC 1310: XOR Queries of a Subarray", "LC 1442: Count Triplets That Can Form Two Arrays of Equal XOR", "LC 1461: Check If a String Contains All Binary Codes of Size K", "LC 1542: Find Longest Awesome Substring", "LC 1680: Concatenation of Consecutive Binary Numbers", "LC 1829: Maximum XOR Each Query", "LC 2429: Minimize XOR"],
    "HARD": ["LC 847: Shortest Path Visiting All Nodes", "LC 1879: Minimum XOR Sum of Two Arrays"]
  },
  "Dynamic Programming": {
    "EASY": ["LC 70: Climbing Stairs", "LC 746: Min Cost Climbing Stairs", "LC 198: House Robber", "LC 509: Fibonacci Number"],
    "MEDIUM": ["LC 213: House Robber II", "LC 322: Coin Change", "LC 518: Coin Change II", "LC 300: Longest Increasing Subsequence", "LC 673: Number of Longest Increasing Subsequence", "LC 1143: Longest Common Subsequence", "LC 583: Delete Operation for Two Strings", "LC 72: Edit Distance", "LC 221: Maximal Square", "LC 62: Unique Paths", "LC 63: Unique Paths II", "LC 64: Minimum Path Sum", "LC 120: Triangle", "LC 931: Minimum Falling Path Sum", "LC 416: Partition Equal Subset Sum", "LC 494: Target Sum", "LC 516: Longest Palindromic Subsequence", "LC 647: Palindromic Substrings", "LC 139: Word Break"],
    "HARD": ["LC 10: Regular Expression Matching", "LC 44: Wildcard Matching", "LC 115: Distinct Subsequences", "LC 312: Burst Balloons", "LC 123: Best Time to Buy and Sell Stock III", "LC 188: Best Time to Buy and Sell Stock IV", "LC 87: Scramble String"]
  }
};

function getQuestionsFor(topic, tierKey) {
  if (QUESTION_BANK[topic] && QUESTION_BANK[topic][tierKey]) {
    return QUESTION_BANK[topic][tierKey];
  }
  return [];
}

// Progress state in localStorage
const STORAGE_KEY = "dsa_practice_solved_v1";
let solvedMap = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
let activeTopic = "All"; // Default to All

const topicPillsBar = document.getElementById("topicPillsBar");
const practiceCardsContainer = document.getElementById("practiceCardsContainer");
const currentTopicLabel = document.getElementById("currentTopicLabel");
const currentPackCount = document.getElementById("currentPackCount");
const totalSolvedCountEl = document.getElementById("totalSolvedCount");
const totalQuestionsCountEl = document.getElementById("totalQuestionsCount");
const resetProgressBtn = document.getElementById("resetProgressBtn");

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(solvedMap));
  updateGlobalCounters();
}

function makeQuestionId(topic, tierKey, idx) {
  return topic + "__" + tierKey + "__" + idx;
}

function updateGlobalCounters() {
  let totalQ = 0;
  let totalSolved = 0;
  TOPICS.filter((t) => t !== "All").forEach((topic) => {
    TIER_TEMPLATE.forEach((tier) => {
      const qs = getQuestionsFor(topic, tier.key);
      totalQ += qs.length;
      qs.forEach((_, idx) => {
        if (solvedMap[makeQuestionId(topic, tier.key, idx)]) {
          totalSolved++;
        }
      });
    });
  });
  if (totalSolvedCountEl) totalSolvedCountEl.textContent = totalSolved;
  if (totalQuestionsCountEl) totalQuestionsCountEl.textContent = totalQ;
}

function renderTopicPills() {
  if (!topicPillsBar) return;
  topicPillsBar.innerHTML = "";
  TOPICS.forEach((topic) => {
    const btn = document.createElement("button");
    btn.className = "topic-pill" + (topic === activeTopic ? " active" : "");
    btn.textContent = topic;
    btn.addEventListener("click", () => {
      activeTopic = topic;
      renderTopicPills();
      renderCards();
    });
    topicPillsBar.appendChild(btn);
  });
}

function renderCards() {
  if (!practiceCardsContainer) return;
  practiceCardsContainer.innerHTML = "";

  if (activeTopic === "All") {
    // --- ALL VIEW: Grouped by Topic (1 Card per Topic with all its questions inside) ---
    const allTopics = TOPICS.filter((t) => t !== "All");
    if (currentTopicLabel) currentTopicLabel.textContent = "All Topics (539 Problems)";
    if (currentPackCount) currentPackCount.textContent = allTopics.length + " Topics · 539 Questions";

    allTopics.forEach((topic) => {
      let topicTotal = 0;
      let topicSolved = 0;
      TIER_TEMPLATE.forEach((tier) => {
        const qs = getQuestionsFor(topic, tier.key);
        topicTotal += qs.length;
        qs.forEach((_, idx) => {
          if (solvedMap[makeQuestionId(topic, tier.key, idx)]) topicSolved++;
        });
      });
      const topicPct = topicTotal > 0 ? Math.round((topicSolved / topicTotal) * 100) : 0;

      const cardWrap = document.createElement("div");
      cardWrap.className = "practice-pack-card topic-group-card";

      cardWrap.innerHTML = `
        <div class="pack-main-row">
          <div class="pack-left">
            <div class="pack-title-row">
              <span class="pack-topic-name" style="font-size: 19px;">${topic}</span>
              <span class="pack-badge badge-placement">Topic Pack</span>
            </div>
            <div class="pack-subtitle">Complete ${topic} Practice Sheet</div>
            <div class="pack-qcount">${topicTotal} Questions across Easy, Medium, Hard</div>
          </div>

          <div class="pack-right">
            <div class="pack-progress-box">
              <div class="pack-progress-label">
                Completion <span class="pack-dot" style="background:#0d9488"></span> <strong>${topicPct}%</strong>
              </div>
              <div class="pack-progress-track">
                <div class="pack-progress-fill" style="width:${topicPct}%; background:#0d9488"></div>
              </div>
            </div>
            <button class="btn-pack-solve">View All</button>
          </div>
        </div>

        <div class="pack-questions-drawer hidden">
          <div class="drawer-header">All problems in ${topic}:</div>
          <div class="drawer-list"></div>
        </div>
      `;

      const solveBtn = cardWrap.querySelector(".btn-pack-solve");
      const drawer = cardWrap.querySelector(".pack-questions-drawer");
      const drawerList = cardWrap.querySelector(".drawer-list");

      // Populate all questions of this topic grouped inside
      TIER_TEMPLATE.forEach((tier) => {
        const questions = getQuestionsFor(topic, tier.key);
        if (questions.length === 0) return;

        const tierHeader = document.createElement("div");
        tierHeader.className = "drawer-tier-heading";
        tierHeader.innerHTML = `<span class="pack-badge ${tier.badgeClass}">${tier.key}</span> ${tier.subtitle}`;
        drawerList.appendChild(tierHeader);

        questions.forEach((qText, idx) => {
          const qId = makeQuestionId(topic, tier.key, idx);
          const isDone = !!solvedMap[qId];

          const item = document.createElement("div");
          item.className = "drawer-q-item" + (isDone ? " done" : "");
          item.innerHTML = `
            <label class="q-check-label">
              <input type="checkbox" class="q-checkbox" ${isDone ? "checked" : ""}>
              <span class="q-text">${qText}</span>
            </label>
            <div class="q-actions">
              <button class="btn-q-action btn-visualize" title="Understand & Dry Run in Tutor">▶ Visualize</button>
              <button class="btn-q-action btn-code" title="Open in Compiler">&gt;_ Code</button>
            </div>
          `;

          const checkbox = item.querySelector(".q-checkbox");
          checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
              solvedMap[qId] = true;
            } else {
              delete solvedMap[qId];
            }
            saveProgress();
            renderCards();
          });

          item.querySelector(".btn-visualize").addEventListener("click", () => {
            localStorage.setItem("dsa_prefill_question", qText);
            window.location.href = "dashboard.html";
          });

          item.querySelector(".btn-code").addEventListener("click", () => {
            window.location.href = "compiler.html";
          });

          drawerList.appendChild(item);
        });
      });

      solveBtn.addEventListener("click", () => {
        const isHidden = drawer.classList.contains("hidden");
        drawer.classList.toggle("hidden", !isHidden);
        solveBtn.textContent = isHidden ? "Close" : "View All";
      });

      practiceCardsContainer.appendChild(cardWrap);
    });

  } else {
    // --- SPECIFIC TOPIC VIEW: Show the 5 Difficulty Tiers (Easy, Medium, Hard, Placement, Interview) ---
    if (currentTopicLabel) currentTopicLabel.textContent = `${activeTopic} Problems`;
    if (currentPackCount) currentPackCount.textContent = "5 Tiers · " + TIER_TEMPLATE.reduce((acc, t) => acc + getQuestionsFor(activeTopic, t.key).length, 0) + " Questions";

    TIER_TEMPLATE.forEach((tier) => {
      const questions = getQuestionsFor(activeTopic, tier.key);
      const total = questions.length;
      let solved = 0;
      questions.forEach((_, idx) => {
        if (solvedMap[makeQuestionId(activeTopic, tier.key, idx)]) solved++;
      });
      const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

      const cardWrap = document.createElement("div");
      cardWrap.className = "practice-pack-card";

      cardWrap.innerHTML = `
        <div class="pack-main-row">
          <div class="pack-left">
            <div class="pack-title-row">
              <span class="pack-topic-name">${activeTopic}</span>
              <span class="pack-badge ${tier.badgeClass}">${tier.key}</span>
            </div>
            <div class="pack-subtitle">${tier.subtitle}</div>
            <div class="pack-qcount">${total} Questions</div>
          </div>

          <div class="pack-right">
            <div class="pack-progress-box">
              <div class="pack-progress-label">
                Completion <span class="pack-dot" style="background:${tier.dotColor}"></span> <strong>${pct}%</strong>
              </div>
              <div class="pack-progress-track">
                <div class="pack-progress-fill" style="width:${pct}%; background:${tier.dotColor}"></div>
              </div>
            </div>
            <button class="btn-pack-solve">Solve</button>
          </div>
        </div>

        <div class="pack-questions-drawer hidden">
          <div class="drawer-header">Select a problem to visualize or code:</div>
          <div class="drawer-list"></div>
        </div>
      `;

      const solveBtn = cardWrap.querySelector(".btn-pack-solve");
      const drawer = cardWrap.querySelector(".pack-questions-drawer");
      const drawerList = cardWrap.querySelector(".drawer-list");

      questions.forEach((qText, idx) => {
        const qId = makeQuestionId(activeTopic, tier.key, idx);
        const isDone = !!solvedMap[qId];

        const item = document.createElement("div");
        item.className = "drawer-q-item" + (isDone ? " done" : "");
        item.innerHTML = `
          <label class="q-check-label">
            <input type="checkbox" class="q-checkbox" ${isDone ? "checked" : ""}>
            <span class="q-index">${idx + 1}.</span>
            <span class="q-text">${qText}</span>
          </label>
          <div class="q-actions">
            <button class="btn-q-action btn-visualize" title="Understand & Dry Run in Tutor">▶ Visualize</button>
            <button class="btn-q-action btn-code" title="Open in Compiler">&gt;_ Code</button>
          </div>
        `;

        const checkbox = item.querySelector(".q-checkbox");
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            solvedMap[qId] = true;
          } else {
            delete solvedMap[qId];
          }
          saveProgress();
          renderCards();
        });

        item.querySelector(".btn-visualize").addEventListener("click", () => {
          localStorage.setItem("dsa_prefill_question", qText);
          window.location.href = "dashboard.html";
        });

        item.querySelector(".btn-code").addEventListener("click", () => {
          window.location.href = "compiler.html";
        });

        drawerList.appendChild(item);
      });

      solveBtn.addEventListener("click", () => {
        const isHidden = drawer.classList.contains("hidden");
        drawer.classList.toggle("hidden", !isHidden);
        solveBtn.textContent = isHidden ? "Close" : "Solve";
      });

      practiceCardsContainer.appendChild(cardWrap);
    });
  }
}

if (resetProgressBtn) {
  resetProgressBtn.addEventListener("click", () => {
    if (confirm("Reset all solved progress?")) {
      solvedMap = {};
      saveProgress();
      renderCards();
    }
  });
}

// Initialize
updateGlobalCounters();
renderTopicPills();
renderCards();