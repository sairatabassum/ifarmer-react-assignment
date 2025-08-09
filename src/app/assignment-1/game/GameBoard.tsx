'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { Button } from '@/components/common/Button';
import cn from '@/utils/cn';
import { completeRound, makeMove } from '../../../redux/slices/gameSlice';
import { checkWinner, isDraw } from '../utils/checkWinner';
import RoundStartModal from '../../../components/tic-tac-toe/RoundStartModal';
import type { PlayerID, Match } from '../../../app/assignment-1/types/game';

// --- Tailwind class constants ---
const gridContainer = "grid grid-cols-3 gap-3 p-6 rounded-2xl shadow-game border border-border bg-primary/5 relative";

const baseCell =
  'h-24 w-24 max-sm:h-20 max-sm:w-20 text-4xl font-bold transition-all duration-300 border-2 border-border/20 hover:border-primary/50 hover:shadow-cell hover:scale-105';

const emptyCellHover = 'hover:bg-primary/10';
const playerXCell = 'bg-gradient-primary text-primary-foreground shadow-glow';
const playerOCell = 'bg-gradient-secondary text-white shadow-glow';
const emptyCell = 'bg-card backdrop-blur-sm';
const winningCell = 'animate-pulse border-white !bg-gradient-to-r from-purple-700/80 to-purple-900/80 !shadow-lg';

const symbolAnim = 'transition-all duration-500';
const symbolPlacedAnim = 'animate-in zoom-in-75 duration-300';
const playerOBiggerFont = 'text-7xl';

// Winning line styles
const winningLineBase = "absolute bg-[#b366ec] h-1 rounded-full z-10 origin-left";
const horizontalLine = "w-[88%] left-1/2 -translate-x-1/2 animate-draw-line";
const verticalLine = "h-[84%] top-[46%] -translate-y-1/2 w-1 origin-top animate-draw-vertical";
const diagonalLine = "w-[128%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1.5 origin-center animate-draw-line";

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
      if (r1 === r2) lineType = `row-${r1}`;
      else if (c1 === c2) lineType = `col-${c1}`;
      else if (r1 === c1) lineType = 'diag-1';
      else lineType = 'diag-2';

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

  const isWinningCell = (row: number, col: number): boolean =>
    winningLine?.some(([r, c]) => r === row && c === col) ?? false;

  return (
    <>
      {currentMatch.running_round > 0 && (
        <RoundStartModal key={currentMatch.running_round} round={currentMatch.running_round} />
      )}

      <div className={gridContainer}>
        {winningLineType && (
          <div
            className={cn(
              winningLineBase,
              winningLineType.startsWith('row') && horizontalLine,
              winningLineType === 'row-0' && 'top-[18%]',
              winningLineType === 'row-1' && 'top-1/2 lg:-translate-y-5',
              winningLineType === 'row-2' && 'bottom-[19%] -translate-y-1.5',

              winningLineType.startsWith('col') && verticalLine,
              winningLineType === 'col-0' && 'left-[19%]',
              winningLineType === 'col-1' && 'left-1/2 -translate-x-1/2',
              winningLineType === 'col-2' && 'right-[19%]',

              (winningLineType === 'diag-1' || winningLineType === 'diag-2') && diagonalLine,
              winningLineType === 'diag-1' && '-rotate-[135deg]  lg:-rotate-[132deg]',
              winningLineType === 'diag-2' && 'rotate-[135deg] lg:rotate-[132deg]'
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
                baseCell,
                cell === -1 && !isRoundComplete && emptyCellHover,
                cell === 0 && playerXCell,
                cell === 1 && playerOCell,
                cell === -1 && emptyCell,
                isWinningCell(rowIndex, colIndex) && winningCell
              )}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={cell !== -1 || isRoundComplete}
              aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}`}
            >
              <span
                className={cn(
                  symbolAnim,
                  cell !== -1 && symbolPlacedAnim,
                  cell === 1 && playerOBiggerFont
                )}
              >
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
