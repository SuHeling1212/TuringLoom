# Turing Machine Core

A Java library for Turing Machine simulation, fully compatible with the TuringLoom web application's rule files.

## Requirements

- Java 17+
- Maven 3.6+

## Build

```bash
mvn clean package
```

## Usage

### Load and Run

```java
import com.follarce.*;
import com.follarce.machine.TuringMachine;

// Load configuration from file
MachineConfiguration config = TuringMachineApi.loadConfiguration(new File("rules.json"));

// Create machine
TuringMachine machine = TuringMachineApi.createMachine(config);

// Run simulation
TuringMachine.RunResult result = machine.run(10000);

// Get results
System.out.println("Steps: " + result.getTotalSteps());
System.out.println("Halted: " + result.isHalted());
System.out.println("Final state: " + result.getFinalState());
System.out.println("Tape content: " + result.getTapeContent(0));
```

### Step-by-Step Execution

```java
TuringMachine machine = TuringMachineApi.createMachine(config);

while (!machine.isHalted()) {
    TuringMachine.StepResult step = machine.step();
    if (step.isSuccess()) {
        System.out.println("Executed: " + step.getExecutedRule().getName());
        System.out.println("Tape: " + machine.getTapes().get(0).getTapeContent());
    } else {
        System.out.println("Error: " + step.getMessage());
    }
}
```

## API Reference

### TuringMachineApi

| Method | Description |
|--------|-------------|
| `loadConfiguration(File)` | Load configuration from file |
| `loadConfiguration(InputStream)` | Load configuration from stream |
| `loadConfiguration(String)` | Load configuration from JSON string |
| `createMachine(MachineConfiguration)` | Create machine from configuration |
| `createMachine(List<Rule>, List<Tape>)` | Create machine from lists |
| `createMachine(File)` | Load and create in one step |
| `toJson(MachineConfiguration)` | Serialize configuration to JSON |

### TuringMachine

| Method | Description |
|--------|-------------|
| `step()` | Execute one step, returns `StepResult` |
| `run(int maxSteps)` | Run until halt or max steps, returns `RunResult` |
| `findMatchingRules()` | Get rules matching current state |
| `reset()` | Reset machine to initial state |
| `isHalted()` | Check if machine is halted |
| `getCurrentState()` | Get current state |
| `getTapes()` | Get tape states |
| `getStepCount()` | Get total steps executed |

## Rule File Format

Compatible with TuringLoom web app:

```json
{
  "rules": [
    {
      "name": "Rule name",
      "tapeIndex": 0,
      "currentState": "q0",
      "readSymbol": "0",
      "readAny": false,
      "stateAny": false,
      "writeSymbol": "1",
      "moveDirection": "right",
      "newState": "q1",
      "shouldHalt": false
    }
  ],
  "tapeTypes": [
    {
      "id": "tape-1",
      "name": "Main Tape",
      "type": "1d",
      "initialContent": "00000000000000000000"
    }
  ]
}
```

### Special Fields

- `readAny: true` - Match any symbol (ignores `readSymbol`)
- `stateAny: true` - Match any state (ignores `currentState`)

## Features

- Fully compatible with TuringLoom web app rule files
- Supports `readAny` and `stateAny` for wildcard matching
- Detects duplicate rules and reports which rules conflict
- Clean API without console output
- Step-by-step or run-to-completion execution modes

## License

MIT License
