# CommonGrounds

> **Focus. Plan. Achieve.** - Your ultimate study buddy for academic success.

CommonGrounds is a comprehensive student productivity platform that combines task management, schedule tracking, and focused study sessions into one intuitive application. Built to help students stay organized, motivated, and on track throughout their academic journey.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Target Users](#-target-users)
- [Key Features](#-key-features)
- [Technologies Used](#️-technologies-used)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)

---

## 🎯 Problem Statement

Students today face numerous challenges in managing their academic responsibilities:

- **Information Overload**: Multiple platforms for assignments, schedules, and course materials make it difficult to maintain a clear overview
- **Poor Time Management**: Without a centralized system, students struggle to prioritize tasks and manage deadlines effectively
- **Lack of Focus**: Distractions and multitasking lead to reduced productivity and increased stress
- **Limited Progress Tracking**: Students often can't visualize their academic progress or identify areas needing attention
- **Disconnected Tools**: Using separate apps for calendars, to-do lists, timers, and study resources creates workflow friction

**CommonGrounds solves these problems** by providing an all-in-one platform that centralizes task management, scheduling, progress tracking, and focused study sessions in a single, user-friendly interface.

---

## 👥 Target Users

### Primary Users
- **College/University Students**: Managing multiple courses, assignments, projects, and exams
- **High School Students**: Learning to organize academic responsibilities and develop study habits
- **Online Learners**: Juggling self-paced courses and need structured organization

---

## ✨ Key Features

### 📊 Dashboard
Get an at-a-glance view of your academic life:
- Upcoming tasks and deadlines
- Today's class schedule with real-time updates
- Module progress visualization
- Quick access to all features

### 🎓 Learning Hub
Comprehensive task and module management:
- Create, edit, and delete tasks with priorities
- Filter tasks by status, priority, or course
- View detailed task cards with progress tracking
- Organize modules with course information and schedules

### 📅 Calendar
Smart scheduling with multiple views:
- **Month and Week Views**: Switch between calendar perspectives
- **Multiple Event Types**: Tasks, classes, meetings, presentations, study sessions
- **Color-Coded Events**: Visual distinction by event type and priority
- **Event Management**: Create, edit, and delete events with modal interface
- **Recurring Classes**: Automatic scheduling based on course timetables
- **Smart Indicators**: Shows count of tasks and classes per day
- **Click-to-Edit**: Quick event updates directly from calendar

### 🎯 Focus Mode
Pomodoro-based productivity system:
- **Customizable Timers**: Set focus (25min), short break (5min), and long break (15min) durations
- **Circular Progress Indicator**: Visual timer display
- **Pause/Resume**: Full control over your sessions
- **Auto-Progression**: Seamlessly transition between focus and break periods
- **Session History**: Track all completed focus sessions with timestamps
- **Auto-Save**: Sessions automatically saved upon completion

### 🤖 Wasi - AI Assistant
Intelligent chat companion:
- Real-time date and time display
- Chat history management
- File attachment support
- Contextual help and guidance

### 🔐 User Authentication
- Secure login system
- Logout confirmation prompt ("Are you sure you want to log out?")
- Session management

---

## 🛠️ Technologies Used

### Frontend Framework
- **React 19.0.0**: Modern component-based UI library
- **Vite 7.1.10**: Lightning-fast build tool and dev server
- **TanStack Router 1.132.0**: Type-safe routing solution

### UI & Styling
- **Mantine UI 8.3.5**: Comprehensive component library
  - Components: Modal, Select, DateTimePicker, Alert, Loader, Grid, Stack, TextInput, Textarea, etc.
- **Tailwind CSS 4.0.6**: Utility-first CSS framework
- **Lucide React**: Beautiful, consistent icon set
- **Tabler Icons**: Additional icon library

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mjquitain/CommonGrounds.git
   cd CommonGrounds
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

---

## 📁 Project Structure

```
CommonGrounds/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Header.jsx       # Navigation sidebar with menu
│   │   │   ├── DateTimeDisplay.tsx  # Real-time date/time widget
│   │   │   ├── DetailedTasks.jsx    # Task card display grid
│   │   │   ├── TaskFormModal.jsx    # Task create/edit modal
│   │   │   └── UpcomingTasks.tsx    # Dashboard task preview
│   │   ├── pages/               # Page components
│   │   │   ├── dashboard/       # Dashboard overview
│   │   │   ├── learninghub/     # Task and module management
│   │   │   ├── calendar/        # Calendar with event management
│   │   │   ├── focus/           # Pomodoro focus mode
│   │   │   ├── ai/              # Wasi AI assistant chat
│   │   │   └── login/           # Authentication page
│   │   ├── routes/              # TanStack Router configuration
│   │   │   ├── __root.tsx       # Root layout
│   │   │   ├── index.tsx        # Home route
│   │   │   ├── (auth)/          # Authentication routes
│   │   │   └── (protected)/     # Protected app routes
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useTasks.js      # Task CRUD operations
│   │   │   ├── useFocusTimer.js # Timer logic and state
│   │   │   └── useFocusHistory.js # Session history
│   │   ├── data/                # Mock data
│   │   │   ├── mock_task_data.js     # Sample tasks
│   │   │   ├── mock_modules_data.js  # Course modules
│   │   │   └── mock_classes_data.js  # Class schedules
│   │   ├── main.tsx             # Application entry point
│   │   └── styles.css           # Global styles
│   ├── public/                  # Static assets
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── package.json             # Dependencies and scripts
│   ├── vite.config.ts           # Vite configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── eslint.config.js         # ESLint rules
│   └── prettier.config.js       # Prettier formatting
├── styles/                      # Legacy styles (being migrated)
├── views/                       # HTML version of the CommonGrounds
└── README.md
```

---

## 👨‍💻 Author

**Mykyla Jaimie Valenzuela**

---

## 🙏 Acknowledgments

- Built with React and Vite
- UI components from Mantine UI
- Icons from Lucide React and Tabler Icons
- Inspired by student productivity needs and Pomodoro technique

---
