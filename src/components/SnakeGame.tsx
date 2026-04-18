import React, { useState, useEffect, useRef, useCallback } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 100;
const SPEED_INCREMENT = 4;
const MIN_SPEED = 50;

const getCenter = () => Math.floor(GRID_SIZE / 2);

const randomFoodPosition = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([
    { x: getCenter(), y: getCenter() },
    { x: getCenter(), y: getCenter() + 1 },
    { x: getCenter(), y: getCenter() + 2 }
  ]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef<Point>({ x: 0, y: -1 });
  const nextDirectionQueueRef = useRef<Point[]>([]);
  const gameLoopRef = useRef<number | null>(null);

  const resetGame = () => {
    const initialSnake = [
      { x: getCenter(), y: getCenter() },
      { x: getCenter(), y: getCenter() + 1 },
      { x: getCenter(), y: getCenter() + 2 }
    ];
    setSnake(initialSnake);
    directionRef.current = { x: 0, y: -1 };
    nextDirectionQueueRef.current = [];
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(randomFoodPosition(initialSnake));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    
    if (isGameOver) {
      if (e.key === 'Enter' || e.key === ' ') resetGame();
      return;
    }

    if (e.key === ' ') {
      setIsPaused(prev => !prev);
      return;
    }

    const lastDir = nextDirectionQueueRef.current.length > 0 
      ? nextDirectionQueueRef.current[nextDirectionQueueRef.current.length - 1]
      : directionRef.current;

    let newDir: Point | null = null;
    if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && lastDir.y !== 1) newDir = { x: 0, y: -1 };
    if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && lastDir.y !== -1) newDir = { x: 0, y: 1 };
    if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && lastDir.x !== 1) newDir = { x: -1, y: 0 };
    if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && lastDir.x !== -1) newDir = { x: 1, y: 0 };

    if (newDir && nextDirectionQueueRef.current.length < 3) {
      nextDirectionQueueRef.current.push(newDir);
    }
  }, [isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      let currDir = directionRef.current;
      if (nextDirectionQueueRef.current.length > 0) {
        currDir = nextDirectionQueueRef.current.shift()!;
        directionRef.current = currDir;
      }

      const head = prevSnake[0];
      const newHead = {
        x: head.x + currDir.x,
        y: head.y + currDir.y
      };

      // Wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        setFood(randomFoodPosition(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused]);

  useEffect(() => {
    gameLoopRef.current = window.setInterval(moveSnake, speed);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, speed]);

  return (
    <div className="flex flex-col items-center w-full max-w-[600px] bg-black">
      <div className="flex justify-between w-full mb-4 px-2 py-4 border-4 border-cyan-400 bg-black">
        <div className="font-mono text-3xl text-[#FF00FF] bg-black px-2 shadow-[4px_4px_0_#00FFFF]">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
        <div className={`font-mono text-3xl px-2 shadow-[4px_4px_0_#FF00FF] ${isPaused ? 'text-black bg-cyan-400 animate-pulse' : 'text-cyan-400 bg-black'}`}>
          {isPaused ? 'HALTED' : 'ACTIVE'}
        </div>
      </div>
      
      <div 
        className={`relative w-full aspect-square bg-black border-4 border-[#FF00FF] shadow-[-8px_8px_0_#00FFFF] overflow-hidden ${isGameOver ? 'glitch-box' : ''}`}
      >
        {/* Intense Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.4)_1px,transparent_1px)] bg-[size:5%_5%]" />

        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={index}
              className={`absolute transition-none ${
                isHead 
                  ? 'bg-[#00FFFF] z-10 border-2 border-white' 
                  : 'bg-[#FF00FF] opacity-90 border border-black'
              }`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
              }}
            />
          );
        })}

        <div
          className="absolute bg-white border-2 border-black"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            boxShadow: '0 0 15px #FF00FF, 0 0 30px #00FFFF',
            animation: 'glitch-anim-1 0.4s infinite linear alternate-reverse'
          }}
        />

        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 crt-flicker border-4 border-red-600">
            <h2 className="text-6xl font-black text-red-600 mb-4 glitch crt-flicker tracking-widest text-center" data-text="FATAL ERROR">
              FATAL ERROR
            </h2>
            <p className="text-white mb-8 font-mono text-2xl uppercase border-y-4 border-[#FF00FF] py-2">
              SECTOR COMPROMISED. SCORE: {score}
            </p>
            <button 
              onClick={(e) => { e.currentTarget.blur(); resetGame(); }}
              className="px-8 py-4 bg-transparent border-4 border-cyan-400 text-cyan-400 font-mono text-2xl font-bold hover:bg-cyan-400 hover:text-black uppercase tracking-widest focus:outline-none"
            >
              RUN DIAGNOSTICS_
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4 text-white font-mono text-lg uppercase tracking-widest justify-center">
        <span className="flex items-center"><kbd className="bg-[#FF00FF] text-black px-2 py-1 border-2 border-white mr-2">WASD</kbd> INTERFACE</span>
        <span className="flex items-center"><kbd className="bg-cyan-400 text-black px-2 py-1 border-2 border-white mr-2">SPACE</kbd> HALT</span>
      </div>
      
      <style>{`
        .glitch-box {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          transform: translate3d(0, 0, 0);
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-2px, 0, 0); }
          20%, 80% { transform: translate3d(4px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
          40%, 60% { transform: translate3d(6px, 0, 0); }
        }
      `}</style>
    </div>
  );
}
