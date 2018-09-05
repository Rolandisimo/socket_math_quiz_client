import * as React from "react";
import { connect } from "react-redux";
import {
    selectPlayer,
    selectQuiz,
    selectRoundWinner,
    selectGamePhase,
} from "@ducks/selectors";
import { Player } from "@ducks/state";
import { QuizType, GamePhase } from "@api/types";
import {
    setPlayerScoreAction,
    setRoundWinnerAction,
    addSticker,
} from "@ducks/actions";
import { emitScore, emitRoundWinner } from "@api/api";
import { StickerType } from "../sticker/types";

import * as styles from "./Quiz.scss";

export enum ButtonType {
    Yes = "true",
    No = "false",
}

export interface QuizState {
    buttonTypePressed: ButtonType | undefined;
    isAnswerCorrect: boolean | undefined;
}

export interface QuizDispatchProps {
    setPlayerScore: typeof setPlayerScoreAction;
    setRoundWinner: typeof setRoundWinnerAction;
    addSticker: typeof addSticker;
}
export interface QuizStateProps {
    player: Player | undefined;
    quiz: QuizType | undefined;
    roundWinner: Player | undefined;
    gamePhase: GamePhase;
}
export type QuizProps = QuizStateProps & QuizDispatchProps;

export class Quiz extends React.Component<QuizProps, QuizState> {
    private hasAnswered = false;

    public state: QuizState = {
        buttonTypePressed: undefined,
        isAnswerCorrect: undefined,
    };

    public shouldComponentUpdate(nextProps: QuizProps, nextState: QuizState) {
        return nextProps.quiz.question !== this.props.quiz.question
        || nextState.isAnswerCorrect !== this.state.isAnswerCorrect
        || nextState.buttonTypePressed !== this.state.buttonTypePressed
        || nextProps.gamePhase !== this.props.gamePhase;
    }
    public componentDidUpdate(prevProps: QuizProps) {
        if (prevProps.quiz.question !== this.props.quiz.question) {
            this.props.setRoundWinner(undefined);
            this.hasAnswered = false;
            this.resetState();
        }
    }

    public render() {
        if (!this.props.quiz) {
            return null;
        }

        const { question } = this.props.quiz;
        const {
            buttonTypePressed,
            isAnswerCorrect,
        } = this.state;

        /**
         * Style handling
         */
        const buttonTrueAnswerTypeClass = buttonTypePressed === ButtonType.Yes
            && (isAnswerCorrect ? styles.correct : styles.wrong);
        const buttonFalseAnswerTypeClass = buttonTypePressed === ButtonType.No
            && (isAnswerCorrect ? styles.correct : styles.wrong);
        const buttonDisabled = this.props.gamePhase === GamePhase.WaitingForNextGame;

        return (
            <div className={styles.container}>
                <h1>{question}</h1>
                <div className={styles.buttonContainer}>
                    <button
                        className={`${styles.button} ${buttonTrueAnswerTypeClass}`}
                        onClick={this.changeScore}
                        data-answer-type={true}
                        disabled={buttonDisabled}
                    >
                        Yes
                    </button>
                    <button
                        className={`${styles.button} ${buttonFalseAnswerTypeClass}`}
                        onClick={this.changeScore}
                        data-answer-type={false}
                        disabled={buttonDisabled}
                    >
                        No
                    </button>
                </div>
            </div>
        );
    }

    private resetState = () => {
        this.setState({
            buttonTypePressed: undefined,
            isAnswerCorrect: undefined,
        });
    }

    private changeScore = (e: React.MouseEvent<HTMLButtonElement>) => {
        /**
         * Don't allow players to vote when round has ended
         */
        if (this.props.gamePhase !== GamePhase.Start) {
            return;
        }

        const {
            player,
            quiz,
        } = this.props;

        if (player && !this.hasAnswered) {
            this.hasAnswered = true;

            const buttonType = e.currentTarget.dataset.answerType as ButtonType;

            const buttonTypePressed = JSON.parse(buttonType) as boolean;
            const isAnswerCorrect = buttonTypePressed === quiz.answer;

            let stickerType: StickerType;

            this.setState({
                buttonTypePressed: buttonTypePressed ? ButtonType.Yes : ButtonType.No,
                isAnswerCorrect,
            });

            let newScore = player.score;
            if (isAnswerCorrect) {

                /**
                 * Only the first player gets
                 * a point for a correct answer
                 */
                if (!this.props.roundWinner) {
                    emitRoundWinner(player.id);
                    newScore += 1;

                    stickerType = StickerType.Win;
                } else {
                    stickerType = StickerType.Late;
                }
            } else {
                /**
                 * Wrong answers add penalty
                 * always
                 */
                newScore -= 1;
                stickerType = StickerType.Lose;
            }

            /**
             * Regardless of the result,
             * emit the score and optimistically
             * set player score
             */
            this.props.addSticker({
                posX: e.pageX,
                posY: e.pageY,
                type: stickerType,
            });
            emitScore(player.id, newScore);
            this.props.setPlayerScore(newScore);
        }
    }
}

const mapStateToProps = (state: any): QuizStateProps => ({
    player: selectPlayer(state),
    quiz: selectQuiz(state),
    roundWinner: selectRoundWinner(state),
    gamePhase: selectGamePhase(state),
});
const mapDispatchToProps: QuizDispatchProps = {
    setPlayerScore: setPlayerScoreAction,
    setRoundWinner: setRoundWinnerAction,
    addSticker,
};
export const QuizConnected = connect<QuizStateProps, QuizDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Quiz);
