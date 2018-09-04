import { Player, Players } from "./state";
import { RootState } from "./rootState";
import { QuizType, GamePhase } from "@api/types";
import { StickerData } from "../components/sticker/types";

export const selectPlayers = (state: RootState): Players => state.common.players;
export const selectPlayer = (state: RootState): Player | undefined => state.common.player;
export const selectQuiz = (state: RootState): QuizType | undefined => state.common.quiz;
export const selectGamePhase = (state: RootState): GamePhase => state.common.gamePhase;
export const selectRoundWinner = (state: RootState): Player => state.common.roundWinner;
export const selectStickers = (state: RootState): StickerData[] => state.common.stickers;
