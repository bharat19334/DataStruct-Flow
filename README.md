::: {align="center"}
# `>_ DataStruct.Flow`

### Understand the algorithm. Visualize every step. Master problem-solving.

**An AI-powered, interactive Data Structures & Algorithms learning
environment** that transforms problem statements into structured
explanations, solution strategies, executable dry runs, and hands-on
coding practice.

```{=html}
<p>
```
`<a href="https://datastruct-flow-frontend.vercel.app/">`{=html}`<img src="https://img.shields.io/badge/LIVE%20APPLICATION-Open%20DataStruct.Flow-16A34A?style=for-the-badge&logo=vercel&logoColor=white" alt="Live application">`{=html}`</a>`{=html}
`<a href="https://datastruct-flow-backend.onrender.com/docs">`{=html}`<img src="https://img.shields.io/badge/API-Swagger%20Docs-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="API documentation">`{=html}`</a>`{=html}
`<a href="https://github.com/bharat19334">`{=html}`<img src="https://img.shields.io/badge/GitHub-Bharat%20Goswami-181717?style=for-the-badge&logo=github" alt="GitHub">`{=html}`</a>`{=html}
```{=html}
</p>
```
![Python](https://img.shields.io/badge/Python-Backend-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-API%20Framework-009688?style=flat-square&logo=fastapi&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-Frontend-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=flat-square&logo=css3&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-AI%20Inference-F55036?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Cloud%20History-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Frontend%20Hosting-000000?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend%20Hosting-46E3B7?style=flat-square&logo=render&logoColor=black)
:::

------------------------------------------------------------------------

## 🧭 Project Overview

Learning Data Structures and Algorithms is not just about reaching the
correct output. It is about understanding **why a solution works, how
its state changes, and what makes one approach more efficient than
another**.

DataStruct.Flow brings these learning steps into one workspace. A
learner can submit a DSA problem, explore an AI-generated explanation,
compare brute-force and optimized strategies, and follow an interactive
dry run. The platform also includes a curated practice sheet, progress
analytics, activity history, and a multi-language code execution
workspace.

### The learning loop

  -----------------------------------------------------------------------
                     Stage                     What happens
  -------------------------------------------- --------------------------
              **01 · Understand**              Get a structured
                                               explanation of the problem
                                               and its core logic.

                **02 · Compare**               Explore alternative
                                               approaches with time and
                                               space complexity.

               **03 · Visualize**              Follow the algorithm
                                               through a step-by-step
                                               execution trace.

               **04 · Practice**               Work through curated
                                               questions organized by
                                               topic and difficulty.

                **05 · Execute**               Write and run code in the
                                               integrated compiler.

                **06 · Review**                Revisit activity and
                                               monitor progress through
                                               the dashboard.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## ✨ Platform Capabilities

### 1. 🧠 AI DSA Tutor

Turn a problem statement into an understandable learning explanation.

-   Submit a DSA problem or concept in natural language.
-   Generate learner-friendly explanations using the Groq API.
-   Break down the problem logic instead of presenting only a final
    answer.
-   Reuse cached responses where available to reduce repeated generation
    work.
-   Include a learner greeting when a name is available in the frontend.

### 2. ⚖️ Solution Strategy Comparison

Explore how different approaches solve the same problem.

-   Generate multiple solution strategies, including brute-force and
    optimized approaches.
-   Review the reasoning behind each strategy.
-   Compare time and space complexity.
-   Identify the recommended approach.
-   Move from a selected approach directly into its dry-run
    visualization.

### 3. 🎬 Interactive Algorithm Dry Run

Make algorithm execution visible instead of imagining it.

-   Generate structured execution traces for the selected approach.
-   Inspect array states, indices, pointers, and operation descriptions.
-   Render tree- and graph-oriented traces using node, edge, visit, and
    current-node information.
-   Navigate execution using **Previous** and **Next** controls.
-   Play the trace automatically and adjust playback speed.
-   Follow optional narration in English or Hinglish.

### 4. 🌐 Multilingual Learning & Voice Narration

Make explanations easier to follow in a preferred language.

-   Available explanation languages: **English, Hinglish, and Hindi**.
-   Translation is handled through the backend AI integration.
-   Speech generation can use the ElevenLabs API when configured.
-   Browser Speech Synthesis provides a fallback voice path when remote
    TTS is unavailable.

### 5. 📚 Curated DSA Practice Sheet

Practice across a broad set of foundational and advanced topics.

  -----------------------------------------------------------------------
  Topic Group                         Included Topics
  ----------------------------------- -----------------------------------
  Fundamentals                        Arrays, Strings, Hashing

  Search & Pointers                   Two Pointers, Sliding Window,
                                      Binary Search

  Linear Data Structures              Stack, Queue, Linked List

  Hierarchical Structures             Trees, Binary Search Tree, Heap /
                                      Priority Queue

  Advanced Structures                 Trie, Graph

  Algorithmic Paradigms               Greedy, Backtracking, Bit
                                      Manipulation, Dynamic Programming
  -----------------------------------------------------------------------

The practice dataset is labelled in the source as a **539-question
curated sheet**. Questions are grouped into **Easy, Medium, Hard,
Placement, and Interview** tiers.

### 6. 📈 Progress Dashboard

Keep track of learning activity and practice consistency.

-   View solved-question progress against the curated practice set.
-   Review difficulty-wise progress.
-   Inspect a GitHub-style activity heatmap.
-   Track streak and milestone indicators.
-   Use recorded browser activity to populate progress views.

### 7. 💻 Integrated Multi-Language Compiler

Write, execute, and inspect code without leaving the learning workspace.

  Language     Execution Provider
  ------------ ---------------------------
  Python       Backend Python subprocess
  C++          Piston API
  Java         Piston API
  JavaScript   Piston API

**Editor and execution experience**

-   CodeMirror 5-based editor.
-   Syntax highlighting and line numbers.
-   Optional standard input.
-   Execution output, errors, and exit-status feedback.
-   Compiler workspace can be opened in the context of a selected
    practice question.
-   Successful runs can be recorded in activity history.

### 8. 🗂️ Learning Activity History

Keep a record of learning and coding sessions.

-   Store activity locally in browser Local Storage.
-   Synchronize supported history records through the backend and
    Supabase REST API.
-   Load and combine locally available and cloud-returned records.
-   Review previous learning and compiler activity.

### 9. 🎨 Theme Experience

-   Light theme with a warm cream and forest-green palette.
-   Dark theme with charcoal and emerald accents.
-   Persist the selected theme in browser Local Storage.

------------------------------------------------------------------------

## 🏗️ System Architecture

DataStruct.Flow follows a browser-client and API-backend architecture.
The frontend manages the learning interface and local interaction state,
while the FastAPI backend coordinates AI requests, translation, speech
generation, code execution, and history operations.

``` mermaid
flowchart TB
    Learner((Learner))

    subgraph Client["Frontend · HTML / CSS / Vanilla JavaScript"]
        UI["Learning Workspace"]
        Tutor["AI Tutor & Approach UI"]
        Visualizer["Dry-Run Visualizer"]
        Practice["Practice & Progress"]
        Editor["CodeMirror Compiler"]
        Local[("Local Storage")]
    end

    subgraph Server["Backend · FastAPI"]
        API["REST API Layer"]
        Orchestrator["Request Handling & Validation"]
        Cache["In-Memory Response Caches"]
        History["History Service"]
        Runner["Code Execution Router"]
    end

    AI["Groq API"]
    Voice["ElevenLabs API"]
    Piston["Piston API"]
    Python["Python Runtime"]
    Cloud[("Supabase REST API")]

    Learner --> UI
    UI --> Tutor
    UI --> Visualizer
    UI --> Practice
    UI --> Editor

    Tutor --> API
    Visualizer --> API
    Editor --> API
    API --> Orchestrator
    Orchestrator <--> Cache
    Orchestrator --> AI
    Orchestrator --> Voice
    Orchestrator --> Runner
    Runner --> Python
    Runner --> Piston
    API --> History
    History <--> Cloud
    UI <--> Local
```

### Request lifecycle

1.  The learner interacts with a frontend module.
2.  The frontend sends the required request to the FastAPI backend.
3.  The backend validates and routes the request to the relevant
    service.
4.  AI-related requests are processed through Groq; speech requests can
    use ElevenLabs.
5.  Code execution is routed to the Python runtime or Piston, depending
    on the language.
6.  The backend returns a structured response for the frontend to
    render.
7.  Supported learning activity is stored locally and can be
    synchronized through the history integration.

------------------------------------------------------------------------

## 🔬 Backend Service Design

The backend exposes focused API routes for the platform's primary
workflows.

  ------------------------------------------------------------------------
  HTTP Method             Endpoint                 Responsibility
  ----------------------- ------------------------ -----------------------
  `GET`                   `/`                      Health check and
                                                   service configuration
                                                   status

  `POST`                  `/api/explain`           Generate a DSA
                                                   explanation

  `POST`                  `/api/approaches`        Generate and compare
                                                   solution approaches

  `POST`                  `/api/analyze`           Run explanation and
                                                   approach generation
                                                   together

  `POST`                  `/api/dry-run`           Generate a step-by-step
                                                   execution trace

  `POST`                  `/api/translate`         Translate an
                                                   explanation

  `POST`                  `/api/tts`               Generate speech audio

  `POST`                  `/api/run-code`          Execute submitted
                                                   source code

  `POST`                  `/api/history`           Save an
                                                   activity-history entry

  `GET`                   `/api/history`           Retrieve activity
                                                   history

  `DELETE`                `/api/history`           Clear activity history

  `POST`                  `/api/auth/signup`       Create an account
                                                   through the backend
                                                   auth module

  `POST`                  `/api/auth/login`        Authenticate through
                                                   the backend auth module

  `POST`                  `/api/telemetry/visit`   Register a device visit
  ------------------------------------------------------------------------

Interactive request and response schemas are available in the [FastAPI
Swagger
documentation](https://datastruct-flow-backend.onrender.com/docs).

------------------------------------------------------------------------

## 🧰 Technology Stack

  ------------------------------------------------------------------------
  Layer                   Technology              Role
  ----------------------- ----------------------- ------------------------
  Frontend                HTML5, CSS3, Vanilla    Application interface
                          JavaScript              and interactions

  Code editor             CodeMirror 5            In-browser code editing

  Backend                 Python, FastAPI,        REST API and service
                          Uvicorn                 orchestration

  AI inference            Groq API                Explanations,
                                                  approaches, dry runs,
                                                  and translation

  Text-to-speech          ElevenLabs, Web Speech  Spoken explanations and
                          API                     fallback narration

  Local database          SQLite                  Backend
                                                  authentication-related
                                                  storage

  Cloud history           Supabase REST API       History synchronization

  Password utilities      bcrypt                  Password hashing helper

  Token utilities         JWT                     Authentication token
                                                  helper

  Code execution          Python subprocess,      Multi-language execution
                          Piston API              

  Frontend hosting        Vercel                  Production frontend

  Backend hosting         Render                  Production API
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## 🔄 Core Workflow: From Problem to Execution

``` mermaid
sequenceDiagram
    autonumber
    actor Learner
    participant Frontend
    participant Backend as FastAPI Backend
    participant Groq
    participant Runtime as Code Runtime

    Learner->>Frontend: Submit DSA problem
    Frontend->>Backend: Request explanation / approaches
    Backend->>Groq: Generate learning content
    Groq-->>Backend: Explanation and strategies
    Backend-->>Frontend: Structured response
    Frontend-->>Learner: Display explanation and complexity

    Learner->>Frontend: Select an approach
    Frontend->>Backend: Request dry-run trace
    Backend->>Groq: Generate execution steps
    Groq-->>Backend: Structured trace
    Backend-->>Frontend: Return visualization data
    Frontend-->>Learner: Render step-by-step execution

    Learner->>Frontend: Submit code
    Frontend->>Backend: Run code request
    Backend->>Runtime: Execute by selected language
    Runtime-->>Backend: Output / error / status
    Backend-->>Frontend: Execution result
    Frontend-->>Learner: Show compiler result
```

------------------------------------------------------------------------

## 📁 Project Structure

The following is a logical overview of the frontend and backend files
reviewed for this project. Folder placement may differ in the deployed
repository.

``` text
DataStruct.Flow/
│
├── backend/
│   ├── main.py                 # FastAPI application, integrations and API routes
│   ├── auth.py                 # SQLite and authentication helper logic
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   ├── index.html              # Landing page
│   ├── dashboard.html          # AI tutor workspace
│   ├── practice.html           # Curated DSA practice sheet
│   ├── progress.html           # Progress dashboard and heatmap
│   ├── history.html            # Activity history
│   ├── compiler.html            # Code execution workspace
│   ├── script.js               # Tutor, translation and visualization logic
│   ├── practice.js             # Practice dataset and interactions
│   ├── progress.js             # Progress calculations and UI
│   ├── compiler.js             # Compiler interface and execution flow
│   ├── history-store.js        # Local and cloud history integration
│   ├── style.css               # Main application styling
│   ├── auth.css                # Authentication-related styling
│   ├── auth.js                 # Authentication page logic
│   ├── name.js                 # Learner name handling
│   ├── theme.js                # Theme persistence and switching
│   └── stub.js                 # Frontend initialization
│
└── README.md
```

> This tree is illustrative. Match it to the actual repository folders
> before publishing.

------------------------------------------------------------------------

## ⚙️ Local Setup & Installation

### Prerequisites

-   Python 3.10+
-   pip
-   Git
-   A modern web browser
-   API credentials for the external services you want to enable

### 1. Clone the repository

Replace the placeholder with the actual GitHub repository URL.

``` bash
git clone https://github.com/<your-username>/<your-repository>.git
cd <your-repository>
```

### 2. Set up the backend environment

``` bash
cd backend

python -m venv venv
```

Activate the environment:

**Windows PowerShell**

``` powershell
venv\Scripts\Activate.ps1
```

**Windows Command Prompt**

``` cmd
venv\Scripts\activate.bat
```

**macOS / Linux**

``` bash
source venv/bin/activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the backend directory. Add only the credentials
required by the integrations you intend to use.

``` env
GROQ_API_KEY=your_groq_api_key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key

ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id

JWT_SECRET=replace_with_a_long_random_secret
```

**Never commit `.env` or publish API keys.** Use the exact variable
names expected by your backend configuration.

### 4. Start the backend

``` bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

-   API root: `http://localhost:8000`
-   Swagger UI: `http://localhost:8000/docs`

### 5. Run the frontend

Serve the frontend folder using a local static server. For example:

``` bash
cd ../frontend
python -m http.server 5500
```

Open `http://localhost:5500` in your browser.

> The reviewed frontend configuration uses the deployed Render API in
> production and switches to `http://localhost:8000` when served from
> localhost. Adjust the API base configuration if your local setup
> differs.

------------------------------------------------------------------------

## 🔐 Security & Deployment Considerations

The project integrates external AI services and code execution, so
deployment configuration matters.

-   Keep all API credentials in environment variables. Do not commit
    `.env` files.
-   Rotate credentials if they have ever been exposed in a repository,
    chat, log, or shared file.
-   Restrict backend CORS origins to trusted frontend domains before
    production use; the reviewed backend currently uses permissive `*`
    CORS.
-   The Python execution route runs submitted code in a backend
    subprocess. Arbitrary code execution should not be exposed to
    untrusted users without strong sandboxing, isolation, and CPU/memory
    limits.
-   C++, Java, and JavaScript execution depend on the external Piston
    service.
-   The backend contains authentication endpoints and helper utilities,
    but the reviewed frontend initialization indicates that
    authentication is currently bypassed/removed from the page flow. Do
    not assume all pages are protected by login.
-   History synchronization depends on valid Supabase configuration and
    a compatible database table.
-   In-memory caches are temporary and are cleared when the backend
    process restarts.

------------------------------------------------------------------------

## 🧪 Implementation Notes

A few details are worth understanding when extending the application:

-   The practice dataset is labelled as containing **539 questions** in
    the source.
-   Progress indicators are calculated from browser-side activity and
    solved-question records.
-   Local Storage is used for theme and local activity persistence.
-   History can be synchronized with Supabase through backend REST
    calls.
-   Groq model availability is discovered and cached by the backend.
-   The shown Python execution path applies a five-second timeout.
-   Remote execution for C++, Java, and JavaScript is delegated to
    Piston.
-   ElevenLabs voice generation is optional; browser Speech Synthesis is
    the fallback path.

------------------------------------------------------------------------

## 🗺️ Development Roadmap

Potential engineering improvements for future iterations:

-   [ ] Enable and verify authentication consistently across all pages.
-   [ ] Add user-scoped authorization for history and progress records.
-   [ ] Introduce isolated sandbox execution for submitted code.
-   [ ] Add API rate limiting and request-size controls.
-   [ ] Add automated backend tests and frontend workflow tests.
-   [ ] Add persistent caching and structured logging.
-   [ ] Expand dry-run support for more algorithms and data structures.
-   [ ] Add export/import for practice progress and learning history.
-   [ ] Add deployment health monitoring and error reporting.

------------------------------------------------------------------------

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome.

1.  Fork the repository.
2.  Create a feature branch: `git checkout -b feature/your-feature`.
3.  Make focused changes.
4.  Test the affected frontend and backend workflows.
5.  Commit your changes with a descriptive message.
6.  Open a pull request explaining the change.

------------------------------------------------------------------------

## 👨‍💻 Author

::: {align="center"}
### Bharat Goswami

B.Tech CSE · Artificial Intelligence & Machine Learning

`<a href="https://github.com/bharat19334">`{=html}GitHub`</a>`{=html} ·
`<a href="https://www.linkedin.com/in/bharatgoswami19/">`{=html}LinkedIn`</a>`{=html}
:::

------------------------------------------------------------------------

::: {align="center"}
**Built to make algorithmic thinking visual, structured, and
practical.**

If DataStruct.Flow helps you learn, consider giving the project a ⭐

`Understand → Optimize → Visualize → Practice → Improve`
:::
