import * as React from "react";
import { connect } from "react-redux";
import { selectGamePhase } from "@ducks/selectors";
import { GamePhase } from "@api/types";
import { getRoundStatus, RoundStatusType } from "./utils";

import * as styles from "./RoundStatus.scss";

export interface RoundStatusStateProps {
    gamePhase: GamePhase;
}
export type RoundStatusProps = RoundStatusStateProps;

export interface RoundStatusState {
    countdown: number;
}

export class RoundStatus extends React.PureComponent<RoundStatusProps, RoundStatusState> {
    public state = {
        countdown: 0,
    };

    private countdownIntervalId: number | null = null;
    private roundStatus: RoundStatusType = getRoundStatus(this.props.gamePhase);

    public componentDidUpdate(prevProps: RoundStatusProps) {
        if (prevProps.gamePhase !== this.props.gamePhase) {
            /**
             * Clear intervals to stop countdown decreasing
             */
            clearInterval(this.countdownIntervalId);
            this.countdownIntervalId = null;

            this.roundStatus = getRoundStatus(this.props.gamePhase);
            this.renderCountdown(this.roundStatus.timeout);
        }
    }

    public componentWillUnmount() {
        /**
         * Cleanup
         */
        clearInterval(this.countdownIntervalId);
        this.countdownIntervalId = null;
    }

    public render() {
        return (
            <div className={styles.container}>
                {this.roundStatus.message}
                {this.state.countdown !== 0 ? (
                    <span className={styles.countDown}>{this.state.countdown}</span>
                ) : null}
            </div>
        );
    }
    private renderCountdown = (timeout: number) => {
        let countdown = timeout;
        this.setState({
            countdown,
        });

        this.countdownIntervalId = window.setInterval(() => {
            --countdown;
            this.setState({
                countdown,
            });
        }, 1000);
    }
}

const mapStateToProps = (state: any): RoundStatusStateProps => ({
    gamePhase: selectGamePhase(state),
});
export const RoundStatusConnected = connect<RoundStatusStateProps>(
    mapStateToProps,
)(RoundStatus);
