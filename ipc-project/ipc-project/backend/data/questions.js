// data.js
// Sample question banks for Interview Preparation Core.
// Replace/expand these arrays with your own content, or fetch them
// from the backend's /api/questions endpoints (see backend/routes).

const APTITUDE_QUESTIONS = {
  quant: [
    {
      q: "A train 150m long crosses a platform 250m long in 20 seconds. What is the speed of the train in km/h?",
      options: ["54 km/h", "63 km/h", "72 km/h", "80 km/h"],
      answer: 2,
      explain: "Total distance = 150+250 = 400m in 20s = 20 m/s = 20 × 3.6 = 72 km/h."
    },
    {
      q: "If the cost price of 12 items equals the selling price of 10 items, what is the profit percentage?",
      options: ["10%", "16.67%", "20%", "25%"],
      answer: 2,
      explain: "Let CP of 1 item = 1. CP of 12 = 12, SP of 10 = 12 → SP of 1 = 1.2 → profit = 20%."
    },
    {
      q: "What is the compound interest on ₹10,000 at 10% per annum for 2 years, compounded annually?",
      options: ["₹2,000", "₹2,100", "₹2,200", "₹2,500"],
      answer: 1,
      explain: "A = 10000(1.1)^2 = 12100. CI = 12100 - 10000 = ₹2,100."
    },
    {
      q: "A can do a piece of work in 12 days, B in 16 days. Working together, how many days will they take?",
      options: ["6.86 days", "7.5 days", "6.0 days", "8.0 days"],
      answer: 0,
      explain: "Combined rate = 1/12 + 1/16 = 7/48 per day → time = 48/7 ≈ 6.86 days."
    }
  ],
  logical: [
    {
      q: "Look at this series: 2, 6, 18, 54, ... What number should come next?",
      options: ["108", "148", "162", "216"],
      answer: 2,
      explain: "Each term is multiplied by 3: 54 × 3 = 162."
    },
    {
      q: "If 'CODING' is written as 'DPEJOH', how is 'PYTHON' written in the same code?",
      options: ["QZUIPO", "QZUIPP", "OZUIPO", "QZUJPO"],
      answer: 0,
      explain: "Each letter is shifted forward by 1: P→Q, Y→Z, T→U, H→I, O→P, N→O = QZUIPO."
    },
    {
      q: "Pointing to a photograph, a man said, 'I have no brother or sister, but that man's father is my father's son.' Who is in the photograph?",
      options: ["His son", "His father", "Himself", "His nephew"],
      answer: 0,
      explain: "'My father's son' (with no siblings) is the man himself, so the photo is of his son."
    },
    {
      q: "Statements: All pens are pencils. Some pencils are erasers. Conclusion: Some pens are erasers.",
      options: ["Conclusion follows", "Conclusion does not follow", "Cannot be determined", "Both true and false"],
      answer: 1,
      explain: "The middle term 'pencils' is not distributed in both premises in a way that guarantees the conclusion — it does not necessarily follow."
    }
  ],
  verbal: [
    {
      q: "Choose the word most nearly OPPOSITE in meaning to 'METICULOUS'.",
      options: ["Careless", "Careful", "Precise", "Thorough"],
      answer: 0,
      explain: "Meticulous means very careful and precise; its opposite is careless."
    },
    {
      q: "Fill in the blank: Despite the heavy rain, the team decided to ____ the match.",
      options: ["preceed", "proceed", "procede", "preced"],
      answer: 1,
      explain: "'Proceed' is the correctly spelled word meaning to continue with an action."
    },
    {
      q: "Identify the correctly punctuated sentence.",
      options: [
        "Its a great opportunity, isn't it.",
        "It's a great opportunity, isn't it?",
        "Its' a great opportunity isnt it?",
        "It's a great opportunity isn't it"
      ],
      answer: 1,
      explain: "'It's' (contraction of 'it is') and a question mark for the tag question are both required."
    }
  ],
  technical: [
    {
      q: "What is the time complexity of binary search on a sorted array of n elements?",
      options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
      answer: 2,
      explain: "Binary search halves the search space each step, giving O(log n)."
    },
    {
      q: "Which data structure uses LIFO (Last In, First Out) ordering?",
      options: ["Queue", "Stack", "Linked List", "Tree"],
      answer: 1,
      explain: "A stack pushes and pops from the same end, following LIFO order."
    },
    {
      q: "In SQL, which clause is used to filter groups created by GROUP BY?",
      options: ["WHERE", "HAVING", "FILTER", "ORDER BY"],
      answer: 1,
      explain: "HAVING filters aggregated groups, whereas WHERE filters rows before grouping."
    },
    {
      q: "What does the 'this' keyword refer to inside a regular (non-arrow) JavaScript object method?",
      options: [
        "The global object always",
        "The object the method is called on",
        "The function itself",
        "Undefined always"
      ],
      answer: 1,
      explain: "In a regular method call, 'this' is bound to the object the method was invoked on."
    }
  ]
};

const COMPANY_DATA = {
  tcs: {
    name: "TCS",
    ticker: "TCS NQT / Ninja & Digital",
    pattern: "TCS NQT has 4 sections: Foundation (Numerical, Verbal, Reasoning), Advanced (Coding, Email Writing for senior roles), Specialist (role-specific MCQs). Coding round usually has 2 problems on arrays, strings or basic DP.",
    rounds: ["Foundation Section", "Advanced Section", "Coding Test", "Technical Interview", "HR Interview"],
    pyqs: [
      { year: "2024", topic: "Coding", q: "Given an array, find the maximum sum of a contiguous subarray (Kadane's Algorithm)." },
      { year: "2023", topic: "Quant", q: "Two pipes can fill a tank in 12 and 18 minutes respectively. If both are opened together, find the time to fill the tank." },
      { year: "2022", topic: "HR", q: "Why do you want to join TCS? Walk me through your final-year project." },
      { year: "2021", topic: "Reasoning", q: "A series-completion question based on alternating arithmetic and geometric progressions." }
    ]
  },
  cts: {
    name: "Cognizant (CTS)",
    ticker: "GenC / GenC Pro",
    pattern: "Cognizant GenC has an AMCAT-based aptitude round (Quant, Logical, Verbal, Automata coding), followed by Technical + HR interviews, often combined into one panel.",
    rounds: ["AMCAT Aptitude", "Automata Coding Round", "Technical + HR (combined)"],
    pyqs: [
      { year: "2024", topic: "Coding", q: "Write a program to check if a given string is a palindrome, ignoring spaces and case." },
      { year: "2023", topic: "Quant", q: "A shopkeeper marks an item 40% above cost price and gives a 10% discount. Find the profit %." },
      { year: "2022", topic: "Technical", q: "Explain the difference between == and .equals() in Java." },
      { year: "2021", topic: "HR", q: "Are you comfortable with relocation and rotational shifts?" }
    ]
  },
  infosys: {
    name: "Infosys",
    ticker: "InfyTQ / SP & Digital Specialist",
    pattern: "Infosys uses the InfyTQ platform for many hires: MCQs on Quant, Logical Reasoning, Verbal, Pseudocode and Programming, followed by a coding test and HR/technical interview.",
    rounds: ["InfyTQ Online Assessment", "Coding Round", "Technical Interview", "HR Interview"],
    pyqs: [
      { year: "2024", topic: "Pseudocode", q: "Trace through a pseudocode snippet involving nested loops and determine the final output." },
      { year: "2023", topic: "Coding", q: "Implement a function to reverse a linked list iteratively." },
      { year: "2022", topic: "Verbal", q: "Reading comprehension passage on renewable energy followed by 4 inference-based questions." },
      { year: "2021", topic: "HR", q: "Describe a time you worked in a team and faced a conflict. How did you resolve it?" }
    ]
  },
  wipro: {
    name: "Wipro",
    ticker: "WILP / Elite NLTH",
    pattern: "Wipro NLTH (National Level Talent Hunt) includes Aptitude, Verbal Ability, Written Communication Test (essay), and an online coding round, followed by Technical + HR rounds.",
    rounds: ["Aptitude & Verbal", "Written Communication (Essay)", "Coding Round", "Technical + HR"],
    pyqs: [
      { year: "2024", topic: "Essay", q: "Write a 200-word essay on 'The impact of automation on employment'." },
      { year: "2023", topic: "Coding", q: "Find the first non-repeating character in a string." },
      { year: "2022", topic: "Quant", q: "If a sum of money doubles itself in 8 years at simple interest, find the rate of interest." },
      { year: "2021", topic: "Technical", q: "What is normalization in databases? Explain 1NF, 2NF and 3NF with examples." }
    ]
  },
  accenture: {
    name: "Accenture",
    ticker: "ASE / Digital Graduate",
    pattern: "Accenture's online test covers Cognitive (Verbal, Logical, Numerical), Technical MCQs, and Coding, followed by a Communication Assessment (voice/video) and HR/Technical interviews.",
    rounds: ["Cognitive Assessment", "Technical Assessment", "Coding Round", "Communication Round", "HR Interview"],
    pyqs: [
      { year: "2024", topic: "Coding", q: "Given two strings, check whether one is an anagram of the other." },
      { year: "2023", topic: "Logical", q: "Seating arrangement puzzle: 6 people around a circular table with given conditions." },
      { year: "2022", topic: "Technical", q: "What is the difference between a process and a thread?" },
      { year: "2021", topic: "HR", q: "Tell me about yourself and why Accenture should hire you." }
    ]
  },
  amazon: {
    name: "Amazon",
    ticker: "SDE I / Support Engineer",
    pattern: "Amazon's process starts with an Online Assessment (2 DSA problems + work simulation/behavioral questions based on Leadership Principles), followed by 4-5 interview rounds covering DSA, system design (for senior roles), and Leadership Principles (bar raiser round).",
    rounds: ["Online Assessment (DSA + Work Sample)", "Phone/Video Screen", "Onsite Loop (DSA, LPs)", "Bar Raiser Round"],
    pyqs: [
      { year: "2024", topic: "DSA", q: "Given a binary tree, return the level order traversal of its nodes' values." },
      { year: "2023", topic: "DSA", q: "Find the K most frequent elements in an array." },
      { year: "2022", topic: "Leadership Principles", q: "Tell me about a time you disagreed with your manager. What did you do? (Have Backbone; Disagree and Commit)" },
      { year: "2021", topic: "DSA", q: "Detect a cycle in a directed graph." }
    ]
  },
  google: {
    name: "Google",
    ticker: "SWE / APM",
    pattern: "Google's process includes an online coding assessment (for some roles), followed by 4-5 interviews: 2-3 focused on coding/algorithms (data structures, problem-solving), 1 on Googleyness/Leadership, and sometimes system design for experienced candidates.",
    rounds: ["Online Coding Assessment", "Phone Interview (DSA)", "Onsite Loop (DSA × 2-3)", "Googleyness & Leadership"],
    pyqs: [
      { year: "2024", topic: "DSA", q: "Given a string, find the length of the longest substring without repeating characters." },
      { year: "2023", topic: "DSA", q: "Merge k sorted linked lists and return it as one sorted list." },
      { year: "2022", topic: "Behavioral", q: "Describe a project where you had to make a trade-off between speed and quality. (Googleyness)" },
      { year: "2021", topic: "DSA", q: "Implement an LRU (Least Recently Used) cache with O(1) get and put operations." }
    ]
  },
  microsoft: {
    name: "Microsoft",
    ticker: "SDE / PM",
    pattern: "Microsoft's process generally includes an online assessment (coding + aptitude for campus hires), followed by 2-4 technical interviews on DSA and problem-solving, and an 'As Appropriate' (AA) round focused on culture fit and motivation.",
    rounds: ["Online Assessment", "Technical Interviews (DSA)", "As Appropriate (AA) Round"],
    pyqs: [
      { year: "2024", topic: "DSA", q: "Given two strings, check if one string is a rotation of the other." },
      { year: "2023", topic: "DSA", q: "Find the lowest common ancestor (LCA) of two nodes in a binary search tree." },
      { year: "2022", topic: "Aptitude", q: "A clock shows 3:15. What is the angle between the hour and minute hands?" },
      { year: "2021", topic: "AA Round", q: "Why do you want to work at Microsoft, and what excites you about this team?" }
    ]
  }
};

module.exports = { APTITUDE_QUESTIONS, COMPANY_DATA };
