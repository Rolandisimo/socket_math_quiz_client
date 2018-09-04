import {
    ADD_PLAYER,
    ADD_PLAYERS,
    SET_QUIZ,
    SET_PLAYER_SCORE,
    SET_GAME_PHASE,
    SET_ROUND_WINNER,
    ADD_STICKER,
    REMOVE_STICKER,
} from "./consts";
import { initialState, CommonState } from "./state";
import {
    AddPlayerAction,
    AddPlayersAction,
    SetQuizAction,
    SetPlayerScoreAction,
    SetGamePhaseAction,
    SetRoundWinnerAction,
    RemoveStickerAction,
    AddStickerAction,
} from "./actions";

export type ReducerActions =
    | AddPlayerAction
    | AddPlayersAction
    | SetQuizAction
    | SetPlayerScoreAction
    | SetGamePhaseAction
    | SetRoundWinnerAction
    | RemoveStickerAction
    | AddStickerAction
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
        case ADD_STICKER: {
            return {
                ...state,
                stickers: [...state.stickers, action.payload],
            };
        }
        case REMOVE_STICKER: {
            return {
                ...state,
                /**
                 * Slice everything except the 0 index element
                 * Expected to behave like a queue data structure
                 */
                stickers: state.stickers.slice(1),
            };
        }
        default:
            return state;
    }
}
