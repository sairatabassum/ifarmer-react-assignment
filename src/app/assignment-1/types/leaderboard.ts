// app/assignment-1/types/leaderboard.ts

export type GameState = {
    player1Name: string;
    player2Name: string;
    scores: { player1: number; player2: number };
    roundWins: { player1: number; player2: number };
    gameHistory: GameHistoryItem[];
    finalWinner: string | null;
    sessionStats: { gamesPlayed: number; totalRounds: number };
  };


  export type PlayerSymbol = 'X' | 'O';

  export type GameHistoryItem = {
    round: number;
    winner: 'X' | 'O' | 'draw';
    player1Score: number;
    player2Score: number;
  };

  
export interface TitleSectionProps {
  finalWinner: string | null;
}

export interface SessionStatsProps {
  gamesPlayed: number;
  totalRounds: number;
  currentBattle: number;
}


export interface PlayerCardProps {
    name: string;
    symbol: PlayerSymbol;
    points: number;
    wins: number;
    losses: number;
    draws: number;
    index: number;
}

export interface MatchHistoryProps {
  gameHistory: GameHistoryItem[];
  player1Name: string;
  player2Name: string;
}

export interface ActionButtonsProps {
  onHome: () => void;
  onContinue: () => void;
  onClear: () => void;
  hasGame: boolean;
}

export interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}
