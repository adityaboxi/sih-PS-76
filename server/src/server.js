import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Attach socket.io to request object for realtime broadcasts
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SIH PS 76 Node.js CRUD & Socket.io Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

io.on('connection', (socket) => {
  console.log('⚡ Socket.io Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log('🚀 Node.js CRUD & Socket.io Server running on port ' + PORT);
  console.log('🔗 API Base: http://localhost:' + PORT + '/api');
});
