#!/bin/bash

cd "$(dirname "$0")"

echo "Starting Turing Machine Server (Backend)..."
cd turing-machine-server
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

sleep 5

echo "Starting Turing Machine Web (Frontend)..."
cd TuringLoom
pnpm install
pnpm dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================="
echo "TuringLoom is starting..."
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo "=========================================="
echo ""
echo "Press Ctrl+C to stop both servers"

trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

wait
