import {
    SET_SCREEN_NAME,
    ADD_PLAYERS,
    ADD_PLAYER,
    SET_QUIZ,
    SET_PLAYER_SCORE,
    SET_GAME_PHASE,
} from "./consts";
import { Player, Players } from "./state";
import { emitPlayer } from "../api/api";
import { Thunk } from "../types/types";
import { selectPlayer } from "./selectors";
import { QuizType, GamePhase } from "@api/types";

export interface SetScreenNameAction {
    type: typeof SET_SCREEN_NAME;
    payload: string;
}
export function setScreenNameAction(payload: string): SetScreenNameAction {
    return {
        type: SET_SCREEN_NAME,
        payload,
    };
}
export function setScreenName(payload: string): Thunk {
    return (dispatch, getState) => {
        dispatch(setScreenNameAction(payload));

        const currentPlayer: Player = { ...selectPlayer(getState()), name: payload, isPlaying: true };
        dispatch(addPlayerAction(currentPlayer));

        emitPlayer(currentPlayer);
    };
}

export interface AddPlayersAction {
    type: typeof ADD_PLAYERS;
    payload: Players;
}
export function addPlayersAction(players: Players): AddPlayersAction {
    return {
        type: ADD_PLAYERS,
        payload: players,
    };
}

export interface AddPlayerAction {
    type: typeof ADD_PLAYER;
    payload: Player;
}
export function addPlayerAction(players: Player): AddPlayerAction {
    return {
        type: ADD_PLAYER,
        payload: players,
    };
}

export interface SetPlayerScoreAction {
    type: typeof SET_PLAYER_SCORE;
    payload: number;
}
export function setPlayerScoreAction(payload: number): SetPlayerScoreAction {
    return {
        type: SET_PLAYER_SCORE,
        payload,
    };
}

export interface SetQuizAction {
    type: typeof SET_QUIZ;
    payload: QuizType;
}
export function setQuizAction(payload: QuizType): SetQuizAction {
    return {
        type: SET_QUIZ,
        payload,
    };
}

export interface SetGamePhase {
    type: typeof SET_GAME_PHASE;
    payload: GamePhase;
}
export function setGamePhase(payload: GamePhase): SetGamePhase {
    return {
        type: SET_GAME_PHASE,
        payload,
    };
}
