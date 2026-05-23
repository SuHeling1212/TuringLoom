
# TuringLoom - Turing Machine Simulator

A beautiful and feature-rich visual Turing machine simulator, supporting JavaFX desktop and Web.

---

## Introduction

TuringLoom is a visual Turing machine simulator built with React + TypeScript + Tailwind CSS + Spring Boot. It provides an intuitive graphical interface for creating, editing, and running Turing machine programs, making it an ideal tool for learning computation theory and formal languages.

## Core Features

- **Rule Editor** - Visually create, edit, and delete Turing machine rules with state transitions, symbol read/write, and movement direction
- **Multi-tape Support** - Create multiple independent tapes, each with its own initial content and name
- **Import/Export** - Export rule configurations to JSON files or import from JSON
- **Internationalization** - Full Chinese/English interface support with auto-saved language preference
- **Simulation Control** - Step execution, auto-run, speed adjustment, and reset
- **Visualization** - Real-time display of tape state, head position, and current state
- **Wildcard Rules** - Support `readAny` and `stateAny` wildcards to match any symbol or state

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 3.4 |
| Backend | Spring Boot 4.0 |
| Runtime | Java 26 |
| Desktop | JavaFX |
| Package Manager | pnpm / Maven |

## Project Structure

```
TuringLoom/
├── TuringLoom/                    # Frontend (Vite + React + TypeScript)
│   ├── src/
│   │   ├── components/            # React components
│   │   │   └── turing-machine/    # Core components
│   │   │       ├── ControlPanel.tsx
│   │   │       ├── RuleEditor.tsx
│   │   │       └── TapeSimulator.tsx
│   │   ├── lib/                   # Utilities
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── examples/
│   ├── package.json
│   └── vite.config.ts
│
├── turing-machine-core/           # Java core library
├── turing-machine-server/         # Spring Boot backend
├── turing-machine-desktop/        # JavaFX desktop app
│
├── build-desktop.sh               # One-click build script
└── turing-machine-desktop-1.0.0.jar
```

## How to Run

### Option 1: JavaFX Desktop Application

```bash
# Build
./build-desktop.sh

# Run
java -jar turing-machine-desktop-1.0.0.jar
```

### Option 2: Web Development Mode

```bash
# Terminal 1: Start backend
cd turing-machine-server
mvn spring-boot:run

# Terminal 2: Start frontend
cd TuringLoom
pnpm install
pnpm dev
```

### Option 3: Web Production Mode

```bash
# Build frontend
cd TuringLoom
pnpm build

# Start backend (serves frontend)
cd turing-machine-server
mvn spring-boot:run
# Visit http://localhost:8888
```

## Rule Configuration

Each Turing machine rule has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Rule name |
| `tapeIndex` | number | Target tape index (0-based) |
| `currentState` | string | Current state (e.g., `q0`) |
| `readSymbol` | string | Symbol to read (single character) |
| `readAny` | boolean | Match any symbol |
| `stateAny` | boolean | Match any state |
| `writeSymbol` | string | Symbol to write (single character) |
| `moveDirection` | 'left' \| 'right' \| 'stay' | Head movement direction |
| `newState` | string | New state after transition |
| `shouldHalt` | boolean | Whether to halt |

## Usage Guide

1. **Create Tape** - Click "New Tape" button
2. **Set Initial Content** - Enter initial symbols in the tape input
3. **Add Rules** - Create transition rules in the rule editor panel
4. **Run Simulation** - Click "Step" for single step, or "Run" for auto execution
5. **Import/Export** - Use control panel to save or load rule configurations

## Author

**SuHeling**

## License

MIT License
