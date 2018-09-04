import * as React from "react";
import { connect } from "react-redux";
import { selectPlayer, selectQuiz, selectRoundWinner } from "@ducks/selectors";
import { Player } from "@ducks/state";

import { QuizType } from "@api/types";

import * as styles from "./Quiz.scss";
import { setPlayerScoreAction, setRoundWinnerAction } from "@ducks/actions";
import { emitScore, emitRoundWinner } from "@api/api";

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
}
export interface QuizStateProps {
    player: Player | undefined;
    quiz: QuizType | undefined;
    roundWinner: Player | undefined;
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
        || nextState.buttonTypePressed !== this.state.buttonTypePressed;
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

        const buttonTrueAnswerTypeClass = buttonTypePressed === ButtonType.Yes
            && (isAnswerCorrect ? styles.correct : styles.wrong);
        const buttonFalseAnswerTypeClass = buttonTypePressed === ButtonType.No
            && (isAnswerCorrect ? styles.correct : styles.wrong);

        return (
            <div className={styles.container}>
                <h1>{question}</h1>
                <div className={styles.buttonContainer}>
                    <button
                        className={`${styles.button} ${buttonTrueAnswerTypeClass}`}
                        onClick={this.changeScore}
                        data-answer-type={true}
                    >
                        Yes
                    </button>
                    <button
                        className={`${styles.button} ${buttonFalseAnswerTypeClass}`}
                        onClick={this.changeScore}
                        data-answer-type={false}
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
        const {
            player,
            quiz,
        } = this.props;

        if (player && !this.hasAnswered) {
            this.hasAnswered = true;

            const buttonType = e.currentTarget.dataset.answerType as ButtonType;

            const buttonTypePressed = JSON.parse(buttonType) as boolean;
            const isAnswerCorrect = buttonTypePressed === quiz.answer;

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
                }
            } else {
                /**
                 * Wrong answers add penalty
                 * always
                 */
                newScore -= 1;
            }

            /**
             * Regardless of the result,
             * emit the score and optimistically
             * set player score
             */
            emitScore(player.id, newScore);
            this.props.setPlayerScore(newScore);
        }
    }
}

const mapStateToProps = (state: any): QuizStateProps => ({
    player: selectPlayer(state),
    quiz: selectQuiz(state),
    roundWinner: selectRoundWinner(state),
});
const mapDispatchToProps: QuizDispatchProps = {
    setPlayerScore: setPlayerScoreAction,
    setRoundWinner: setRoundWinnerAction,
};
export const QuizConnected = connect<QuizStateProps, QuizDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Quiz);
