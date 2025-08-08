'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { Button } from '@/components/common/Button';
import cn from '@/utils/cn';
import { completeRound, makeMove } from '../../../redux/slices/gameSlice';
import { checkWinner, isDraw } from '../utils/checkWinner';
import RoundStartModal from '../../../components/tic-tac-toe/RoundStartModal';
import type { PlayerID, Match } from '../../../app/assignment-1/types/game';

const GameBoard: React.FC = () => {
  const dispatch = useAppDispatch();

  const currentMatch = useAppSelector((state) => state.game.current_match) as Match | null;
  const currentTurn = useAppSelector((state) => state.game.current_turn) as PlayerID | null;

  const [winningLine, setWinningLine] = useState<number[][] | null>(null);
  const [winningLineType, setWinningLineType] = useState<string | null>(null);

  if (!currentMatch || !currentTurn) return null;

  const board = currentMatch.current_display;
  const isRoundComplete =
    currentMatch.rounds.length > 0 &&
    currentMatch.rounds[currentMatch.rounds.length - 1].round_num === currentMatch.running_round;

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] !== -1 || isRoundComplete) return;
    dispatch(makeMove({ row, col, playerId: currentTurn }));
  };

  useEffect(() => {
    if (isRoundComplete) return;

    const winnerLine = checkWinner(board);
    const draw = isDraw(board);

    if (winnerLine) {
      const [[r1, c1], [r2, c2]] = winnerLine;
      const winnerCode = board[r1][c1];
      const winnerId =
        winnerCode === 0
          ? currentMatch.participating_players.player_1.id
          : currentMatch.participating_players.player_2.id;

      let lineType = '';
      if (r1 === r2) {
        lineType = `row-${r1}`;
      } else if (c1 === c2) {
        lineType = `col-${c1}`;
      } else if (r1 === c1) {
        lineType = 'diag-1'; // Top-left to bottom-right
      } else {
        lineType = 'diag-2'; // Top-right to bottom-left
      }
      setWinningLineType(lineType);

      dispatch(completeRound({ winnerId, isDraw: false }));
      setWinningLine(winnerLine);
    } else if (draw) {
      dispatch(completeRound({ winnerId: null, isDraw: true }));
      setWinningLine(null);
      setWinningLineType(null);
    }
  }, [board, dispatch, currentMatch, isRoundComplete]);

  useEffect(() => {
    if (!isRoundComplete) {
      setWinningLine(null);
      setWinningLineType(null);
    }
  }, [isRoundComplete]);

  const getCellSymbol = (cell: number): string => {
    if (cell === -1) return '';
    return cell === 0 ? '✕' : '○';
  };

  const getCellVariant = (cell: number): 'ghost' | 'default' | 'secondary' => {
    if (cell === -1) return 'ghost';
    return cell === 0 ? 'default' : 'secondary';
  };

  const isWinningCell = (row: number, col: number): boolean => {
    return winningLine?.some(([r, c]) => r === row && c === col) ?? false;
  };

  return (
    <>
      {currentMatch.running_round > 0 && (
        <RoundStartModal key={currentMatch.running_round} round={currentMatch.running_round} />
      )}

      <div className="grid grid-cols-3 gap-3 p-6 rounded-2xl shadow-game border border-border bg-primary/5 relative">
        {winningLineType && (
          <div
            className={cn(
              "absolute bg-[#b366ec] h-1 rounded-full z-10 origin-left",
              // Horizontal rows
              winningLineType.startsWith('row') &&
              'w-[88%] left-1/2 -translate-x-1/2 animate-draw-line',
              winningLineType === 'row-0' && 'top-[18%]',
              winningLineType === 'row-1' && 'top-1/2 -translate-y-1.5',
              winningLineType === 'row-2' && 'bottom-[19%] -translate-y-1.5',

              // Vertical columns
              winningLineType.startsWith('col') &&
              'h-[88%] top-[49%] -translate-y-1/2 w-1 origin-top animate-draw-vertical',
              winningLineType === 'col-0' && 'left-[19%]',
              winningLineType === 'col-1' && 'left-1/2 -translate-x-1/2',
              winningLineType === 'col-2' && 'right-[19%]',

              // Diagonals
              (winningLineType === 'diag-1' || winningLineType === 'diag-2') &&
              'w-[128%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1.5 origin-center animate-draw-line',
              winningLineType === 'diag-1' && '-rotate-[135deg]  lg:-rotate-[132deg]',
              winningLineType === 'diag-2' && 'rotate-[135deg] lg:rotate-[132deg] '
            )}
          />
        )}

        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              variant={getCellVariant(cell)}
              size="lg"
              className={cn(
                'h-24 w-24 text-4xl font-bold transition-all duration-300',
                'border-2 border-border/20 hover:border-primary/50',
                'hover:shadow-cell hover:scale-105',
                cell === -1 && !isRoundComplete && 'hover:bg-primary/10',
                cell === 0 && 'bg-gradient-primary text-primary-foreground shadow-glow',
                cell === 1 && 'bg-gradient-secondary text-white shadow-glow',
                cell === -1 && 'bg-card backdrop-blur-sm',
                isWinningCell(rowIndex, colIndex) &&
                'animate-pulse border-white !bg-gradient-to-r from-purple-700/80 to-purple-900/80 !shadow-lg'
              )}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={cell !== -1 || isRoundComplete}
              aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}`}
            >
              <span className={cn('transition-all duration-500',
                cell !== -1 && 'animate-in zoom-in-75 duration-300',
                cell === 1 && 'text-7xl')}>
                {getCellSymbol(cell)}
              </span>
            </Button>
          ))
        )}
      </div>
    </>
  );
};

export default GameBoard;