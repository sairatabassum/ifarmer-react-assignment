import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Match, PlayerID, Round } from '../../app/assignment-1/types/game';



const initialState: GameState = {
  total_matches: 0,
  matches: [],
  current_match: null,
  current_turn: null,
  
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    /** Step 1: Initialize a New Match **/
    startNewMatch: (
      state,
      action: PayloadAction<{
        player1Name: string;
        player2Name: string;
        totalRounds?: number;
      }>
    ) => {
      const id1 = nanoid();
      const id2 = nanoid();
      const matchId = nanoid();

      const totalRounds = action.payload.totalRounds ?? 5;

      const newMatch: Match = {
        id: matchId,
        total_rounds: totalRounds,
        running_round: 1,
        completed_round: 0,
        result: -1,
        participating_players: {
          player_1: {
            id: id1,
            name: action.payload.player1Name,
            total_score: 0,
            total_win: 0,
            total_lose: 0,
          },
          player_2: {
            id: id2,
            name: action.payload.player2Name,
            total_score: 0,
            total_win: 0,
            total_lose: 0,
          },
        },
        final_winner: {
          player: null,
          score: 0,
          rounds_win: 0,
        },
        rounds: [],
        current_display: [
          [-1, -1, -1],
          [-1, -1, -1],
          [-1, -1, -1],
        ],
      };

      state.current_match = newMatch;
      state.matches.push(newMatch);
      state.total_matches += 1;
      state.current_turn = id1;

    },

    /** Step 2: Handle Move on Board **/
    makeMove: (
      state,
      action: PayloadAction<{ row: number; col: number; playerId: PlayerID }>
    ) => {
      const match = state.current_match;
      if (!match) return;

      const { row, col, playerId } = action.payload;

      if (match.current_display[row][col] === -1) {
        match.current_display[row][col] = playerId === match.participating_players.player_1.id ? 0 : 1;

        // Switch turn
        state.current_turn =
          playerId === match.participating_players.player_1.id
            ? match.participating_players.player_2.id
            : match.participating_players.player_1.id;
      }
    },

    /** Step 3: Complete a Round **/
    completeRound: (
      state,
      action: PayloadAction<{ winnerId: string | null; isDraw: boolean }>
    ) => {
      if (!state.current_match) return;

      const { winnerId, isDraw } = action.payload;
      const match = state.current_match;
      // Update player stats
      const p1 = match.participating_players.player_1;
      const p2 = match.participating_players.player_2;
     
      const newRound = {
        round_num: match.running_round,
        winner: winnerId,
        result: isDraw ? 0 : 1, // 1 for win, 0 for draw, -1 for ongoing
      };

      // Add the new round to the rounds history
      match.rounds.push(newRound as Round);
      match.completed_round = match.rounds.length;

  

      if (winnerId === p1.id) {
        p1.total_win += 1;
        p1.total_score += 2;

        p2.total_lose += 1;
        p2.total_score += 1; // add 1 point to loser
      } else if (winnerId === p2.id) {
        p2.total_win += 1;
        p2.total_score += 2;

        p1.total_lose += 1;
        p1.total_score += 1; // add 1 point to loser
      }


      // Check for final winner
      const p1Wins = match.participating_players.player_1.total_win;
      const p2Wins = match.participating_players.player_2.total_win;

      // Logic for an early winner (3 rounds won)
      if (p1Wins === 3) {
        match.final_winner.player = match.participating_players.player_1.id;
        match.result = 1; // Player 1 wins
      } else if (p2Wins === 3) {
        match.final_winner.player = match.participating_players.player_2.id;
        match.result = 1; // Player 2 wins
      }
      // Logic for winner after 5 rounds
      else if (match.completed_round === match.total_rounds) {
        if (p1Wins > p2Wins) {
          match.final_winner.player = match.participating_players.player_1.id;
          match.result = 1;
        } else if (p2Wins > p1Wins) {
          match.final_winner.player = match.participating_players.player_2.id;
          match.result = 1;
        } else {
          // It's a draw
          match.final_winner.player = null;
          match.result = 0;
        }
      }

      // Sync current_match back into matches array
      const index = state.matches.findIndex(m => m.id === match.id);
      if (index !== -1) {
        state.matches[index] = { ...match };
      }

    },


    /** Step 4: Reset Board (Not Match) **/
    resetBoard: (state) => {
      if (state.current_match) {
        state.current_match.current_display = [
          [-1, -1, -1],
          [-1, -1, -1],
          [-1, -1, -1],
        ];
      }
    },
    
    nextRound: (state) => {
      if (!state.current_match) return;
      state.current_match.running_round += 1;
      state.current_match.current_display = Array(3)
        .fill(null)
        .map(() => Array(3).fill(-1));
      state.current_turn = state.current_match.participating_players.player_1.id;
    },

    /** Step 5: Restart Entire Match **/
    restartMatch: (state) => {
      if (!state.current_match) return;
      const p1 = state.current_match.participating_players.player_1;
      const p2 = state.current_match.participating_players.player_2;

      state.current_match = {
        ...state.current_match,
        running_round: 1,
        completed_round: 0,
        current_display: Array(3).fill(null).map(() => Array(3).fill(-1)),
        rounds: [],
        final_winner: { player: null, score: 0, rounds_win: 0 },
        result: -1,
        participating_players: {
          player_1: { ...p1, total_win: 0, total_score: 0 },
          player_2: { ...p2, total_win: 0, total_score: 0 },
        },
      };
      state.current_turn = p1.id;
    },

    /** Step 6: Reset Leaderboard **/
    resetLeaderboard: (state) => {
      state.current_match = null;
      state.matches = [];
      state.total_matches = 0;
      state.current_turn = null;
    }

    
  }
});

export const {
  startNewMatch,
  makeMove,
  completeRound,
  resetBoard,
  restartMatch,
  resetLeaderboard,
  nextRound
} = gameSlice.actions;

export default gameSlice.reducer;