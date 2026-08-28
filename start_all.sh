#!/bin/bash

echo "========================================================="
echo "   JanSetu AI - SIH PS 76 Multi-Service Launcher"
echo "========================================================="

# 1. Start Python AI Microservice (Port 5000)
echo "[1/3] Starting Python AI Microservice on Localhost:5000..."
cd ai_service
python3 app/main.py &
AI_PID=$!
cd ..

# 2. Start Node.js Express & Socket.io CRUD Server (Port 3000)
echo "[2/3] Starting Node.js CRUD & Socket.io Server on Localhost:3000..."
cd server
npm start &
SERVER_PID=$!
cd ..

# 3. Start React Frontend with Vite (Port 5173)
echo "[3/3] Starting React Client on Localhost:5173..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo "========================================================="
echo "✅ All 3 Local Services Initialized Successfully!"
echo "🌐 1. Client (Vite React):        http://localhost:5173"
echo "🚀 2. Server (Express & Sockets): http://localhost:3000/api"
echo "🧠 3. AI Service (Python FastAPI): http://localhost:5000/docs"
echo "========================================================="

# Clean shutdown handler for all 3 child processes when pressing Ctrl+C
trap "kill $AI_PID $SERVER_PID $CLIENT_PID 2>/dev/null; exit" INT TERM
wait