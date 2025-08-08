'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Home, Medal, Trash, Trophy, WarningTriangle } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/common/Dialog';
import { resetLeaderboard } from '../../../redux/slices/gameSlice';
import { ActionButtonsProps, ConfirmDialogProps, GameHistoryItem, MatchHistoryProps, PlayerCardProps, TitleSectionProps } from '../types/leaderboard';

const TitleSection = ({ finalWinner }: TitleSectionProps) => (
    <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-card/80 to-card/60 border-2 border-primary/30 rounded-xl p-6 shadow-neon">
            <h1 className="text-5xl font-black text-foreground flex items-center justify-center gap-3 mb-2">
                <Trophy className="h-10 w-10 text-primary animate-pulse drop-shadow-lg" />
                Leaderboard
            </h1>
            <p className="text-primary/80 text-lg">🎮 Battle Arena Statistics</p>
        </div>

        {finalWinner && (
            <div className="bg-gradient-to-r from-primary/20 to-game-accent/20 border-2 border-primary/40 shadow-glow max-w-md mx-auto animate-pulse p-4 rounded-md">
                <p className="text-foreground font-bold text-lg text-center">
                    👑 {finalWinner !== 'Tie Game' ? `${finalWinner} Reigns Supreme!` : 'Epic Tie Battle!'}
                </p>
            </div>
        )}
    </div>
);



const PlayerCard = ({
    name,
    symbol,
    points,
    wins,
    losses,
    draws,
    index,
}: PlayerCardProps) => {
    const rankIcons = [
        <Trophy key="1" className="h-5 w-5" color="rgb(234 179 8)" />, // Gold
        <Medal key="2" className="h-5 w-5" color="rgb(156 163 175)" />, // Silver
        <Medal key="3" className="h-5 w-5" color="rgb(217 119 6)" />, // Bronze
    ];

    const rankBadges = [
        { text: '1st Place', className: 'bg-gradient-primary text-primary-foreground' },
        { text: '2nd Place', className: 'bg-gradient-secondary text-white' },
        { text: `${index + 1}th Place`, className: '' },
    ];

    return (
        <div className={`p-6 rounded-md border-2 ${index === 0
            ? 'bg-gradient-to-r from-primary/20 to-game-accent/20 border-primary/40'
            : 'bg-card/80 border-border/30'
            }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-card/50 p-2 rounded-full">{rankIcons[index] || rankIcons[2]}</div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground">{name}</h3>
                        <p className="text-sm text-primary/80">⚔️ Player {symbol}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Points</div>
                        <div className="text-lg font-bold text-primary">{points}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Round Wins</div>
                        <div className="text-lg font-bold text-foreground">{wins}</div>
                    </div>
                    <Badge className={rankBadges[index]?.className}>
                        {rankBadges[index]?.text}
                    </Badge>
                </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-sm text-center">
                <div>
                    <div className="text-green-500 font-semibold">{wins}</div>
                    <div className="text-muted-foreground">Wins</div>
                </div>
                <div>
                    <div className="text-red-500 font-semibold">{losses}</div>
                    <div className="text-muted-foreground">Losses</div>
                </div>
                <div>
                    <div className="text-yellow-500 font-semibold">{draws}</div>
                    <div className="text-muted-foreground">Draws</div>
                </div>
            </div>
        </div>
    );
};


const MatchHistory = ({
    gameHistory,
    player1Name,
    player2Name,
}: MatchHistoryProps) => (
    <div className="bg-card rounded-xl shadow-lg border border-border/20">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 p-4 text-sm font-semibold text-muted-foreground border-b border-border/20">
            <span>Round</span>
            <span className="text-center">Result</span>
            <span className="text-right">Score</span>
        </div>

        {/* Table Rows */}
        <div className="p-4 space-y-2">
            {gameHistory.map((round, index) => {
                const isPlayer1Winner = round.winner === 'X';
                const isPlayer2Winner = round.winner === 'O';

                let resultLabel = 'Draw';
                let resultClass = 'text-muted-foreground';

                if (isPlayer1Winner) {
                    resultLabel = `${player1Name} Wins`;
                    resultClass = 'bg-primary/10 text-primary border-primary/20';
                } else if (isPlayer2Winner) {
                    resultLabel = `${player2Name} Wins`;
                    resultClass = 'bg-game-secondary/10 text-game-secondary border-game-secondary/20';
                }

                return (
                    <div
                        key={index}
                        className="grid grid-cols-3 gap-4 items-center p-2 rounded border border-border/10"
                    >
                        {/* Round Number */}
                        <span className="text-sm text-muted-foreground">Round {round.round}</span>

                        {/* Result Badge */}
                        <div className="flex justify-center">
                            <Badge variant="outline" className={resultClass}>
                                {resultLabel}
                            </Badge>
                        </div>

                        {/* Score */}
                        <span className="text-sm text-muted-foreground text-right">
                            <span className={isPlayer1Winner ? 'font-semibold text-foreground' : ''}>
                                {round.player1Score}
                            </span>
                            {' - '}
                            <span className={isPlayer2Winner ? 'font-semibold text-foreground' : ''}>
                                {round.player2Score}
                            </span>
                        </span>
                    </div>
                );
            })}
        </div>
    </div>
);


const ActionButtons = ({ onHome, onClear, hasGame }: ActionButtonsProps) => (
    <div className="flex justify-center gap-4">
        <Button onClick={onHome} variant="outline" className="border-border/20 hover:bg-secondary/20 hover:border-secondary/50">
            <Home className="h-4 w-4 mr-2" />
            Home
        </Button>

        {hasGame && (
            <Button onClick={onClear} variant="outline" className="border-destructive/20 hover:bg-destructive/10 hover:border-destructive/50 text-destructive hover:text-destructive">
                <Trash className="h-4 w-4 mr-2" />
                Clear Data
            </Button>
        )}
    </div>
);

const ConfirmDialog = ({ open, onCancel, onConfirm }: ConfirmDialogProps) => (
    <Dialog open={open} onOpenChange={onCancel}>
        <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <WarningTriangle className="h-6 w-6 text-destructive" />
                Are you absolutely sure?
            </DialogTitle>
            <DialogDescription>This action cannot be undone. This will permanently delete all your leaderboard data.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button variant="destructive" onClick={onConfirm}>Continue</Button>
        </DialogFooter>
    </Dialog>
);

const Leaderboard = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const currentMatch = useAppSelector((state) => state.game.current_match);

    // Final winner name or tie
    const finalWinner = currentMatch && currentMatch.final_winner.player
        ? currentMatch.final_winner.player === currentMatch.participating_players.player_1.id
            ? currentMatch.participating_players.player_1.name
            : currentMatch.participating_players.player_2.name
        : currentMatch?.result === 0 ? 'Tie Game' : null;

    // Player info array for cards, sorted by points descending
    const players = currentMatch
        ? [
            {
                id: currentMatch.participating_players.player_1.id,
                name: currentMatch.participating_players.player_1.name,
                symbol: 'X' as const,
                points: currentMatch.participating_players.player_1.total_score,
                wins: currentMatch.participating_players.player_1.total_win,
                losses: currentMatch.rounds.filter(r => r.winner === currentMatch.participating_players.player_2.id).length,
                draws: currentMatch.rounds.filter(r => r.result === 0).length,
            },
            {
                id: currentMatch.participating_players.player_2.id,
                name: currentMatch.participating_players.player_2.name,
                symbol: 'O' as const,
                points: currentMatch.participating_players.player_2.total_score,
                wins: currentMatch.participating_players.player_2.total_win,
                losses: currentMatch.rounds.filter(r => r.winner === currentMatch.participating_players.player_1.id).length,
                draws: currentMatch.rounds.filter(r => r.result === 0).length,
            },
        ].sort((a, b) => b.points - a.points)
        : [];

    // Map currentMatch.rounds (Round[]) to GameHistoryItem[]
    const gameHistory: GameHistoryItem[] = (currentMatch?.rounds || []).map(
        (round) => {
            let winner: 'X' | 'O' | 'draw' = 'draw';
            let player1Score = 0;
            let player2Score = 0;

            if (round.result === 0) {
                // Draw: both get 0 points
                player1Score = 0;
                player2Score = 0;
                winner = 'draw';
            } else if (round.winner === players[0]?.id) {
                // Player 1 wins, player 2 loses (1 point)
                player1Score = 2;
                player2Score = 1;
                winner = 'X';
            } else if (round.winner === players[1]?.id) {
                // Player 2 wins, player 1 loses (1 point)
                player2Score = 2;
                player1Score = 1;
                winner = 'O';
            }

            return {
                round: round.round_num,
                winner,
                player1Score,
                player2Score,
            };
        }
    );


    const handleClear = () => {
        dispatch(resetLeaderboard());
        setShowConfirmDialog(false);
    };

    const hasGame = !!currentMatch;

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <TitleSection finalWinner={finalWinner} />

                {hasGame ? (
                    <>
                        <h2 className="text-2xl font-semibold text-center text-foreground">Current Session</h2>
                        <div className="space-y-3">
                            {players.map((p, i) => (
                                <PlayerCard key={p.id} {...p} index={i} />
                            ))}
                        </div>

                        <MatchHistory
                            gameHistory={gameHistory}
                            player1Name={players[0]?.name ?? ''}
                            player2Name={players[1]?.name ?? ''}
                            player1Id={players[0]?.id ?? ''}
                            player2Id={players[1]?.id ?? ''}
                        />
                    </>
                ) : (
                    <div className="bg-gradient-game border-border/20 text-center p-8 rounded-md">
                        <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">No Games Played Yet</h3>
                        <p className="text-muted-foreground">Start playing to see your stats here!</p>
                    </div>
                )}

                <ActionButtons
                    onHome={() => router.push('/assignment-1/home')}
                    onClear={() => setShowConfirmDialog(true)}
                    hasGame={hasGame}
                />
            </div>

            <ConfirmDialog
                open={showConfirmDialog}
                onCancel={() => setShowConfirmDialog(false)}
                onConfirm={handleClear}
            />
        </div>
    );
};

export default Leaderboard;
