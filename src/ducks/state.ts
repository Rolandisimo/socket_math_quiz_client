import { QuizType, GamePhase } from "@api/types";
import { StickerData } from "../components/sticker/types";

export interface Player {
    id: string;
    name: string;
    score: number;
    isPlaying: boolean;
}
export type Players = { [key: string]: Player; };

export interface CommonState {
    players: Players;
    player: Player | undefined;
    quiz: QuizType | undefined;
    gamePhase: GamePhase;
    roundWinner: Player | undefined;
    stickers: StickerData[];
}
// Initial state
export const initialState: CommonState = {
    players: {},
    player: undefined,
    quiz: undefined,
    gamePhase: GamePhase.Start,
    roundWinner: undefined,
    stickers: [],
};
