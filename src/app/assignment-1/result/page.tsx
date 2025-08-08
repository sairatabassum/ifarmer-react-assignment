'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { restartMatch } from '@/redux/slices/gameSlice';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  RefreshCircle,
  User,
  Home,
  Medal,
  UserBadgeCheck,
} from 'iconoir-react';

import type { PlayerID } from '@/app/assignment-1/types/game';

const VictoryScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const match = useAppSelector((state) => state.game.current_match);

  // Guard: if no match or no final result (win or tie), do not show screen
  if (
    !match ||
    (match.final_winner.player === null && match.result !== 0)
  ) {
    return null;
  }

  const { player_1: p1, player_2: p2 } = match.participating_players;

  const finalWinnerId: PlayerID | null = match.final_winner.player;
  const finalWinnerName =
    finalWinnerId === p1.id
      ? p1.name
      : finalWinnerId === p2.id
        ? p2.name
        : null;

  const isTie = match.result === 0;

  const draws = match.rounds.filter((round) => round.result === 0).length;

  const isWinner = (playerName: string) => !isTie && finalWinnerName === playerName;

  const handleNewMatch = () => dispatch(restartMatch());
  const handleNewPlayers = () => router.push('/');
  const handleViewLeaderboard = () => router.push('/assignment-1/leaderboard');

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto font-sans">
      <div className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl bg-card/95 border-2 border-primary/30 animate-scale-in backdrop-blur-sm my-auto rounded-xl">
        <header className="text-center pb-3 sm:pb-4 bg-gradient-to-b from-primary/15 to-transparent px-3 sm:px-6 pt-6 rounded-t-xl">
          <div className="flex justify-center mb-3 sm:mb-4">
            {isTie ? (
              <div className="flex gap-1 sm:gap-2">
                <Medal className="h-8 w-8 sm:h-12 sm:w-12 text-game-accent drop-shadow-lg" />
                <Medal className="h-8 w-8 sm:h-12 sm:w-12 text-game-accent drop-shadow-lg" />
              </div>
            ) : (
              <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-primary drop-shadow-lg animate-pulse" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 bg-gradient-neon bg-clip-text leading-tight">
            {isTie ? 'Epic Tie!' : `${finalWinnerName} Champions!`}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-primary/80">
            🏁 Battle Complete • Round {match.completed_round}
          </p>
        </header>

        <main className="space-y-4 sm:space-y-6 px-3 sm:px-6 py-4 sm:py-6">
          {/* Final Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[p1, p2].map((player, i) => (
              <section
                key={player.id}
                className={`rounded-xl border-2 ${isWinner(player.name)
                    ? i === 0
                      ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/5 shadow-glow'
                      : 'border-game-secondary bg-gradient-to-br from-game-secondary/20 to-game-secondary/5 shadow-secondary'
                    : 'border-border/30 bg-card/50'
                  }`}
              >
                <div className="p-3 sm:p-4 lg:p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                    {isWinner(player.name) && (
                      <Trophy
                        className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${i === 0 ? 'text-primary' : 'text-game-secondary'
                          } animate-bounce`}
                      />
                    )}
                    <h3
                      className="font-bold text-sm sm:text-base lg:text-lg text-foreground truncate"
                      title={player.name}
                    >
                      {player.name}
                    </h3>
                  </div>
                  <div
                    className={`text-2xl sm:text-3xl lg:text-4xl font-black mb-1 drop-shadow-md ${i === 0 ? 'text-primary' : 'text-game-secondary'
                      }`}
                  >
                    {player.total_score}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                    Total Points
                  </div>
                  <Badge
                    variant="outline"
                    className={`${i === 0
                        ? 'bg-primary/20 text-primary border-primary/40 shadow-sm'
                        : 'bg-game-secondary/20 text-game-secondary border-game-secondary/40 shadow-sm'
                      } text-xs sm:text-sm`}
                  >
                    🏆 {player.total_win} Wins
                  </Badge>
                </div>
              </section>
            ))}
          </div>

          {/* Game Summary */}
          <section className="bg-gradient-to-r from-card/80 to-card/60 border-2 border-primary/20 shadow-inner rounded-xl">
            <div className="p-3 sm:p-4 lg:p-6">
              <h4 className="font-bold text-sm sm:text-base lg:text-lg text-foreground mb-3 sm:mb-4 text-center flex items-center justify-center gap-2">
                <UserBadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Battle Statistics
              </h4>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 text-center">
                <div className="bg-card/50 rounded-lg p-2 sm:p-3 border border-border/20">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-primary mb-1">
                    {match.completed_round}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Total Rounds
                  </div>
                </div>
                <div className="bg-card/50 rounded-lg p-2 sm:p-3 border border-border/20">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-game-accent mb-1">
                    {Math.max(p1.total_win, p2.total_win)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Best Score
                  </div>
                </div>
                <div className="bg-card/50 rounded-lg p-2 sm:p-3 border border-border/20">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-game-warning mb-1">
                    {draws}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Draws
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Button
                onClick={handleNewMatch}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground shadow-glow text-sm sm:text-base"
              >
                <RefreshCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Rematch
              </Button>
              <Button
                onClick={handleNewPlayers}
                variant="outline"
                className="border-border/20 hover:bg-secondary/20 hover:border-secondary/50 text-sm sm:text-base"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                New Players
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Button
                onClick={handleViewLeaderboard}
                variant="outline"
                className="border-border/20 hover:bg-accent/20 hover:border-accent/50 text-sm sm:text-base"
              >
                <UserBadgeCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                View Stats
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="border-border/20 hover:bg-muted/20 hover:border-muted/50 text-sm sm:text-base"
              >
                <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Home
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default VictoryScreen;
