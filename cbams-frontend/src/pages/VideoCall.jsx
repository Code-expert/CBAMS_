// VideoCall.jsx - COMPLETE FIXED VERSION
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { PhoneOff, Video, User, Mic, Camera, MicOff, VideoOff } from 'lucide-react';

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);

  const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://cbams-1-6v7m.onrender.com';

  // Cleanup function
  const cleanup = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId);
      socketRef.current.disconnect();
    }
    if (peerRef.current) {
      peerRef.current.close();
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
  }, [roomId]);

  useEffect(() => {
    // 1. Connect socket
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      timeout: 20000,
      auth: {
        token: localStorage.getItem('token')
      }
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current.id);
      socketRef.current.emit('join-room', { roomId, sessionId: roomId });
    });

    // 2. Handle other user joining (become caller)
    socketRef.current.on('user-connected', () => {
      setIsWaiting(false);
      setIsConnected(true);
      createPeerConnection();
      createOffer();
    });

    // 3. Receive offer (become callee)
    socketRef.current.on('offer', async (offer) => {
      console.log('📥 Received offer');
      setIsWaiting(false);
      await createPeerConnection();
      await peerRef.current.setRemoteDescription(offer);
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      socketRef.current.emit('answer', answer, roomId);
    });

    // 4. Receive answer
    socketRef.current.on('answer', async (answer) => {
      console.log('📥 Received answer');
      await peerRef.current.setRemoteDescription(answer);
    });

    // 5. ICE candidates
    socketRef.current.on('ice-candidate', async (candidate) => {
      try {
        if (peerRef.current && !peerRef.current.remoteDescription) return;
        await peerRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.error('ICE candidate error:', err);
      }
    });

    // Initialize media
    initMedia();

    return () => {
      cleanup();
    };
  }, [roomId, cleanup]);

  const initMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Media error:', err);
      alert('Please allow camera and microphone access');
    }
  };

  const createPeerConnection = async () => {
    if (peerRef.current) return;

    peerRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Handle remote stream
    peerRef.current.ontrack = (event) => {
      console.log('📹 Remote stream received');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      setIsConnected(true);
    };

    // Send ICE candidates
    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', event.candidate, roomId);
      }
    };

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerRef.current.addTrack(track, localStreamRef.current);
      });
    }
  };

  const createOffer = async () => {
    try {
      const offer = await peerRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await peerRef.current.setLocalDescription(offer);
      socketRef.current.emit('offer', offer, roomId);
    } catch (err) {
      console.error('Offer error:', err);
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleEndCall = () => {
    cleanup();
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-6xl">
        {/* Video Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Remote Video */}
          <div className="relative bg-black/50 rounded-3xl overflow-hidden shadow-2xl">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-96 lg:h-[500px] object-cover rounded-3xl"
            />
            {isWaiting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-3xl">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Waiting for expert...</h3>
                <p className="text-gray-400">Room: <span className="font-mono bg-white/20 px-3 py-1 rounded-full text-lg">{roomId}</span></p>
              </div>
            )}
            {!isConnected && !isWaiting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-3xl">
                <div className="text-center">
                  <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-400">No video connection</p>
                </div>
              </div>
            )}
          </div>

          {/* Local Video */}
          <div className="relative bg-black/30 rounded-2xl overflow-hidden shadow-xl order-first lg:order-last">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 lg:h-64 object-cover rounded-2xl"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-xl text-sm flex items-center gap-1">
              <User className="w-4 h-4" />
              You {isMuted && <MicOff className="w-4 h-4 ml-1" />}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center items-center max-w-2xl mx-auto">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full shadow-lg transition-all ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full shadow-lg transition-all ${
              isVideoOff 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>

          <button
            onClick={handleEndCall}
            className="p-4 bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition-all w-16 h-16 flex items-center justify-center"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Room Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-2">Room ID: <span className="font-mono bg-white/20 px-3 py-1 rounded-full text-lg">{roomId}</span></p>
          <p className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
            {isConnected ? '✅ Connected' : '⏳ Connecting...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;

