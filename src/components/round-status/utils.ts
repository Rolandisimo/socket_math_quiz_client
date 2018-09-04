import { GamePhase } from "@api/types";

export interface RoundStatusType {
    timeout: number;
    message: string;
}
export function getRoundStatus(gamePhase: GamePhase): RoundStatusType {
    switch(gamePhase) {
        case GamePhase.Start: {
            return {
                timeout: 10,
                message: "Round Started",
            };
        }
        case GamePhase.WaitingForNextGame: {
            return {
                timeout: 5,
                message: "Wait for the next round",
            };
        }
        default:
            return {
                timeout: 0,
                message: "Let's play!",
            };
    }
}
