# Turing Machine Server

Backend server for TuringLoom web application.

## Requirements

- Java 17+
- Maven 3.6+

## Build

```bash
mvn clean package
```

## Run

```bash
mvn spring-boot:run
```

Or run the JAR directly:

```bash
java -jar target/turing-machine-server-1.0.0.jar
```

## API Endpoints

### POST /api/machine/step

Execute a single step of the Turing machine.

Request:
```json
{
  "rules": [...],
  "tapes": [...],
  "currentState": "q0"
}
```

Response:
```json
{
  "success": true,
  "message": "Executed rule: Write H",
  "halted": false,
  "finalState": "q1",
  "tapes": [...],
  "executedRule": {...}
}
```

### POST /api/machine/run

Run the Turing machine until it halts or reaches max steps.

Request:
```json
{
  "rules": [...],
  "tapes": [...],
  "currentState": "q0",
  "maxSteps": 10000
}
```

Response:
```json
{
  "success": true,
  "message": "Simulation completed",
  "totalSteps": 11,
  "halted": true,
  "finalState": "q_halt",
  "tapes": [...]
}
```

## CORS

The server is configured to accept requests from:
- http://localhost:3000
- http://localhost:5173

## License

MIT License
