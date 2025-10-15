import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const VideoCall = () => {
  const { roomId } = useParams();

  useEffect(() => {
    // Initialize WebRTC here
    console.log('Room ID:', roomId);
  }, [roomId]);

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">
        <h1 className="text-3xl mb-4">Video Call Room: {roomId}</h1>
        <p>WebRTC implementation coming soon...</p>
        <p className="text-sm text-gray-400 mt-4">
          For now, you can implement WebRTC using your webrtc-test.html code
        </p>
      </div>
    </div>
  );
};

export default VideoCall;
