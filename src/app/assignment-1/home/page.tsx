'use client';

import { ArrowLeft, Gamepad, Trophy } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import PlayerSetupPage from '../setup/page';

// Game Rules Card
const GameRules = () => (
    <div className="rounded-2xl border border-border/20 bg-card p-6 text-foreground shadow-md transition-all">
        <div className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold sm:text-2xl">
            <Trophy className="h-6 w-6 text-primary" />
            <span>Game Rules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Scoring */}
            <div className="space-y-2">
                <h4 className="text-lg sm:text-xl font-semibold text-foreground">Scoring</h4>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground">
                    <li>
                        Win a round: <span className="text-primary font-medium">2 points</span>
                    </li>
                    <li>
                        Lose a round: <span className="text-game-secondary font-medium">1 point</span>
                    </li>
                    <li>
                        Draw: <span className="text-white font-medium">0 points</span>
                    </li>
                </ul>
            </div>

            {/* Victory Conditions */}
            <div className="space-y-2 self-end justify-self-end">
                <h4 className="text-lg sm:text-xl font-semibold text-foreground">Victory Conditions</h4>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground">
                    <li>Best of 5 rounds</li>
                    <li>First to 3 round wins</li>
                    <li>Highest score after 5 rounds</li>
                </ul>
            </div>
        </div>
    </div>
);


// Action Buttons Section
const ActionButtons = ({ onSetup, onLeaderboard }: { onSetup: () => void; onLeaderboard: () => void }) => (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button
            onClick={onSetup}
            size="lg"
            className="w-full bg-gradient-primary text-primary-foreground shadow-glow transition-transform duration-200 hover:scale-105 sm:w-auto"
        >
            <Gamepad className="mr-2 h-5 w-5" />
            New Game
        </Button>
        <Button
            onClick={onLeaderboard}
            size="lg"
            variant="outline"
            className="w-full border-border/20 transition-transform duration-200 hover:scale-105 hover:border-secondary/50 hover:bg-secondary/20 sm:w-auto"
        >
            <ArrowLeft className="mr-2 h-5 w-5 -scale-x-100" />
            View Leaderboard
        </Button>
    </div>
);

const Home = () => {
    const router = useRouter();
    const [showSetup, setShowSetup] = useState(false);

    const handleStartGame = () => {
        router.push('/assignment-1/game');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 font-sans">
            <div className="w-full max-w-3xl mx-auto">
                <div className="space-y-8 text-center">
                    <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        Tic-Tac-Toe
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground">
                        Challenge your friends in the ultimate strategy game. Best of 5 rounds wins!
                    </p>
                </div>

                <div className="mt-10 space-y-6">
                    {!showSetup ? (
                        <>
                            <GameRules />
                            <ActionButtons
                                onSetup={() => setShowSetup(true)}
                                onLeaderboard={() => router.push('/assignment-1/leaderboard')}
                            />
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-start">
                                <Button
                                    onClick={() => setShowSetup(false)}
                                    variant="ghost"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                            </div>
                            <PlayerSetupPage onStart={handleStartGame} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
