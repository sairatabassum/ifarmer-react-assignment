'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Button } from '@/components/common/Button';
import { Refresh, Play, Home, RefreshCircle } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { resetBoard, restartMatch, nextRound } from '../../../redux/slices/gameSlice';
import type { Match } from '../../../app/assignment-1/types/game';

const GameControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const match = useAppSelector((state) => state.game.current_match) as Match | null;
  if (!match) return null;

  // Check if the current round is complete
  const isCurrentRoundComplete = match.rounds.some(
    (round) => round.round_num === match.running_round
  );

  const finalWinner = match.final_winner.player;
  const { running_round: currentRound, total_rounds: totalRounds } = match;

  const handleResetCurrentRound = () => dispatch(resetBoard());
  const handleNextRound = () => dispatch(nextRound());
  const handleResetGame = () => dispatch(restartMatch());
  const handleBackToHome = () => router.push('/');

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {isCurrentRoundComplete && !finalWinner && currentRound <= totalRounds && (
        <Button onClick={handleNextRound} className="bg-gradient-primary text-primary-foreground">
          <Play className="h-4 w-4 mr-2" />
          Next Round
        </Button>
      )}

      {!isCurrentRoundComplete && !finalWinner && (
        <Button onClick={handleResetCurrentRound} variant="outline">
          <RefreshCircle className="h-4 w-4 mr-2" />
          Reset Round
        </Button>
      )}

      <Button onClick={handleResetGame} variant="outline">
        <Refresh className="h-4 w-4 mr-2" />
        New Game
      </Button>

      <Button onClick={handleBackToHome} variant="outline">
        <Home className="h-4 w-4 mr-2" />
        Home
      </Button>
    </div>
  );
};

export default GameControls;
