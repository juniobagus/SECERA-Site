import { useRef, useState, useEffect, type MouseEvent } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import TikTokPlayer from './TikTokPlayer';

interface UGCPlayerProps {
  videoUrl: string;
  thumbnail?: string;
  isActive: boolean;
}

const getTikTokId = (url: string) => {
  const match = url.match(/\/video\/(\d+)/);
  if (match) return match[1];
  const matchV = url.match(/\/v\/(\d+)/);
  return matchV ? matchV[1] : null;
};

function CustomVideoPlayer({ src, poster, isActive }: { src: string; poster?: string; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch((e) => console.log('Autoplay blocked', e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        className="w-full h-full object-cover"
        poster={poster}
        defaultValue={undefined}
      >
        <source src={src} type="video/mp4" />
      </video>
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMute}
        className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 border border-white/30 transition-colors outline-none"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </motion.button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-40">
        <h3 className="text-xl font-bold text-white tracking-tighter font-sans uppercase">secera</h3>
      </div>
    </>
  );
}

export default function UGCPlayer({ videoUrl, thumbnail, isActive }: UGCPlayerProps) {
  const tiktokId = getTikTokId(videoUrl);

  return (
    <div className="relative aspect-[9/16] bg-paper mb-1 overflow-hidden shadow-sm">
      {tiktokId ? (
        <TikTokPlayer videoId={tiktokId} isActive={isActive} />
      ) : (
        <CustomVideoPlayer src={videoUrl} poster={thumbnail} isActive={isActive} />
      )}
    </div>
  );
}
