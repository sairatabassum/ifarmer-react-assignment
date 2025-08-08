'use client';

import { useAppSelector } from '@/hooks/redux';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import GameControls from './GameControls';
import VictoryScreen from '../result/page'; // Import the VictoryScreen component

const Game = () => {
  const match = useAppSelector((state) => state.game.current_match);

  // If there's no active match, display a message or a loading state.
  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center text-muted-foreground">
        <p>No active game. Please start a new match from the home screen.</p>
      </div>
    );
  }

  // Determine if the game is over by checking the final_winner or result.
  // The 'result' being 0 indicates a tie, while a non-null 'final_winner.player' indicates a win.
  const isGameOver = match.final_winner.player !== null || match.result === 0;

  return (
    <div className="min-h-screen bg-background p-4 relative">
      {/* Conditionally render the VictoryScreen as a full-screen overlay */}
      {isGameOver && <VictoryScreen />}

      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Tic-Tac-Toe
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex justify-center">
            <GameBoard />
          </div>
          <div className="space-y-4">
            <GameStatus />
          </div>
        </div>

        <div className="text-center">
          <GameControls />
        </div>
      </div>
    </div>
  );
};

export default Game;