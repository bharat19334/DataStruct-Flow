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

<!-- ================= TECHNOLOGY STACK ================= -->

<h2>🛠️ Technology Stack</h2>

<table>
  <thead>
    <tr>
      <th>Category</th>
      <th>Technologies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Frontend</b></td>
      <td>HTML5, CSS3, JavaScript</td>
    </tr>
    <tr>
      <td><b>Code Editor</b></td>
      <td>CodeMirror 5</td>
    </tr>
    <tr>
      <td><b>Backend</b></td>
      <td>Python, FastAPI, Uvicorn</td>
    </tr>
    <tr>
      <td><b>AI Engine</b></td>
      <td>Groq API</td>
    </tr>
    <tr>
      <td><b>Voice Generation</b></td>
      <td>ElevenLabs API</td>
    </tr>
    <tr>
      <td><b>Voice Fallback</b></td>
      <td>Web Speech API</td>
    </tr>
    <tr>
      <td><b>Database</b></td>
      <td>SQLite</td>
    </tr>
    <tr>
      <td><b>Cloud Storage</b></td>
      <td>Supabase REST API</td>
    </tr>
    <tr>
      <td><b>Authentication Utilities</b></td>
      <td>bcrypt, JWT</td>
    </tr>
    <tr>
      <td><b>Code Execution</b></td>
      <td>Python Runtime, Piston API</td>
    </tr>
    <tr>
      <td><b>Deployment</b></td>
      <td>Vercel, Render</td>
    </tr>
  </tbody>
</table>


<!-- ================= BACKEND API ================= -->

<h2>📡 Backend API Endpoints</h2>

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>GET</code></td>
      <td><code>/</code></td>
      <td>Backend health check</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/explain</code></td>
      <td>Generate DSA explanation</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/approaches</code></td>
      <td>Generate solution approaches</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/analyze</code></td>
      <td>Analyze DSA problem</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/dry-run</code></td>
      <td>Generate visualization steps</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/translate</code></td>
      <td>Translate explanation</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/tts</code></td>
      <td>Generate voice narration</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/run-code</code></td>
      <td>Execute source code</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/history</code></td>
      <td>Save activity history</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/api/history</code></td>
      <td>Retrieve activity history</td>
    </tr>
    <tr>
      <td><code>DELETE</code></td>
      <td><code>/api/history</code></td>
      <td>Clear activity history</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/auth/signup</code></td>
      <td>Signup endpoint</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/auth/login</code></td>
      <td>Login endpoint</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/telemetry/visit</code></td>
      <td>Track device visits</td>
    </tr>
  </tbody>
</table>

<p align="center">
  <a href="https://datastruct-flow-backend.onrender.com/docs">
    <img src="https://img.shields.io/badge/API%20Documentation-FastAPI%20Swagger-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="API Documentation">
  </a>
</p>


<!-- ================= PROJECT STRUCTURE ================= -->

<h2>📁 Project Structure</h2>

<pre>
DataStruct.Flow/
│
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── practice.html
│   ├── progress.html
│   ├── history.html
│   ├── compiler.html
│   │
│   ├── script.js
│   ├── practice.js
│   ├── progress.js
│   ├── compiler.js
│   ├── history-store.js
│   ├── auth.js
│   ├── name.js
│   ├── theme.js
│   │
│   ├── style.css
│   ├── auth.css
│   └── stub.js
│
└── README.md
</pre>


<!-- ================= INSTALLATION ================= -->

<h2>⚙️ Installation &amp; Setup</h2>

<h3>Prerequisites</h3>

<ul>
  <li>Python 3.10+</li>
  <li>pip</li>
  <li>Git</li>
  <li>Modern Web Browser</li>
  <li>Required API credentials</li>
</ul>

<h3>1. Clone Repository</h3>

<pre><code>git clone https://github.com/&lt;your-username&gt;/&lt;your-repository&gt;.git

cd &lt;your-repository&gt;</code></pre>

<h3>2. Backend Setup</h3>

<pre><code>cd backend

python -m venv venv</code></pre>

<p><b>Activate virtual environment:</b></p>

<p><b>Windows</b></p>

<pre><code>venv\Scripts\activate</code></pre>

<p><b>Linux / macOS</b></p>

<pre><code>source venv/bin/activate</code></pre>

<p><b>Install dependencies:</b></p>

<pre><code>pip install -r requirements.txt</code></pre>

<h3>3. Environment Configuration</h3>

<p>Create a <code>.env</code> file inside the backend directory.</p>

<pre><code>GROQ_API_KEY=your_groq_api_key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key

ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id

JWT_SECRET=your_secret_key</code></pre>

<h3>4. Run Backend</h3>

<pre><code>uvicorn main:app --reload --host 0.0.0.0 --port 8000</code></pre>

<p><b>Backend URL:</b></p>

<pre><code>http://localhost:8000</code></pre>

<p><b>API Documentation:</b></p>

<pre><code>http://localhost:8000/docs</code></pre>

<h3>5. Run Frontend</h3>

<pre><code>cd frontend

python -m http.server 5500</code></pre>

<p><b>Open in browser:</b></p>

<pre><code>http://localhost:5500</code></pre>


<!-- ================= SECURITY ================= -->

<h2>🔐 Security Considerations</h2>

<ul>
  <li>Never commit <code>.env</code> files or API credentials.</li>
  <li>Rotate exposed API keys immediately.</li>
  <li>Restrict CORS to trusted frontend origins before production.</li>
  <li>Arbitrary code execution requires secure sandboxing and resource limits.</li>
  <li>Configure Supabase credentials and database tables correctly.</li>
  <li>Authentication endpoints exist in the backend, but the reviewed frontend currently bypasses the login flow.</li>
</ul>


<!-- ================= ROADMAP ================= -->

<h2>🗺️ Future Improvements</h2>

<ul>
  <li>Fully integrated authentication.</li>
  <li>User-specific progress synchronization.</li>
  <li>Secure code execution sandbox.</li>
  <li>More algorithm visualization modules.</li>
  <li>Automated backend and frontend testing.</li>
  <li>API rate limiting.</li>
  <li>Persistent caching.</li>
  <li>Export and import learning progress.</li>
  <li>Advanced learning analytics.</li>
</ul>


<!-- ================= CONTRIBUTING ================= -->

<h2>🤝 Contributing</h2>

<p>Contributions, bug reports, and feature suggestions are welcome.</p>

<ol>
  <li>Fork the repository.</li>
  <li>Create a feature branch.</li>
  <li>Make your changes.</li>
  <li>Test the application.</li>
  <li>Submit a pull request.</li>
</ol>

<pre><code>git checkout -b feature/your-feature

git add .

git commit -m "Add: your feature"

git push origin feature/your-feature</code></pre>


<!-- ================= AUTHOR ================= -->

<h2>👨‍💻 Author</h2>

<div align="center">

  <h3>Bharat Goswami</h3>

  <p>
    B.Tech · Computer Science &amp; Engineering<br>
    Specialization in Artificial Intelligence &amp; Machine Learning
  </p>

  <p>
    <a href="https://github.com/bharat19334">
      <img src="https://img.shields.io/badge/GitHub-bharat19334-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
    </a>

    <a href="https://www.linkedin.com/in/bharatgoswami19/">
      <img src="https://img.shields.io/badge/LinkedIn-Bharat%20Goswami-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
    </a>
  </p>

  <br>

  <h3>⚡ DataStruct.Flow</h3>

  <p><b>Understand. Visualize. Master.</b></p>

  <p>
    <i>Making Data Structures &amp; Algorithms easier to understand, one step at a time.</i>
  </p>

</div>

---
