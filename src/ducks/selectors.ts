import { Player, Players } from "./state";
import { RootState } from "./rootState";
import { QuizType, GamePhase } from "@api/types";

export const selectPlayers = (state: RootState): Players => state.common.players;
export const selectPlayer = (state: RootState): Player | undefined => state.common.player;
export const selectQuiz = (state: RootState): QuizType | undefined => state.common.quiz;
export const selectGamePhase = (state: RootState): GamePhase => state.common.gamePhase;
