'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Home, Trash, Trophy, WarningTriangle } from 'iconoir-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '../../../components/common/Button';
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/common/Dialog';
import { resetLeaderboard } from '../../../redux/slices/gameSlice';

const TitleSection = () => (
    <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-card/80 to-card/60 border-2 border-primary/30 rounded-xl p-6 shadow-neon">
            <h1 className="text-5xl font-black text-foreground flex items-center justify-center gap-3 mb-2">
                <Trophy className="h-10 w-10 text-primary animate-pulse drop-shadow-lg" />
                Leaderboard
            </h1>
            <p className="text-primary/80 text-lg">🏆 All Players Cumulative Scores</p>
        </div>
    </div>
);

const ActionButtons = ({
    onClear,
    hasMatches,
}: {
    onClear: () => void;
    hasMatches: boolean;
}) => (
    <div className="flex justify-center gap-4">
        <Link href="/assignment-1/home">
            <Button
                variant="outline"
                className="border-border/20 hover:bg-secondary/20 hover:border-secondary/50 flex items-center"
            >
                <Home className="h-4 w-4 mr-2" />
                Home
            </Button>
        </Link>

        {hasMatches && (
            <Button
                onClick={onClear}
                variant="outline"
                className="border-destructive/20 hover:bg-destructive/10 hover:border-destructive/50 text-destructive hover:text-destructive"
            >
                <Trash className="h-4 w-4 mr-2" />
                Clear Matches
            </Button>
        )}
    </div>
);

const ConfirmDialog = ({
    open,
    onCancel,
    onConfirm,
}: {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) => (
    <Dialog open={open} onOpenChange={onCancel}>
        <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <WarningTriangle className="h-6 w-6 text-destructive" />
                Are you absolutely sure?
            </DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete all your match
                data.
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

const Leaderboard = () => {
    const dispatch = useAppDispatch();
    const matches = useAppSelector((state) => state.game.matches);
    // console.log(matches);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const hasMatches = matches.length > 0;

    // Aggregate player stats across all matches
    const aggregatedPlayers = useMemo(() => {
        const statsMap: Record<
            string,
            {
                id: string;
                name: string;
                total_score: number;
                total_win: number;
                total_lose: number;
            }
        > = {};

        matches.forEach((match) => {
            const players = [match.participating_players.player_1, match.participating_players.player_2];

            players.forEach((player) => {
                if (!statsMap[player.id]) {
                    statsMap[player.id] = {
                        id: player.id,
                        name: player.name,
                        total_score: 0,
                        total_win: 0,
                        total_lose: 0,
                    };
                }
                statsMap[player.id].total_score += player.total_score;
                statsMap[player.id].total_win += player.total_win;
                statsMap[player.id].total_lose += player.total_lose;
            });
        });

        // Sort descending by total_score
        return Object.values(statsMap).sort((a, b) => b.total_score - a.total_score);
    }, [matches]);

    const handleClear = () => {
        dispatch(resetLeaderboard());
        setShowConfirmDialog(false);
    };

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <TitleSection />

                {hasMatches ? (
                    <table className="w-full table-auto border-collapse border border-border rounded-md text-foreground">
                        <thead>
                            <tr className="bg-primary/20">
                                <th className="border border-border px-4 py-2 text-left">Player</th>
                                <th className="border border-border px-4 py-2 text-center">Score</th>
                                <th className="border border-border px-4 py-2 text-center">Wins</th>
                                <th className="border border-border px-4 py-2 text-center">Losses</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aggregatedPlayers.map((player) => (
                                <tr key={player.id} className="odd:bg-card/80 even:bg-card/60">
                                    <td className="border border-border px-4 py-2">{player.name}</td>
                                    <td className="border border-border px-4 py-2 text-center font-bold">{player.total_score}</td>
                                    <td className="border border-border px-4 py-2 text-center">{player.total_win}</td>
                                    <td className="border border-border px-4 py-2 text-center">{player.total_lose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="bg-gradient-game border-border/20 text-center p-8 rounded-md">
                        <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">No Matches Played Yet</h3>
                        <p className="text-muted-foreground">Start playing to see your leaderboard here!</p>
                    </div>
                )}

                <ActionButtons onClear={() => setShowConfirmDialog(true)} hasMatches={hasMatches} />
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
