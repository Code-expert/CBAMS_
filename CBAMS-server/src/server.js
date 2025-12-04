import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['https://cbams.vercel.app', 'http://localhost:5173', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Join video call room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`📹 User ${socket.id} joined room: ${roomId}`);

    const room = io.sockets.adapter.rooms.get(roomId);
    const numClients = room ? room.size : 0;

    if (numClients === 2) {
      // Notify both that the room is ready (client will decide who calls)
      io.to(roomId).emit('room-ready');
      // Optional: also keep old event if you still use it
      socket.to(roomId).emit('user-connected', socket.id);
    }
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

  // Handle user leaving room
  socket.on('leave-room', async (roomId) => {
    console.log(`👋 User ${socket.id} leaving room: ${roomId}`);
    socket.leave(roomId);

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
          console.log(`✅ Session ${session.id} (Room: ${roomId}) auto-completed`);
        }
      } catch (error) {
        console.error('❌ Error auto-completing session:', error);
      }
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log('❌ User disconnected:', socket.id);

    const rooms = Array.from(socket.rooms);

    for (const roomId of rooms) {
      if (roomId === socket.id) continue;

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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('🔌 Socket.IO ready for WebRTC');
});
