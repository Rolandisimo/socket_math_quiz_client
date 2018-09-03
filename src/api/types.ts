export interface QuizType {
    question: string;
    answer: boolean;
}

export enum GamePhase {
    End,
    Start,
    WaitingForNextGame,
}
