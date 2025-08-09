// src/types/game.ts
export type PlayerID = string;

export interface PlayerInfo {
    id: PlayerID;
    name: string;
    total_score: number;
    total_win: number;
    total_lose: number;
}


export interface Round {
    round_num: number;
    result: -1 | 0 | 1; // -1 = ongoing, 0 = draw, 1 = win
    winner: PlayerID | null;
    player_1: {
        id: PlayerID;
        score: number;
    };
    player_2: {
        id: PlayerID;
        score: number;
    };
}

export type BoardCell = -1 | 0 | 1;

export interface Match {
    round_winner?: {
        player: PlayerID | null;
    }
    id: string;
    total_rounds: number;
    running_round: number;
    completed_round: number;
    result: -1 | 0 | 1; // -1 = ongoing, 0 = draw, 1 = win
    participating_players: {
        player_1: PlayerInfo;
        player_2: PlayerInfo;
    };
    final_winner: {
        player: PlayerID | null;
        score: number;
        rounds_win: number;
    };
    rounds: Round[];
    current_display: BoardCell[][];
}

export interface GameState {
    total_matches: number;
    matches: Match[];
    current_match: Match | null;
    current_turn: PlayerID | null;
    
}
