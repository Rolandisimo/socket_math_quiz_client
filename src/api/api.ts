import { Dispatch } from "redux";
import {
    addPlayersAction,
    addPlayerAction,
    setQuizAction,
    setGamePhase,
} from "../ducks/actions";
import { Player, Players } from "../ducks/state";
import {
    SUBSCRIBE_PLAYER,
    CHANGE_SCORE,
    QUIZ_END,
    STATE,
    QUIZ_START,
} from "@api/consts";
import { socket } from "@api/socket";
import { QuizType, GamePhase } from "@api/types";

export function emitPlayer(player: Player) {
    socket.emit(SUBSCRIBE_PLAYER, player);
}
export function subscribePlayer(dispatch: Dispatch<any>) {
    socket.on(SUBSCRIBE_PLAYER, (player: Player) => {
        /**
         * Emit event to the server
         */
        dispatch(addPlayerAction(player));
        socket.emit(SUBSCRIBE_PLAYER, player);
    });
}

export function listenGameState(dispatch: Dispatch<any>) {
    socket.on(STATE, (players: Players) => {
        dispatch(addPlayersAction(players));
    });
}

export function emitScore(playerId: string, score: number) {
    socket.emit(CHANGE_SCORE, playerId, score);
}

export function emitQuizEnded(playerId: string, score: number) {
    socket.emit(QUIZ_END, playerId, score);
}

const ROUND_START = "ROUND_START";
const ROUND_END = "ROUND_END";
export function listenQuizStart(dispatch: Dispatch<any>) {
    socket.on(QUIZ_END, () => {
        console.log("QUIZ ENDED, CHANGE UI")
    })

    socket.on(ROUND_START, () => {
        console.log("CLIENT: ROUND_STARTED")
        dispatch(setGamePhase(GamePhase.Start));
    });
    socket.on(ROUND_END, () => {
        console.log("CLIENT: ROUND_ENDED")
        dispatch(setGamePhase(GamePhase.WaitingForNextGame));
    });

    socket.on(QUIZ_START, (quiz: QuizType) => {
        dispatch(setQuizAction(quiz));
    });
}
