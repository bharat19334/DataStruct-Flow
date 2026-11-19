<div align="center">

<img src="https://img.shields.io/badge/AI--POWERED-DSA%20LEARNING%20PLATFORM-10B981?style=for-the-badge" alt="AI-powered DSA learning platform">

# ⚡ DataStruct.Flow

### Understand the logic. See the execution. Master the algorithm.

<p>
  An interactive Data Structures & Algorithms learning workspace that brings
  AI explanations, solution analysis, algorithm visualization, coding practice,
  and multi-language execution together in one place.
</p>

<p>
  <a href="https://datastruct-flow-frontend.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Application-Open%20DataStruct.Flow-16A34A?style=for-the-badge&logo=vercel&logoColor=white" alt="Open live application">
  </a>
  <a href="https://datastruct-flow-backend.onrender.com/docs">
    <img src="https://img.shields.io/badge/API%20Documentation-FastAPI%20Swagger-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="Open API documentation">
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/Python-Backend-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-REST%20API-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Groq-AI%20Inference-F55036?style=flat-square" alt="Groq">
  <img src="https://img.shields.io/badge/Supabase-Cloud%20History-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/CodeMirror-Code%20Editor-D30707?style=flat-square" alt="CodeMirror">
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel%20%7C%20Render-111111?style=flat-square" alt="Deployment">
</p>

<br>

**Learn → Compare → Visualize → Practice → Execute → Improve**

</div>

---

## 📑 Contents

- [Overview](#-overview)
- [Live Application](#-live-application)
- [Why DataStruct.Flow?](#-why-datastructflow)
- [Product Features](#-product-features)
- [DSA Learning Coverage](#-dsa-learning-coverage)
- [Application Walkthrough](#-application-walkthrough)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Backend API](#-backend-api-reference)
- [Project Structure](#-project-structure)
- [Run Locally](#-run-locally)
- [Security Notes](#-security-deployment-notes)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🎯 Overview

Learning Data Structures and Algorithms is not only about finding the correct output. It is about understanding **why an approach works, how its state changes, and what makes one solution more efficient than another**.

**DataStruct.Flow** is built around that learning process.

A learner can submit a DSA problem, explore an AI-generated explanation, compare different solution strategies, and inspect an interactive dry run. The same workspace also provides a curated practice collection, progress views, activity history, and a code execution environment.

The platform aims to make algorithmic thinking more understandable by connecting explanation with execution.

## 🌐 Live Application

| Component | Link |
|---|---|
| Frontend | [Open DataStruct.Flow](https://datastruct-flow-frontend.vercel.app/) |
| Backend API | [Open API](https://datastruct-flow-backend.onrender.com/) |
| Interactive API docs | [FastAPI Swagger UI](https://datastruct-flow-backend.onrender.com/docs) |

> **Deployment note:** The backend is hosted on Render. If the service has been idle, its first request may take longer while the instance starts.

---

## 💡 Why DataStruct.Flow?

Traditional problem-solving often separates the explanation, code, and execution trace. DataStruct.Flow brings these learning steps into one workflow.

<table>
  <tr>
    <td width="33%" align="center">
      <h2>🧠</h2>
      <b>Understand</b>
      <p>Break down a problem with an AI-generated explanation.</p>
    </td>
    <td width="33%" align="center">
      <h2>⚖️</h2>
      <b>Compare</b>
      <p>Explore brute-force and optimized strategies with complexity analysis.</p>
    </td>
    <td width="33%" align="center">
      <h2>🎬</h2>
      <b>Visualize</b>
      <p>Follow the algorithm through a step-by-step execution trace.</p>
    </td>
  </tr>
  <tr>
    <td width="33%" align="center">
      <h2>📚</h2>
      <b>Practice</b>
      <p>Work through curated questions across DSA topics and difficulty tiers.</p>
    </td>
    <td width="33%" align="center">
      <h2>💻</h2>
      <b>Execute</b>
      <p>Write and run code in four supported programming languages.</p>
    </td>
    <td width="33%" align="center">
      <h2>📈</h2>
      <b>Review</b>
      <p>Revisit activity and monitor practice progress.</p>
    </td>
  </tr>
</table>

---

## 🚀 Product Features

### 01 · AI DSA Tutor

**Turn a problem statement into a structured learning explanation.**

- Submit a DSA problem or concept in natural language.
- Generate learner-friendly explanations using the Groq API.
- Focus on understanding the problem and its underlying logic.
- Reuse cached responses where available.
- Display a personalized greeting when a learner name is available.

### 02 · Solution Approach Analyzer

**Understand the trade-offs before choosing an algorithm.**

- Generate alternative strategies for a problem.
- Explore brute-force and optimized approaches.
- Compare time complexity and space complexity.
- Review the reasoning behind each approach.
- Select an approach and continue to its dry run.

### 03 · Interactive Algorithm Visualizer

**Make the algorithm's execution visible.**

- Generate structured execution traces for a selected approach.
- Inspect array states, indices, pointers, and operation descriptions.
- Render tree- and graph-oriented traces using nodes, edges, and visit states.
- Navigate with Previous and Next controls.
- Use automatic playback and adjust its speed.
- Follow optional narration in English or Hinglish.

### 04 · Multilingual Explanations & Voice

**Learn in a language that is comfortable to follow.**

- English, Hindi, and Hinglish explanation options.
- AI-powered translation through the backend.
- ElevenLabs text-to-speech integration when configured.
- Browser Speech Synthesis fallback when remote TTS is unavailable.

### 05 · Curated DSA Practice

**Build consistency through structured problem practice.**

The practice dataset is labelled in the source as a **539-question curated sheet**.

- Questions organized by DSA topic.
- Easy, Medium, and Hard difficulty levels.
- Placement and Interview practice tiers.
- Topic-based navigation for focused preparation.

### 06 · Multi-Language Code Workspace

**Write, execute, and inspect code without leaving the platform.**

| Language | Execution path |
|---|---|
| Python | Backend Python subprocess |
| C++ | Piston API |
| Java | Piston API |
| JavaScript | Piston API |

Additional editor capabilities:

- CodeMirror 5 editor.
- Syntax modes and line numbers.
- Optional standard input.
- Execution output, errors, and exit-status feedback.
- Compiler workspace connected to selected practice questions.
- Successful runs can be recorded in activity history.

### 07 · Progress Dashboard

**Turn practice activity into a visible learning record.**

- Solved-question progress.
- Difficulty-wise progress views.
- GitHub-style activity heatmap.
- Streak and milestone indicators.
- Progress calculated from available browser-side activity records.

### 08 · Activity History & Themes

**Keep learning activity accessible and the workspace comfortable.**

- Browser-side history stored in Local Storage.
- Supported history synchronization through the backend and Supabase REST API.
- Local and cloud history entries combined when history is loaded.
- Light theme with a warm cream and forest-green palette.
- Dark theme with charcoal and emerald accents.
- Theme preference saved in Local Storage.

---

## 📚 DSA Learning Coverage

The practice collection groups questions across the following areas:

| Area | Topics and concepts |
|---|---|
| Fundamentals | Arrays, Strings |
| Pointer Patterns | Two Pointers, Sliding Window |
| Lookup & Frequency | Hashing |
| Linear Structures | Stack, Queue, Linked List |
| Searching | Binary Search |
| Hierarchical Structures | Trees, Binary Search Tree |
| Priority Structures | Heap / Priority Queue |
| Networks | Graphs |
| Problem-Solving Paradigms | Greedy, Backtracking |
| Specialized Structures | Trie |
| Low-Level Operations | Bit Manipulation |
| Optimization | Dynamic Programming |

**Practice tiers:** Easy · Medium · Hard · Placement · Interview

---

## 🖥️ Application Walkthrough

The following workflow shows how the main learning modules fit together.

```mermaid
flowchart TD
    A["Open DataStruct.Flow"] --> B["Submit a DSA Problem"]

    B --> C["AI Explanation"]
    B --> D["Approach Comparison"]

    C --> E["Understand the Problem"]
    D --> F["Choose an Approach"]

    F --> G["Generate Dry Run"]
    G --> H["Interactive Visualization"]
    H --> I["Optional Voice Narration"]

    J["Open Practice Sheet"] --> K["Select a Question"]
    K --> L["Open Compiler"]
    L --> M["Write and Execute Code"]
    M --> N["Inspect Output and Errors"]

    I --> O["Learning Activity"]
    N --> O
    O --> P["Progress and History"]