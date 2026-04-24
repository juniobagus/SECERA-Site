import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface TikTokPlayerProps {
  videoId: string;
  isActive: boolean;
}

export default function TikTokPlayer({ videoId, isActive }: TikTokPlayerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Track player readiness
  const [isReady, setIsReady] = useState(false);

  // 1. Play/Pause Sync
  useEffect(() => {
    if (isReady && iframeRef.current?.contentWindow) {
      const shouldBePlaying = isActive && !isPaused;
      iframeRef.current.contentWindow.postMessage({
        'x-tiktok-player': true,
        type: shouldBePlaying ? 'play' : 'pause'
      }, '*');
    }
  }, [isReady, isActive, isPaused]);

  // 2. Mute/UnMute Sync
  useEffect(() => {
    if (isReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        'x-tiktok-player': true,
        type: isMuted ? 'mute' : 'unMute'
      }, '*');
    }
  }, [isReady, isMuted]);

  // 3. Sync everything when player becomes ready
  useEffect(() => {
    if (isReady && iframeRef.current?.contentWindow) {
      // Send initial states
      iframeRef.current.contentWindow.postMessage({ 'x-tiktok-player': true, type: isMuted ? 'mute' : 'unMute' }, '*');
      iframeRef.current.contentWindow.postMessage({ 'x-tiktok-player': true, type: (isActive && !isPaused) ? 'play' : 'pause' }, '*');
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

  // Reset pause state when becoming active/inactive if needed
  useEffect(() => {
    if (!isActive) {
      setIsPaused(false); // Reset to play when scrolled away so it loops clean
    }
  }, [isActive]);

  const embedUrl = `https://www.tiktok.com/player/v1/${videoId}?autoplay=1&muted=1&loop=1&volume_control=0&controls=0&volume=100`;

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
  };

  const togglePlay = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center cursor-pointer group"
      onClick={togglePlay}
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
          allow="autoplay; fullscreen; accelerometer; gyroscope; encrypted-media; picture-in-picture; web-share; unload"
          title="TikTok Video Player"
          sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"
        />

        {/* Visual feedback for Pause state */}
        <motion.div
          animate={{ opacity: isPaused ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]"
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
            <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </motion.div>
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
