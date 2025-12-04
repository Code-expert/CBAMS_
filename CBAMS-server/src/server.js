import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server with proper CORS
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://cbams.vercel.app"  // ✅ Your production frontend
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  // ✅ Add these for mobile compatibility
  transports: ['websocket', 'polling'],
  allowEIO3: true
});


// Socket.IO connection handling for WebRTC
// Store active users per room
const roomUsers = new Map(); // roomId -> Set of socket IDs

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // ✅ Join video call room with session code
  socket.on('join-room', async ({ roomId, userId, userName }) => {
    console.log(`📹 User ${userName} (${userId}) joining room: ${roomId}`);
    
    // Validate session exists
    const session = await prisma.session.findFirst({
      where: { videoRoomId: roomId }
    });

    if (!session) {
      socket.emit('error', { message: 'Invalid session code' });
      return;
    }

    // Join the room
    socket.join(roomId);
    
    // Track users in room
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Set());
    }
    roomUsers.get(roomId).add(socket.id);

    // Notify others in room
    socket.to(roomId).emit('user-connected', {
      userId,
      userName,
      socketId: socket.id
    });

    // Send current room members to newly joined user
    const roomSockets = Array.from(roomUsers.get(roomId));
    socket.emit('room-users', {
      users: roomSockets.filter(id => id !== socket.id)
    });

    console.log(`Room ${roomId} now has ${roomUsers.get(roomId).size} users`);
  });

  // ✅ WebRTC offer (caller sends to callee)
  socket.on('offer', ({ offer, roomId, targetSocketId }) => {
    console.log('📤 Sending offer to room:', roomId);
    if (targetSocketId) {
      // Send to specific user
      socket.to(targetSocketId).emit('offer', { offer, fromSocketId: socket.id });
    } else {
      // Broadcast to room
      socket.to(roomId).emit('offer', { offer, fromSocketId: socket.id });
    }
  });

  // ✅ WebRTC answer (callee responds to caller)
  socket.on('answer', ({ answer, roomId, targetSocketId }) => {
    console.log('📥 Sending answer to room:', roomId);
    if (targetSocketId) {
      socket.to(targetSocketId).emit('answer', { answer, fromSocketId: socket.id });
    } else {
      socket.to(roomId).emit('answer', { answer, fromSocketId: socket.id });
    }
  });

  // ✅ ICE candidate exchange
  socket.on('ice-candidate', ({ candidate, roomId, targetSocketId }) => {
    if (targetSocketId) {
      socket.to(targetSocketId).emit('ice-candidate', { candidate, fromSocketId: socket.id });
    } else {
      socket.to(roomId).emit('ice-candidate', { candidate, fromSocketId: socket.id });
    }
  });

  // ✅ Handle user leaving room
  socket.on('leave-room', async (roomId) => {
    console.log(`👋 User ${socket.id} leaving room: ${roomId}`);
    socket.leave(roomId);

    // Remove from room tracking
    if (roomUsers.has(roomId)) {
      roomUsers.get(roomId).delete(socket.id);
      
      // Notify others
      socket.to(roomId).emit('user-disconnected', { socketId: socket.id });

      // Check if room is empty
      if (roomUsers.get(roomId).size === 0) {
        roomUsers.delete(roomId);
        
        // Auto-complete session
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
    }
  });

  // ✅ Handle disconnect
  socket.on('disconnect', async () => {
    console.log('❌ User disconnected:', socket.id);

    // Find all rooms this socket was in
    for (const [roomId, users] of roomUsers.entries()) {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        
        // Notify others
        socket.to(roomId).emit('user-disconnected', { socketId: socket.id });

        // If room empty, complete session
        if (users.size === 0) {
          roomUsers.delete(roomId);
          
          try {
            const session = await prisma.session.findFirst({
              where: { videoRoomId: roomId }
            });

            if (session && session.status === 'CONFIRMED') {
              await prisma.session.update({
                where: { id: session.id },
                data: { status: 'COMPLETED' }
              });
              console.log(`✅ Session ${session.id} auto-completed on disconnect`);
            }
          } catch (error) {
            console.error('❌ Error auto-completing session:', error);
          }
        }
      }
    }
  });
});

// Start server
server.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.IO ready for WebRTC`);
});
