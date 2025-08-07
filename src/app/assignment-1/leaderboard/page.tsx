'use client';

import { GraphUp, Home, Medal, Trash, Trophy, WarningTriangle } from 'iconoir-react';
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
import { ActionButtonsProps, ConfirmDialogProps, GameState, MatchHistoryProps, PlayerCardProps, SessionStatsProps, TitleSectionProps } from '../types/leaderboard';


// ---------------Default State --------------
const defaultGameState: GameState = {
    player1Name: 'Player 1',
    player2Name: 'Player 2',
    scores: { player1: 0, player2: 0 },
    roundWins: { player1: 0, player2: 0 },
    gameHistory: [
        { round: 1, winner: 'X', player1Score: 1, player2Score: 0 },
        { round: 2, winner: 'O', player1Score: 1, player2Score: 1 },
        { round: 3, winner: 'draw', player1Score: 1, player2Score: 1 },
    ],
    finalWinner: null,
    sessionStats: { gamesPlayed: 1, totalRounds: 3 },
};

// ------------- Components ------------

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

// -------------------Session stats---------------------
const SessionStats = ({ gamesPlayed, totalRounds, currentBattle }: SessionStatsProps) => {
    const stats = [
        { value: gamesPlayed, label: 'Games Won', color: 'text-primary' },
        { value: totalRounds, label: 'Total Rounds', color: 'text-game-accent' },
        { value: currentBattle, label: 'Current Battle', color: 'text-game-secondary' },
    ];

    return (
        <div className="bg-gradient-to-r from-card/90 to-card/70 border-2 border-primary/30 p-6 rounded-md">
            <div className="bg-gradient-to-r from-primary/15 to-game-accent/15 p-4 rounded-t-md -mx-6 -mt-6">
                <h3 className="flex items-center gap-2 text-foreground text-xl">
                    <GraphUp className="h-6 w-6 text-primary drop-shadow-lg" />
                    🎯 Session Overview
                </h3>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center mt-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-card/60 border border-border/30 rounded-lg p-4">
                        <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

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
        <Trophy key="1" className="h-5 w-5" color="rgb(234 179 8)" />,
        <Medal key="2" className="h-5 w-5" color="rgb(156 163 175)" />,
        <Badge key="3" className="h-5 w-5" color="rgb(217 119 6)" />,
    ];

    const rankBadges = [
        { variant: 'default' as const, text: '1st Place', className: 'bg-gradient-primary text-primary-foreground' },
        { variant: 'secondary' as const, text: '2nd Place', className: 'bg-gradient-secondary text-white' },
        { variant: 'outline' as const, text: `${index + 1}th Place`, className: '' },
    ];

    return (
        <div
            className={`p-6 rounded-md border-2 ${index === 0
                ? 'bg-gradient-to-r from-primary/20 to-game-accent/20 border-primary/40'
                : 'bg-card/80 border-border/30'
                }`}
        >
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
                    <Badge variant={rankBadges[index]?.variant} className={rankBadges[index]?.className}>
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
    <div className="bg-gradient-game border-border/20 p-6 rounded-md">
        <div className="p-4 rounded-t-md -mx-6 -mt-6">
            <h3 className="text-foreground text-xl">Match History</h3>
        </div>
        <div className="space-y-2 mt-6">
            {gameHistory.map((round, index) => {
                const result =
                    round.winner === 'X'
                        ? { label: `${player1Name} Wins`, className: 'bg-primary/10 text-primary border-primary/20' }
                        : round.winner === 'O'
                            ? { label: `${player2Name} Wins`, className: 'bg-game-secondary/10 text-game-secondary border-game-secondary/20' }
                            : { label: 'Draw', className: 'text-muted-foreground' };

                return (
                    <div key={index} className="flex justify-between items-center p-2 rounded border border-border/10">
                        <span className="text-sm text-muted-foreground">Round {round.round}</span>
                        <Badge variant="outline" className={result.className}>
                            {result.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {round.player1Score} - {round.player2Score}
                        </span>
                    </div>
                );
            })}
        </div>
    </div>
);

const ActionButtons = ({
    onHome,
    onContinue,
    onClear,
    hasGame,
}: ActionButtonsProps) => (
    <div className="flex justify-center gap-4">
        <Button onClick={onHome} variant="outline" className="border-border/20 hover:bg-secondary/20 hover:border-secondary/50">
            <Home className="h-4 w-4 mr-2" />
            Home
        </Button>

        {hasGame && (
            <>
                <Button
                    onClick={onContinue}
                    className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground shadow-glow"
                >
                    Continue Game
                </Button>
                <Button
                    onClick={onClear}
                    variant="outline"
                    className="border-destructive/20 hover:bg-destructive/10 hover:border-destructive/50 text-destructive hover:text-destructive"
                >
                    <Trash className="h-4 w-4 mr-2" />
                    Clear Data
                </Button>
            </>
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
            <DialogDescription>
                This action cannot be undone. This will permanently delete all your leaderboard data.
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button variant="outline" onClick={onCancel}>
                Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
                Continue
            </Button>
        </DialogFooter>
    </Dialog>
);

// ----------------- Main Component -----------------

const Leaderboard = () => {
    const router = useRouter();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [gameState, setGameState] = useState<GameState>(defaultGameState);

    const { player1Name, player2Name, scores, roundWins, gameHistory, finalWinner, sessionStats } = gameState;

    const clearLeaderboard = () => {
        setGameState({
            ...defaultGameState,
            gameHistory: [],
            sessionStats: { gamesPlayed: 0, totalRounds: 0 },
        });
        setShowConfirmDialog(false);
    };

    const players = [
        {
            name: player1Name,
            symbol: 'X',
            points: scores.player1,
            wins: roundWins.player1,
            losses: gameHistory.filter(g => g.winner === 'O').length,
            draws: gameHistory.filter(g => g.winner === 'draw').length,
        },
        {
            name: player2Name,
            symbol: 'O',
            points: scores.player2,
            wins: roundWins.player2,
            losses: gameHistory.filter(g => g.winner === 'X').length,
            draws: gameHistory.filter(g => g.winner === 'draw').length,
        },
    ].sort((a, b) => b.wins - a.wins || b.points - a.points);

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <TitleSection finalWinner={finalWinner} />

                {gameHistory.length > 0 ? (
                    <>
                        <SessionStats
                            gamesPlayed={sessionStats.gamesPlayed}
                            totalRounds={sessionStats.totalRounds + gameHistory.length}
                            currentBattle={gameHistory.length}
                        />
                        <h2 className="text-2xl font-semibold text-center text-foreground">Current Session</h2>
                        <div className="space-y-3">
                            {players.map((p, i) => (
                                <PlayerCard key={p.name} {...p} index={i} />
                            ))}
                        </div>
                        <MatchHistory
                            gameHistory={gameHistory}
                            player1Name={player1Name}
                            player2Name={player2Name}
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
                    onContinue={() => router.push('/assignment-1/game')}
                    onClear={() => setShowConfirmDialog(true)}
                    hasGame={gameHistory.length > 0 || sessionStats.gamesPlayed > 0}
                />
            </div>

            <ConfirmDialog
                open={showConfirmDialog}
                onCancel={() => setShowConfirmDialog(false)}
                onConfirm={clearLeaderboard}
            />
        </div>
    );
};

export default Leaderboard;
