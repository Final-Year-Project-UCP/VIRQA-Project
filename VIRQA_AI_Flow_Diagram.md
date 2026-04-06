# VIRQA — Complete AI Interview System Diagram

## System Actors & Technology Stack

| Actor | Interface | Technology |
|---|---|---|
| **Admin** | Admin Dashboard | React + Vite |
| **Employee (HR)** | Employee Dashboard | React + Vite |
| **Candidate** | Candidate Portal | React + Vite |
| **Backend** | REST API + Socket.io | Node.js + Express |
| **AI Engine** | LLM Questions & Evaluation | Groq API (llama-3.1-8b-instant) |
| **Speech-to-Text** | Audio Transcription | Whisper large-v3 (Groq) |
| **Database** | Persistence | MongoDB (Mongoose) |
| **Email** | Invitations & OTP | Nodemailer + Gmail SMTP |
| **File Storage** | Profile Photos | Cloudinary |

---

## Phase 1: Interview Session Creation (Employee → Candidates)

```mermaid
flowchart TD
    A([HR / Employee Logs In]) --> B[Create Interview Form\nJobTitle, JD, Date, Time, Duration\nCandidate Emails]
    B --> B2{Optional: Generate AI Prompt}
    B2 -->|"POST /employee/interview/generate-prompt"| B3[Groq LLM generates\nAI Interviewer System Prompt]
    B3 --> B

    B --> C["POST /api/v1/employee/interview/create"]
    C --> D{For Each Candidate Email}

    D --> E{User Exists\nin MongoDB?}
    E -->|No| F[Create Candidate Account\nwith Temp Password\ncreatedBy = Employee]
    E -->|Yes| G[Use Existing Account\nPassword = existing]

    F --> H[Send Interview Invite Email\nvia Nodemailer + Gmail SMTP\nJobTitle, Date, Time, Temp Password]
    G --> H

    H --> I[Create InterviewSession\nin MongoDB]
    I --> J[(InterviewSession Collection\nstatus: Scheduled\ncandidates with status: Pending)]

    J --> K[Return 201 to Frontend\nSession Created Successfully]
```

---

## Phase 2: Candidate Authentication & Lobby

```mermaid
flowchart TD
    A([Candidate receives Email]) --> B[Logs in with\nemail + temp password]
    B --> C["POST /api/v1/user/login"]
    C --> D{needsPasswordChange?}
    D -->|Yes| E[Redirect to Change Password Page]
    D -->|No| F[JWT Token set in Cookie\nRole = candidate]

    E --> E1["PATCH /api/v1/user/change-password"]
    E1 --> F

    F --> G[Candidate Dashboard]
    G --> H["GET /candidate/my-interviews\nFetch Scheduled Interviews"]
    H --> I[(Query InterviewSession\nwhere candidateId matches)]
    I --> J[Display Upcoming Interviews List]

    J --> K[Candidate Selects Interview\n→ Enters Lobby]
    K --> L[Lobby: Mic Check\nAudio Visualization]
    L --> M[Click 'Start Interview'\nTrigger Fullscreen API]
    M --> N[Active Interview Session]
```

---

## Phase 3: AI Interview Initialization

```mermaid
flowchart TD
    A([Active Session Mounts]) --> B["POST /api/v1/ai-interview/start\ncandidateId, role, experience\ninterviewSessionId"]
    B --> C{Existing AIInterview\nfor this candidate + session?}

    C -->|"status: completed"| D[403 — Cannot Rejoin\nInterview Already Done]
    C -->|"status: ongoing"| E[200 — Resume Session\nReturn existing AIInterview doc]
    C -->|Not Found| F[Create NEW AIInterview document\nstatus: ongoing\ndifficulty: medium]

    F --> G[(Save to AIInterview Collection)]
    E --> H
    G --> H[Frontend stores interviewId]
    H --> I[Socket.io connect\nto Backend Server]
    I --> J["emit('start-interview', {interviewId})"]
    J --> K[Server joins socket\nto room: interviewId]
```

---

## Phase 4: Real-Time AI Question Generation

```mermaid
flowchart LR
    A["Socket: start-interview received"] --> B[Fetch AIInterview from DB]
    B --> C{Any unanswered\nquestions?}

    C -->|Yes: Resume| D["Re-emit last\nunanswered question"]
    C -->|No: Fresh| E[Build Context Object]

    E --> E1["context = {\n  role, experience,\n  difficulty: current,\n  history: past Q&A pairs\n}"]
    E1 --> F["questionService.generateQuestion(context)"]

    F --> G["Groq API: llama-3.1-8b-instant\nmodel: 'You are expert tech interviewer...\nRole: {role}, Difficulty: {difficulty}'\ntemperature: 0.7"]

    G --> H{API Success?}
    H -->|Yes| I[Return generated question text]
    H -->|No Fallback| I2["Return: 'Tell me about a recent\nchallenging problem you solved'"]

    I --> J[Save question to\nAIInterview.questions array]
    J --> K["emit('next-question', {questionText})"]
    K --> L[Candidate sees question\non screen + read aloud via TTS]
```

---

## Phase 5: Audio Answer Processing Pipeline

```mermaid
flowchart TD
    A([Candidate speaks answer]) --> B[Frontend records audio\nas .webm AudioBuffer]
    B --> C["emit('send-audio', {\n  interviewId,\n  currentQuestionText,\n  audioBuffer\n})"]

    C --> D["emit('processing-status', 'Transcribing...')"]

    subgraph STT ["Speech-to-Text Service (sttService.js)"]
        D --> E[Write AudioBuffer\nto temp .webm file in OS tmpdir]
        E --> F["Groq Whisper API\nmodel: whisper-large-v3\nStreams temp file"]
        F --> G[Return transcription.text]
        G --> H[Delete temp file]
    end

    H --> I["emit('transcription-result', {transcribedText})"]
    I --> J["emit('processing-status', 'Evaluating...')"]

    subgraph EVAL ["Evaluation Service (evaluationService.js)"]
        J --> K["evaluateAnswer(question, transcribedText)"]
        K --> L["Groq API: llama-3.1-8b-instant\ntemperature: 0.3 (objective)\nresponse_format: json_object\nPrompt: 'Evaluate this answer...'"]
        L --> M["Returns JSON:\n{\n  semanticScore: 0-100,\n  technicalScore: 0-100,\n  overallScore: 0-100,\n  feedback: string,\n  strengths: string[],\n  weaknesses: string[]\n}"]
    end

    M --> N["emit('evaluation-result', {evaluation})"]
    N --> O[Frontend shows scores,\nfeedback, strengths, weaknesses]
```

---

## Phase 6: Adaptive Difficulty Engine

```mermaid
flowchart LR
    A[overallScore received] --> B{Score Range}
    B -->|"> 75 (Excellent)"| C[Level UP\nearsy→medium\nmedium→hard]
    B -->|"40–75 (Average)"| D[Keep SAME\ncurrent difficulty]
    B -->|"< 40 (Poor)"| E[Level DOWN\nhard→medium\nmedium→easy]

    C --> F[Save new difficulty\nto AIInterview.currentDifficulty]
    D --> F
    E --> F

    F --> G[Use updated difficulty\nin next generateQuestion call]

    style C fill:#22c55e,color:#fff
    style D fill:#f59e0b,color:#fff
    style E fill:#ef4444,color:#fff
```

---

## Phase 7: Database Write After Each Answer

```mermaid
flowchart TD
    A[Evaluation complete] --> B[Find AIInterview by ID]
    B --> C[Append to answers array\n{questionText, transcribedText, answeredAt}]
    C --> D[Append to scores array\n{semanticScore, technicalScore,\noverallScore, feedback,\nstrengths, weaknesses}]
    D --> E[Update currentDifficulty]
    E --> F[Save document to MongoDB]

    F --> G[Generate NEXT question\nwith updated context + history]
    G --> H["emit('next-question')"]
    H --> I[Repeat loop until\nCandidate ends interview]
```

---

## Phase 8: Interview Completion & Final Report

```mermaid
flowchart TD
    A([Candidate clicks End Interview]) --> B[Browser exits Fullscreen]
    B --> C["emit('interview-complete', {interviewId})"]

    C --> D[Find AIInterview by ID]
    D --> E[Calculate Final Score\nSum all overallScores / count]
    E --> F{avgScore > 70?}

    F -->|Yes| G["finalReport: 'Recommended\nfor next rounds'"]
    F -->|No| H["finalReport: 'Requires more\npreparation in technical fundamentals'"]

    G --> I[Set status = 'completed'\nSave to MongoDB]
    H --> I

    I --> J{Has parent\nInterviewSessionId?}
    J -->|Yes| K[Find InterviewSession\nby interviewSessionId]
    K --> L[Update candidate.status\n= 'Completed' in session]
    L --> M[Save InterviewSession]
    J -->|No| M

    M --> N["emit('interview-completed-successfully'\n{finalReport, averageScore})"]
    N --> O[Frontend navigates\nto Results Page]

    O --> P["GET /candidate/results\nFetch AIInterview with scores"]
    P --> Q[Display Score Cards,\nFeedback, Strengths,\nWeaknesses, Radar Chart]
```

---

## Phase 9: Admin Audit & Monitoring

```mermaid
flowchart TD
    A([Admin logs in]) --> B[Admin Dashboard]
    B --> C["GET /api/v1/admin/dashboard-stats"]
    C --> D[(MongoDB Aggregations)]
    D --> E[Total Employees Count]
    D --> F[Total Candidates Count]
    D --> G[Total Interviews Count]
    D --> H[Recent 10 Interviews\nwith Candidate Names + Scores]
    D --> I[Chart Data: Last 7\ncompleted interview scores]

    B --> J["GET /api/v1/admin/interviews"]
    J --> K[(AIInterview.find\nPopulate candidateId, interviewSessionId)]
    K --> L[Full Interview History Table\nName, Role, Date, Status, AvgScore]

    L --> M{Admin Actions}
    M --> N[View Details / PDF Export]
    M --> O[Filter by Status, Date, Role]
```

---

## Complete Data Model Relationships

```mermaid
erDiagram
    USER {
        ObjectId _id
        string email
        string password
        string role
        string fullName
        boolean needsPasswordChange
        string profilePhoto
    }

    ADMIN {
        string[] permissions
        boolean systemLogsAccess
        string department
    }

    EMPLOYEE {
        string jobTitle
        string department
        string status
        ObjectId[] assignedCandidates
    }

    CANDIDATE {
        string resumeUrl
        string[] skills
        number experience
        string level
        number overallConfidenceScore
    }

    INTERVIEWSESSION {
        ObjectId _id
        string jobTitle
        string jobDescription
        Date scheduledDate
        string startTime
        number duration
        string status
        ObjectId createdBy
    }

    AIINTERVIEW {
        ObjectId _id
        string role
        string experience
        string currentDifficulty
        string status
        object[] questions
        object[] answers
        object[] scores
        string finalReport
    }

    USER ||--|| ADMIN : "discriminator"
    USER ||--|| EMPLOYEE : "discriminator"
    USER ||--|| CANDIDATE : "discriminator"
    EMPLOYEE ||--o{ INTERVIEWSESSION : "creates"
    INTERVIEWSESSION ||--o{ CANDIDATE : "has many"
    CANDIDATE ||--o{ AIINTERVIEW : "takes"
    INTERVIEWSESSION ||--o{ AIINTERVIEW : "parent of"
```

---

## Complete Socket.io Event Reference

| Event (Client → Server) | Payload | Description |
|---|---|---|
| `start-interview` | `{ interviewId }` | Join interview room and get first question |
| `send-audio` | `{ interviewId, currentQuestionText, audioBuffer }` | Submit audio answer for processing |
| `interview-complete` | `{ interviewId }` | Signal interview end and generate final report |

| Event (Server → Client) | Payload | Description |
|---|---|---|
| `next-question` | `{ questionText }` | New question generated by AI |
| `transcription-result` | `{ transcribedText }` | Real-time speech-to-text result |
| `evaluation-result` | `{ evaluation }` | Scores + feedback from AI grader |
| `processing-status` | `{ message }` | Loading state updates (Transcribing, Evaluating...) |
| `interview-completed-successfully` | `{ finalReport, averageScore }` | Final summary after interview ends |
| `interview-error` | `{ message }` | Error during any pipeline stage |
| `employeeAdded` | Employee object | Real-time employee list update |
| `employeeUpdated` | Employee object | Real-time employee update |
| `employeeDeleted` | Employee ID | Real-time employee removal |
