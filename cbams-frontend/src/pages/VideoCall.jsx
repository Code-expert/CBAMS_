import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Loader2 } from 'lucide-react';

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  // WebRTC Configuration
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    initializeCall();
    return () => cleanup();
  }, [roomId, user]);

  const initializeCall = async () => {
    try {
      // Initialize media first
      await initializeMedia();

      // Connect to Socket.IO
      const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5
      });

      setupSocketListeners();
      setIsConnecting(false);
    } catch (error) {
      console.error('❌ Initialization error:', error);
      setIsConnecting(false);
    }
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('❌ Error accessing media devices:', error);
      alert('Could not access camera/microphone. Please grant permissions and reload.');
      throw error;
    }
  };

  const setupSocketListeners = () => {
    socketRef.current.on('connect', () => {
      console.log('✅ Connected to signaling server');
      socketRef.current.emit('join-room', {
        roomId,
        userId: user.id,
        userName: user.name
      });
    });

    socketRef.current.on('user-connected', ({ userId, userName, socketId }) => {
      console.log(`📹 ${userName} joined - creating offer`);
      createPeerConnection(socketId);
      createOffer(socketId);
    });

    socketRef.current.on('offer', async ({ offer, fromSocketId }) => {
      console.log('📥 Received offer');
      await handleOffer(offer, fromSocketId);
    });

    socketRef.current.on('answer', async ({ answer }) => {
      console.log('📥 Received answer');
      await handleAnswer(answer);
    });

    socketRef.current.on('ice-candidate', async ({ candidate }) => {
      console.log('📥 Received ICE candidate');
      await handleNewICECandidate(candidate);
    });

    socketRef.current.on('user-disconnected', ({ socketId }) => {
      console.log('👋 User disconnected');
      handleUserDisconnected();
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
      setIsConnected(false);
    });
  };

  const createPeerConnection = (targetSocketId) => {
    try {
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to peer connection
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current);
      });

      // Handle incoming tracks
      peerConnection.ontrack = (event) => {
        console.log('📺 Received remote track');
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setIsConnected(true);
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('📤 Sending ICE candidate');
          socketRef.current.emit('ice-candidate', {
            candidate: event.candidate,
            roomId,
            targetSocketId
          });
        }
      };

      // Monitor connection state
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
        } else if (['disconnected', 'failed', 'closed'].includes(peerConnection.connectionState)) {
          setIsConnected(false);
        }
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
      };

    } catch (error) {
      console.error('❌ Error creating peer connection:', error);
    }
  };

  const createOffer = async (targetSocketId) => {
    try {
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true
      });
      await peerConnectionRef.current.setLocalDescription(offer);
      
      console.log('📤 Sending offer');
      socketRef.current.emit('offer', {
        offer,
        roomId,
        targetSocketId
      });
    } catch (error) {
      console.error('❌ Error creating offer:', error);
    }
  };

  const handleOffer = async (offer, fromSocketId) => {
    try {
      createPeerConnection(fromSocketId);
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      console.log('📤 Sending answer');
      socketRef.current.emit('answer', {
        answer,
        roomId,
        targetSocketId: fromSocketId
      });
    } catch (error) {
      console.error('❌ Error handling offer:', error);
    }
  };

  const handleAnswer = async (answer) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('❌ Error handling answer:', error);
    }
  };

  const handleNewICECandidate = async (candidate) => {
    try {
      if (peerConnectionRef.current && candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('❌ Error adding ICE candidate:', error);
    }
  };

  const handleUserDisconnected = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setIsConnected(false);
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    cleanup();
    navigate('/consultations');
  };

  const cleanup = () => {
    console.log('🧹 Cleaning up...');
    
    // Stop all media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId);
      socketRef.current.disconnect();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm text-white p-4 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Session Code</p>
            <p className="font-mono text-2xl font-bold text-green-400">{roomId}</p>
          </div>
          <div className="flex items-center gap-3">
            {isConnecting && (
              <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Connecting...</span>
              </div>
            )}
            {!isConnecting && !isConnected && (
              <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Waiting for participant...</span>
              </div>
            )}
            {isConnected && (
              <div className="flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-6">
        <div className="h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Remote Video */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-700">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!isConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-lg">
                  ?
                </div>
                <p className="text-white text-xl font-semibold">Waiting for connection...</p>
                <p className="text-gray-400 text-sm mt-2">Share code: <span className="font-mono font-bold text-green-400">{roomId}</span></p>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">Remote User</p>
            </div>
          </div>

          {/* Local Video */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-green-500">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">You ({user?.name})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/90 backdrop-blur-sm p-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-4">
          <button
            onClick={toggleMute}
            className={`p-5 rounded-full transition-all shadow-lg ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-5 rounded-full transition-all shadow-lg ${
              isVideoOff 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <VideoIcon className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={endCall}
            className="p-5 rounded-full bg-red-600 hover:bg-red-700 transition-all shadow-lg"
            title="End call"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
