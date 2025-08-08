

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
  player1Id: string;
  player2Id: string;
}

export interface ActionButtonsProps {
  onHome: () => void;
  onClear: () => void;
  hasGame: boolean;
}

export interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}
