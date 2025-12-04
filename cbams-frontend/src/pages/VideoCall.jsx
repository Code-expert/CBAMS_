import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { PhoneOff, Video, User } from 'lucide-react';

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  const [isWaiting, setIsWaiting] = useState(true);

  // Use your backend URL (same as VITE_API_URL)
  const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // 1. Connect socket
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    // 2. Join room
    socketRef.current.emit('join-room', roomId);

    // 3. Someone else joined the room
    socketRef.current.on('user-connected', (otherSocketId) => {
      // This client becomes caller and creates offer
      setIsWaiting(false);
      createPeerConnection();
      createOffer(roomId);
    });

    // 4. Receive offer → this client is callee
    socketRef.current.on('offer', async (offer) => {
      setIsWaiting(false);
      createPeerConnection();
      await peerRef.current.setRemoteDescription(offer);
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      socketRef.current.emit('answer', answer, roomId);
    });

    // 5. Receive answer
    socketRef.current.on('answer', async (answer) => {
      await peerRef.current.setRemoteDescription(answer);
    });

    // 6. Receive ICE candidate
    socketRef.current.on('ice-candidate', async (candidate) => {
      try {
        await peerRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.error('Error adding received ice candidate', err);
      }
    });

    // 7. Get local media
    initMedia();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-room', roomId);
        socketRef.current.disconnect();
      }
      if (peerRef.current) {
        peerRef.current.close();
      }
    };
  }, [roomId]);

  const initMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error getting user media', err);
    }
  };

  const createPeerConnection = () => {
    if (peerRef.current) return;

    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', event.candidate, roomId);
      }
    };

    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Add local tracks
    const localStream = localVideoRef.current?.srcObject;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peer.addTrack(track, localStream);
      });
    }

    peerRef.current = peer;
  };

  const createOffer = async (roomId) => {
    try {
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      socketRef.current.emit('offer', offer, roomId);
    } catch (err) {
      console.error('Error creating offer', err);
    }
  };

  const handleEndCall = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId);
      socketRef.current.disconnect();
    }
    if (peerRef.current) {
      peerRef.current.close();
    }
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-black rounded-xl overflow-hidden relative">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-white/10 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <User className="w-3 h-3" /> You
          </div>
        </div>
        <div className="bg-black rounded-xl overflow-hidden relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-64 md:h-80 object-cover"
          />
          {isWaiting && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
              Waiting for other participant...
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleEndCall}
          className="px-4 py-2 rounded-full bg-red-600 text-white flex items-center gap-2 hover:bg-red-700"
        >
          <PhoneOff className="w-4 h-4" />
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
