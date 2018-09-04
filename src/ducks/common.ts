import {
    ADD_PLAYER,
    ADD_PLAYERS,
    SET_QUIZ,
    SET_PLAYER_SCORE,
    SET_GAME_PHASE,
    SET_ROUND_WINNER,
} from "./consts";
import { initialState, CommonState } from "./state";
import {
    AddPlayerAction,
    AddPlayersAction,
    SetQuizAction,
    SetPlayerScoreAction,
    SetGamePhaseAction,
    SetRoundWinnerAction,
} from "./actions";

export type ReducerActions =
    | AddPlayerAction
    | AddPlayersAction
    | SetQuizAction
    | SetPlayerScoreAction
    | SetGamePhaseAction
    | SetRoundWinnerAction
;

export function commonReducer(state = initialState, action: ReducerActions): CommonState {
    switch (action.type) {
        case ADD_PLAYER: {
            return {
                ...state,
                player: {
                    id: action.payload.id,
                    name: action.payload.name,
                    score: action.payload.score,
                    isPlaying: action.payload.isPlaying
                },
            };
        }
        case ADD_PLAYERS: {
            return {
                ...state,
                players: action.payload,
            };
        }
        case SET_QUIZ: {
            return {
                ...state,
                quiz: action.payload,
            };
        }
        case SET_PLAYER_SCORE: {
            return {
                ...state,
                player: {
                    ...state.player,
                    score: action.payload,
                },
            };
        }
        case SET_GAME_PHASE: {
            return {
                ...state,
                gamePhase: action.payload,
            };
        }
        case SET_ROUND_WINNER: {
            return {
                ...state,
                roundWinner: action.payload,
            };
        }
        default:
            return state;
    }
}
