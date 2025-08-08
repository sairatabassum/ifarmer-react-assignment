'use client';

import { Button } from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import type { RootState } from '@/redux/store';
import { Home, Play, Refresh, RefreshCircle } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import React, { memo } from 'react';
import {
  nextRound,
  resetBoard,
  restartMatch,
} from '../../../redux/slices/gameSlice';

const GameControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const match = useAppSelector((state: RootState) => state.game.current_match);

  if (!match) return null;

  const { rounds, running_round: currentRound, total_rounds: totalRounds, final_winner } = match;

  const isCurrentRoundComplete = rounds.some(
    (round) => round.round_num === currentRound
  );

  const handleResetCurrentRound = () => dispatch(resetBoard());
  const handleNextRound = () => dispatch(nextRound());
  const handleResetGame = () => dispatch(restartMatch());
  const handleBackToHome = () => router.push('/');

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {isCurrentRoundComplete && !final_winner?.player && currentRound <= totalRounds && (
        <Button onClick={handleNextRound} className="bg-gradient-primary text-primary-foreground">
          <Play className="h-4 w-4 mr-2" />
          Next Round
        </Button>
      )}

      {!isCurrentRoundComplete && !final_winner?.player && (
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

export default memo(GameControls);
