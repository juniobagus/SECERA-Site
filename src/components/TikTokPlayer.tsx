import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface TikTokPlayerProps {
  videoId: string;
  isActive: boolean;
}

export default function TikTokPlayer({ videoId, isActive }: TikTokPlayerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Synchronize playback state with isActive prop
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      // Toggle mute based on active state and user preference
      const muteMessage = {
        'x-tiktok-player': true,
        type: isActive && !isMuted ? 'unmute' : 'mute'
      };
      iframeRef.current.contentWindow.postMessage(muteMessage, '*');
      
      // We send play command to ensure it's running, 
      // but we do it slightly after to avoid state conflicts
      const playMessage = {
        'x-tiktok-player': true,
        type: 'play'
      };
      iframeRef.current.contentWindow.postMessage(playMessage, '*');
    }
  }, [isActive, isMuted]);

  // Kita gunakan satu URL tetap agar tidak reload
  // Kita set muted=1 di awal karena kebijakan autoplay browser
  const embedUrl = `https://www.tiktok.com/player/v1/${videoId}?autoplay=1&muted=1&loop=1&controls=0`;

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (iframeRef.current?.contentWindow) {
      // TikTok player v1 requires the 'x-tiktok-player' flag in the message object
      const message = {
        'x-tiktok-player': true,
        type: newMuted ? 'mute' : 'unmute'
      };
      
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
      {/* Skeleton / Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>

      <div className="w-full h-full relative">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full border-none pointer-events-none"
          allow="autoplay; fullscreen; accelerometer; gyroscope; encrypted-media; picture-in-picture; web-share; unload"
          title="TikTok Video Player"
          sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"
        />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transition-colors pointer-events-auto"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </motion.button>

        <motion.div 
          animate={{ 
            opacity: isActive ? 0.4 : 1,
            y: isActive ? 0 : -10
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <h3 className="text-2xl font-bold text-white tracking-tighter font-sans uppercase drop-shadow-2xl">secera</h3>
        </motion.div>
      </div>
    </div>
  );
}
