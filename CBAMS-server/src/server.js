import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { PrismaClient } from '@prisma/client'; // ✅ Correct Prisma import

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5000",'https://cbams-o3j3.vercel.app'],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO connection handling for WebRTC
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Join video call room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`📹 User ${socket.id} joined room: ${roomId}`);
    socket.to(roomId).emit('user-connected', socket.id);
  });

  // WebRTC offer (caller sends to callee)
  socket.on('offer', (offer, roomId) => {
    console.log('📤 Sending offer to room:', roomId);
    socket.to(roomId).emit('offer', offer);
  });

  // WebRTC answer (callee responds to caller)
  socket.on('answer', (answer, roomId) => {
    console.log('📥 Sending answer to room:', roomId);
    socket.to(roomId).emit('answer', answer);
  });

  // ICE candidate exchange
  socket.on('ice-candidate', (candidate, roomId) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });

  // ✅ Handle user leaving room
  socket.on('leave-room', async (roomId) => {
    console.log(`👋 User ${socket.id} leaving room: ${roomId}`);
    socket.leave(roomId);
    
    // Check if room is now empty (both users left)
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room || room.size === 0) {
      // Auto-complete session when both users have left
      try {
        const session = await prisma.session.findFirst({
          where: { videoRoomId: roomId }
        });

        if (session && session.status === 'CONFIRMED') {
          await prisma.session.update({
            where: { id: session.id },
            data: { status: 'COMPLETED' }
          });
          console.log(`✅ Session ${session.id} (Room: ${roomId}) auto-completed`);
        }
      } catch (error) {
        console.error('❌ Error auto-completing session:', error);
      }
    }
  });

  // ✅ Handle disconnect
  socket.on('disconnect', async () => {
    console.log('❌ User disconnected:', socket.id);
    
    // Get all rooms this socket was in
    const rooms = Array.from(socket.rooms);
    
    // Check each room for emptiness
    for (const roomId of rooms) {
      if (roomId === socket.id) continue; // Skip the socket's own room
      
      const room = io.sockets.adapter.rooms.get(roomId);
      if (!room || room.size === 0) {
        try {
          const session = await prisma.session.findFirst({
            where: { videoRoomId: roomId }
          });

          if (session && session.status === 'CONFIRMED') {
            await prisma.session.update({
              where: { id: session.id },
              data: { status: 'COMPLETED' }
            });
            console.log(`✅ Session ${session.id} (Room: ${roomId}) auto-completed on disconnect`);
          }
        } catch (error) {
          console.error('❌ Error auto-completing session on disconnect:', error);
        }
      }
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.IO ready for WebRTC`);
});
