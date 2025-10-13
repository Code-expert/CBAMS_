import { Server as IOServer } from "socket.io";
import mediasoup from "mediasoup";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let worker;
const rooms = new Map(); // sessionId -> { router, peers }

async function initMediasoupWorker() {
  worker = await mediasoup.createWorker({
    rtcMinPort: 10000,
    rtcMaxPort: 10100,
    logLevel: "warn",
    logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
  });

  console.log("Mediasoup worker started");

  worker.on("died", () => {
    console.error("Mediasoup worker died. Restarting...");
    setTimeout(() => process.exit(1), 2000);
  });
}

// Utility function to update session status in DB
async function updateSessionStatus(sessionId, status) {
  await prisma.session.update({
    where: { id: Number(sessionId) },
    data: { status },
  });
}

export async function setupWebRTC(server) {
  await initMediasoupWorker();

  const io = new IOServer(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("🔗 New client connected:", socket.id);

    // Join room
    socket.on("join-room", async ({ sessionId, userId }) => {
      if (!sessionId || !userId) return socket.emit("error", "Missing sessionId or userId");

      const session = await prisma.session.findUnique({
        where: { id: Number(sessionId) },
        include: { farmer: true, expert: true },
      });

      if (!session) return socket.emit("error", "Session not found");

      if (![session.farmerId, session.expertId].includes(userId))
        return socket.emit("error", "You are not authorized");

      if (session.status == 'COMPLETED') {
        return socket.emit("error", "This session has already been completed and cannot be joined");
      }

      let room = rooms.get(sessionId);
      if (!room) {
        const router = await worker.createRouter({
          mediaCodecs: [
            { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
            { kind: "video", mimeType: "video/VP8", clockRate: 90000 },
          ],
        });
        room = { router, peers: new Map() };
        rooms.set(sessionId, room);
        console.log(`Created new room for session: ${sessionId}`);
      }

      room.peers.set(socket.id, { socket, userId, transports: new Map(), producers: new Map() });
      socket.join(sessionId);

      socket.emit("joined-room", { sessionId });
    });

    // Simple WebRTC signaling
    socket.on("offer", ({ sdp, sessionId, userId }) => {
      socket.to(sessionId).emit("offer", { sdp, fromUserId: userId });
    });

    socket.on("answer", ({ sdp, sessionId }) => {
      socket.to(sessionId).emit("answer", { sdp });
    });

    socket.on("ice-candidate", ({ candidate, sessionId }) => {
      socket.to(sessionId).emit("ice-candidate", { candidate });
    });

    // Leave room
    socket.on("leave-room", async ({ sessionId, userId }) => {
      const room = rooms.get(sessionId);
      if (room) {
        room.peers.delete(socket.id);
        socket.leave(sessionId);
        console.log(`User ${userId} left session ${sessionId}`);

        // If expert leaves, mark session completed
        const isExpert = (await prisma.session.findUnique({ where: { id: Number(sessionId) } })).expertId === userId;
        if (isExpert) {
          await updateSessionStatus(sessionId, "COMPLETED");
          io.to(sessionId).emit("session-completed", { sessionId });
        }

        if (room.peers.size === 0) {
          room.router.close();
          rooms.delete(sessionId);
          console.log(`Cleaned up empty session ${sessionId}`);
        }
      }
    });

    // Disconnect
    socket.on("disconnect", async () => {
      for (const [sessionId, room] of rooms.entries()) {
        if (room.peers.has(socket.id)) {
          const peer = room.peers.get(socket.id);
          room.peers.delete(socket.id);
          console.log(`User ${peer.userId} disconnected from session ${sessionId}`);

          // If expert disconnected, mark session completed
          const session = await prisma.session.findUnique({ where: { id: Number(sessionId) } });
          if (session && peer.userId === session.expertId) {
            await updateSessionStatus(sessionId, "completed");
            io.to(sessionId).emit("session-completed", { sessionId });
          }

          if (room.peers.size === 0) {
            room.router.close();
            rooms.delete(sessionId);
            console.log(`Cleaned up empty session ${sessionId}`);
          }
        }
      }
    });
  });

  console.log("WebRTC + Socket.IO ready");
}