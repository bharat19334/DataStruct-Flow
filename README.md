<div align="center">

# `>_ DataStruct.Flow`

### Understand the Algorithm. Visualize Every Step. Master DSA.

<p>
  An AI-powered, interactive Data Structures & Algorithms learning platform.
</p>

<p>
  <a href="https://datastruct-flow-frontend.vercel.app/">
    <img src="https://img.shields.io/badge/LIVE%20DEMO-Open%20Application-16A34A?style=for-the-badge&logo=vercel&logoColor=white">
  </a>
  <a href="https://datastruct-flow-backend.onrender.com/docs">
    <img src="https://img.shields.io/badge/API-FastAPI%20Docs-009688?style=for-the-badge&logo=fastapi&logoColor=white">
  </a>
</p>

<img src="https://img.shields.io/badge/Python-Backend-3776AB?style=flat-square&logo=python">
<img src="https://img.shields.io/badge/FastAPI-API-009688?style=flat-square&logo=fastapi">
<img src="https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?style=flat-square&logo=javascript">
<img src="https://img.shields.io/badge/Groq-AI%20Engine-F55036?style=flat-square">
<img src="https://img.shields.io/badge/Supabase-Database-3FCF8E?style=flat-square&logo=supabase">

</div>

---

## 🧠 About DataStruct.Flow

**DataStruct.Flow** is an AI-powered DSA learning platform designed to help students understand algorithms through interactive explanations, solution comparisons, and step-by-step visualizations.

Instead of simply showing the final answer, DataStruct.Flow focuses on helping learners understand the complete problem-solving process.

### 🎯 Learning Workflow

| Stage | Description |
|---|---|
| 🧠 Understand | AI-generated explanations of DSA problems |
| ⚖️ Compare | Explore brute-force and optimized approaches |
| 🎬 Visualize | Watch algorithms execute step by step |
| 📚 Practice | Solve curated DSA questions |
| 💻 Execute | Write and run code in multiple languages |
| 📊 Analyze | Track learning progress and coding activity |

---

## 🚀 Key Features

### 1. 🧠 AI-Powered DSA Tutor

- Generate explanations for DSA problems.
- Understand complex algorithmic concepts.
- AI-powered responses using Groq API.
- Learner-friendly problem breakdown.
- Response caching for repeated requests.

### 2. ⚖️ Brute Force vs Optimal Approach

- Generate multiple solution approaches.
- Compare brute-force and optimized solutions.
- Analyze time complexity.
- Analyze space complexity.
- Identify the recommended approach.
- Move directly to the selected approach's dry run.

### 3. 🎬 Interactive Algorithm Visualizer

- Step-by-step algorithm execution.
- Visualize array operations and pointer movements.
- Tree and graph execution traces.
- Previous and Next navigation.
- Automatic playback.
- Adjustable visualization speed.
- English and Hinglish narration support.

### 4. 🌐 Multilingual AI Explanation

- English explanations.
- Hindi explanations.
- Hinglish explanations.
- AI-powered translation.
- ElevenLabs text-to-speech integration.
- Browser Speech Synthesis fallback.

### 5. 📚 DSA Practice Sheet

A curated collection of **539 DSA questions**, organized by topics and difficulty levels.

| Topics | Coverage |
|---|---|
| Arrays & Strings | Fundamental problem-solving |
| Two Pointers | Efficient traversal techniques |
| Sliding Window | Subarray and substring problems |
| Hashing | HashMap and frequency counting |
| Stack & Queue | Linear data structures |
| Binary Search | Search and optimization |
| Linked List | Pointer-based structures |
| Trees & BST | Tree traversal and operations |
| Heap | Priority queue problems |
| Graph | BFS, DFS and graph algorithms |
| Greedy | Greedy strategies |
| Backtracking | Recursive exploration |
| Trie | Prefix-based searching |
| Bit Manipulation | Bitwise operations |
| Dynamic Programming | Optimization using DP |

**Difficulty Levels:**
- Easy
- Medium
- Hard
- Placement
- Interview

### 6. 📊 Progress Dashboard

- Track solved questions.
- Monitor difficulty-wise progress.
- GitHub-style activity heatmap.
- Daily activity tracking.
- Streak and milestone indicators.

### 7. 💻 Multi-Language Code Compiler

Write and execute code directly inside the platform.

| Language | Execution Engine |
|---|---|
| Python | Backend Python Runtime |
| C++ | Piston API |
| Java | Piston API |
| JavaScript | Piston API |

**Compiler Features:**
- CodeMirror 5 editor.
- Syntax highlighting.
- Line numbers.
- Custom standard input.
- Execution output.
- Error handling.
- Practice-question compiler integration.

### 8. 🗂️ Activity History

- Save learning activities.
- Store history in browser Local Storage.
- Supabase history synchronization.
- Review previous coding activities.

### 9. 🎨 Theme Customization

- Light theme.
- Dark theme.
- Persistent theme preferences.
- Responsive user interface.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    User((Learner))

    subgraph Frontend["Frontend Layer"]
        UI["HTML / CSS / JavaScript"]
        Tutor["AI Tutor"]
        Visualizer["Algorithm Visualizer"]
        Practice["DSA Practice"]
        Compiler["Code Compiler"]
        Storage[("Local Storage")]
    end

    subgraph Backend["FastAPI Backend"]
        API["REST API"]
        Cache["Response Cache"]
        History["History Service"]
        Execution["Code Execution Router"]
    end

    Groq["Groq AI API"]
    ElevenLabs["ElevenLabs API"]
    Piston["Piston API"]
    Python["Python Runtime"]
    Supabase[("Supabase")]

    User --> UI
    UI --> Tutor
    UI --> Visualizer
    UI --> Practice
    UI --> Compiler

    Tutor --> API
    Visualizer --> API
    Compiler --> API

    API --> Cache
    API --> Groq
    API --> ElevenLabs
    API --> Execution

    Execution --> Python
    Execution --> Piston

    API --> History
    History --> Supabase

    UI <--> Storage
