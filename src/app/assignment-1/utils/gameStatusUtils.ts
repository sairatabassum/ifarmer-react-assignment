// src/utils/gameStatusUtils.ts
import type { PlayerID, Match, Round } from '@/app/assignment-1/types/game';

export const getPlayerName = (
    id: PlayerID | null | undefined,
    match: Match
): string => {
    if (!id) return '';
    const { player_1: p1, player_2: p2 } = match.participating_players;
    return id === p1.id ? p1.name : p2.name;
};

export const getLastRound = (match: Match): Round | undefined => {
    return match.rounds.length > 0 ? match.rounds[match.rounds.length - 1] : undefined;
};

export const isCurrentRoundComplete = (match: Match): boolean => {
    return match.rounds.some((round) => round.round_num === match.running_round);
};

export const getWinnerId = (match: Match): PlayerID | null => {
    if (!isCurrentRoundComplete(match)) return null;
    const lastRound = getLastRound(match);
    return lastRound?.winner ?? null;
};

export const isDrawRound = (match: Match): boolean => {
    if (!isCurrentRoundComplete(match)) return false;
    const lastRound = getLastRound(match);
    return lastRound?.result === 0;
};
