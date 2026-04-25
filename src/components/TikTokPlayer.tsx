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

  // Track player readiness
  const [isReady, setIsReady] = useState(false);

  // 1. Play Sync
  useEffect(() => {
    if (isReady && iframeRef.current?.contentWindow) {
      // Background play: always play regardless of isActive
      iframeRef.current.contentWindow.postMessage({
        'x-tiktok-player': true,
        type: 'play'
      }, '*');
    }
  }, [isReady]);

  // Determine actual mute state (force mute if inactive)
  const isActuallyMuted = !isActive || isMuted;

  // 2. Mute/UnMute Sync
  useEffect(() => {
    if (isReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        'x-tiktok-player': true,
        type: isActuallyMuted ? 'mute' : 'unMute'
      }, '*');
    }
  }, [isReady, isActuallyMuted]);

  // 3. Sync everything when player becomes ready
  useEffect(() => {
    if (isReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ 'x-tiktok-player': true, type: isActuallyMuted ? 'mute' : 'unMute' }, '*');
      iframeRef.current.contentWindow.postMessage({ 'x-tiktok-player': true, type: 'play' }, '*');
    }
  }, [isReady]);

  // Listen for messages from TikTok player
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from tiktok.com
      if (!event.origin.includes('tiktok.com')) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (data['x-tiktok-player']) {
          if (data.type === 'onPlayerReady') {
            setIsReady(true);
          }
        }
      } catch (e) {
        // Not a JSON message or other error, ignore
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // We no longer track manual pause state
  useEffect(() => {
    // Ensuring it always plays when active
    if (isActive && isReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ 'x-tiktok-player': true, type: 'play' }, '*');
    }
  }, [isActive, isReady]);

  const embedUrl = `https://www.tiktok.com/player/v1/${videoId}?autoplay=1&muted=1&loop=1&volume_control=0&controls=0&volume=100`;

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
  };


  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center group"
    >
      {/* Skeleton / Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>

      <div className="w-full h-full relative">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full border-none pointer-events-none"
          allow="autoplay; fullscreen; accelerometer; gyroscope; encrypted-media; picture-in-picture; web-share"
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
