"use client"

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { nextRound } from '../../../redux/slices/gameSlice';
import RoundResultModal from '../../../components/tic-tac-toe/RoundResultModal';
import RoundStartModal from '../../../components/tic-tac-toe/RoundStartModal';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import GameControls from './GameControls';
import CelebrationEmojiRain from '../../../components/tic-tac-toe/CelebrationEmojiRain';
import VictoryScreen from '../result/page';
import { getPlayerName, getWinnerId, isCurrentRoundComplete, isDrawRound } from '../utils/gameStatusUtils';

const Game = () => {
  const match = useAppSelector((state) => state.game.current_match);
  const dispatch = useAppDispatch();

  const [showResultModal, setShowResultModal] = useState(false);
  const [showRoundModal, setShowRoundModal] = useState(false);

  if (!match) {
    return <div className="flex items-center justify-center min-h-screen text-muted-foreground">No active game</div>;
  }

  const isGameOver = match.final_winner.player !== null || match.result === 0;

  const currentRoundComplete = isCurrentRoundComplete(match);
  const winnerId = getWinnerId(match);
  const isDraw = isDrawRound(match);
  const roundWinnerName = winnerId ? getPlayerName(winnerId, match) : null;

  // Handle showing modals automatically after round complete
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentRoundComplete && !isGameOver) {
      let sec = isDraw? 400: 1000;
      timer = setTimeout(() => {
        setShowResultModal(true);
      }, sec);
    } else {
      setShowResultModal(false);
      setShowRoundModal(false);
    }

    return () => clearTimeout(timer);
  }, [currentRoundComplete, isGameOver]);

  const handleResultModalClose = () => {
    setShowResultModal(false);
    setShowRoundModal(true);
  };

  const handleRoundModalClose = () => {
    setShowRoundModal(false);
    dispatch(nextRound());
  };

  return (
    <div className="min-h-screen bg-background p-4 relative">
      {isGameOver && !isDraw && <CelebrationEmojiRain />}
      {isGameOver && <VictoryScreen />}

      {showResultModal && (
        <RoundResultModal
          winnerName={isDraw ? null : roundWinnerName}
          onClose={handleResultModalClose}
        />
      )}

      {showRoundModal && (
        <RoundStartModal
          round={match.running_round + 1} // upcoming round
          onClose={handleRoundModalClose}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">Tic-Tac-Toe</h1>
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
