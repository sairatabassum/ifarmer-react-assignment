'use client';

import { Badge } from '@/components/common/Badge';
import { useAppSelector } from '@/hooks/redux';
import { Box, Gamepad, SunLight, Trophy } from 'iconoir-react';
import cn from '../../../utils/cn';

import {
  getLastRound, getPlayerName,
  getWinnerId,
  isCurrentRoundComplete,
  isDrawRound,
} from '../utils/gameStatusUtils';

const GameStatus = () => {
  const match = useAppSelector((state) => state.game.current_match);
  const currentTurn = useAppSelector((state) => state.game.current_turn);

  if (!match) return null;

  const { player_1: p1, player_2: p2 } = match.participating_players;
  const currentRound = match.running_round;
  const currentRoundComplete = isCurrentRoundComplete(match);

  const currentPlayerName = getPlayerName(currentTurn, match);
  const winnerId = getWinnerId(match);
  const isDraw = isDrawRound(match);
  const roundWinnerName = winnerId ? getPlayerName(winnerId, match) : null;

  const getTurnCardClass = (playerId: string) => {
    if (!currentRoundComplete && currentTurn === playerId) {
      return 'border-primary/50 shadow-glow animate-pulse';
    }
    return 'border-border/20';
  };

  const getWinnerCardClass = (playerId: string) => {
    if (winnerId === playerId) {
      return cn(
        'animate-pop',
        winnerId === p1.id
          ? 'glowing-border-primary'
          : 'glowing-border-secondary'
      );
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Game Status */}
      <section className="bg-card rounded-xl border border-border/20 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Gamepad className="h-5 w-5 text-primary" />
          Game Status
        </div>
        <div className="mt-3">
          {currentRoundComplete ? (
            isDraw ? (
              <Badge
                variant="outline"
                className="bg-game-warning/10 text-game-warning border-game-warning/20 text-sm animate-pop"
              >
                <SunLight className="h-4 w-4 mr-1 text-game-warning animate-spin-slow" />
                It&apos;s a draw!
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className={cn(
                  'text-sm animate-pop',
                  roundWinnerName === p1.name
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-game-secondary/10 text-game-secondary border-game-secondary/20'
                )}
              >
                <Trophy className="h-4 w-4 mr-1 animate-bounce" />
                {roundWinnerName} won this round!
              </Badge>
            )
          ) : (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-sm animate-pulse-turn"
            >
              Current Turn: {currentPlayerName}
            </Badge>
          )}
        </div>
      </section>

      {/* Player Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[p1, p2].map((player, i) => (
          <div
            key={player.id}
            className={cn(
              'bg-card rounded-xl border-2 p-3 shadow-lg space-y-4 transition-all duration-300',
              getTurnCardClass(player.id),
              getWinnerCardClass(player.id)
            )}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'h-8 w-8 flex items-center justify-center rounded-full text-lg font-bold text-white',
                    i === 0 ? 'bg-gradient-primary' : 'bg-gradient-secondary'
                  )}
                >
                  {i === 0 ? 'X' : 'O'}
                </div>
                <h3
                  className="text-base font-bold truncate min-w-0 lg:max-w-[80px]"
                  title={player.name}
                >
                  {player.name}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 text-center">
              <div className="bg-card rounded-lg p-2 border border-border/20">
                <div className="text-sm text-muted-foreground font-medium">Wins</div>
                <div className="text-2xl font-black text-foreground">{player.total_win}</div>
              </div>
              <div className="bg-card rounded-lg p-2 border border-border/20">
                <div className="text-sm text-muted-foreground font-medium">Score</div>
                <div className="text-2xl font-black text-foreground">{player.total_score}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Match Overview */}
      <section className="bg-card rounded-xl border border-border/20 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Box className="h-5 w-5 text-primary" />
          Match Overview
        </div>
        <div className="mt-3 flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Current Round:</span>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {currentRound} of {match.total_rounds}
          </Badge>
        </div>
      </section>
    </div>
  );
};

export default GameStatus;
