import * as React from "react";
import { connect } from "react-redux";
import { selectGamePhase } from "@ducks/selectors";
import { GamePhase } from "@api/types";

export interface RoundStatusStateProps {
    gamePhase: GamePhase;
}
export type RoundStatusProps = RoundStatusStateProps;

export class RoundStatus extends React.PureComponent<RoundStatusProps> {
    render() {
        return (
            <div>
                round status
            </div>
        );
    }
}

const mapStateToProps = (state: any): RoundStatusStateProps => ({
    gamePhase: selectGamePhase(state),
});
export const RoundStatusConnected = connect<RoundStatusStateProps>(
    mapStateToProps,
)(RoundStatus);
