import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'CORRUPTED.WAV',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    id: 2,
    title: 'ERR:0x000F',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3'
  },
  {
    id: 3,
    title: 'MEM.DUMP',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3'
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full bg-black border-4 border-cyan-400 p-6 shadow-[8px_8px_0_#FF00FF] relative">
      <div className="absolute top-0 right-0 bg-[#FF00FF] text-black px-2 py-1 text-sm font-bold animate-pulse">
        [AUDIO STIMULANT]
      </div>

      <div className="flex items-center space-x-4 mb-6 mt-4 border-b-4 border-cyan-400 pb-4">
        <div className="w-16 h-16 flex-shrink-0 bg-[#FF00FF] flex items-center justify-center border-2 border-black">
          <Music className={`text-black ${isPlaying ? 'animate-bounce' : ''}`} size={32} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-black bg-cyan-400 inline-block px-2 font-bold tracking-widest uppercase text-xl mb-1">
            EXE: {isPlaying ? 'RUNNING' : 'HALTED'}
          </h3>
          <p className="text-[#FF00FF] font-mono text-2xl truncate glitch" data-text={TRACKS[currentTrackIndex].title}>
            {TRACKS[currentTrackIndex].title}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-6">
        <button 
          onClick={handlePrev}
          className="p-3 bg-black border-4 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-none focus:outline-none focus:bg-cyan-400 focus:text-black"
        >
          <SkipBack size={24} />
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-4 bg-black border-4 border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-none focus:outline-none focus:bg-[#FF00FF] focus:text-black"
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <button 
          onClick={handleNext}
          className="p-3 bg-black border-4 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-none focus:outline-none focus:bg-cyan-400 focus:text-black"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Visualizer pseudo-element */}
      <div className="mt-8 flex justify-between items-end h-16 space-x-2 border-t-2 border-cyan-400 pt-2">
        {[...Array(16)].map((_, i) => (
          <div 
            key={i} 
            className="w-full bg-[#FF00FF]"
            style={{ 
              height: isPlaying ? `${10 + Math.random() * 90}%` : '10%',
              animation: isPlaying ? `glitch-bar ${0.1 + Math.random() * 0.3}s infinite alternate` : 'none',
              transform: isPlaying && Math.random() > 0.8 ? `translateY(${Math.random() * 10}px)` : 'none'
            }}
          />
        ))}
      </div>

      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrackIndex].src} 
        onEnded={handleNext}
        className="hidden"
      />

      <style>{`
        @keyframes glitch-bar {
          0% { height: 10%; background-color: #00FFFF; }
          50% { height: 100%; background-color: #FF00FF; }
          100% { height: 40%; background-color: #00FFFF; }
        }
      `}</style>
    </div>
  );
}
