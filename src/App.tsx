/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black flex flex-col font-mono crt-flicker selection:bg-fuchsia-600 selection:text-cyan-300 overflow-hidden relative text-white">
      {/* Noise and Scanlines */}
      <div className="static-noise" />
      <div className="scanline" />

      {/* Header */}
      <header className="w-full p-4 flex flex-col md:flex-row justify-between items-center z-10 relative border-b-4 border-fuchsia-600 bg-black backdrop-blur-none">
        <div className="flex items-center gap-4">
          <Terminal className="text-cyan-400" size={40} />
          <h1 
            data-text="SYS.OP. NEON_SERPENT"
            className="text-4xl text-white glitch font-bold tracking-widest uppercase relative"
          >
            SYS.OP. NEON_SERPENT
          </h1>
        </div>
        <div className="mt-4 md:mt-0 font-mono text-xl uppercase tracking-widest text-[#00FFFF] bg-[#FF00FF] px-2 py-1">
          STATUS: ANOMALY DESTECTED
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 gap-8 relative z-10 w-full max-w-full">
        {/* Game Console */}
        <div className="flex-1 flex justify-center items-center w-full min-w-0 border-4 border-cyan-400 bg-black p-4 relative shadow-[8px_8px_0_#FF00FF]">
          <div className="absolute top-0 right-0 bg-cyan-400 text-black px-2 py-1 text-sm font-bold">PID: 0x8F9A</div>
          <SnakeGame />
        </div>

        {/* Music Player Side */}
        <div className="w-full lg:w-96 flex flex-col justify-center gap-8">
          <div className="p-6 bg-black border-4 border-[#FF00FF] shadow-[-8px_8px_0_#00FFFF] flex flex-col items-start gap-4 relative overflow-hidden">
            <h3 className="text-[#00FFFF] text-2xl font-bold tracking-widest uppercase border-b-2 border-[#00FFFF] w-full pb-2">
              NEURAL_AUDIO_LINK
            </h3>
            <p className="text-white text-lg font-mono uppercase bg-[#FF00FF] text-black px-2 w-full">
              WARNING: AUDIO INJECTION AUTHORIZED.
            </p>
            <p className="text-white text-md uppercase">
              MAINTAIN SYNAPTIC RHYTHM. DO NOT DEVIATE FROM THE GRID.
            </p>
          </div>
          
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
