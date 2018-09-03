import * as React from "react";
import { connect } from "react-redux";
import { setScreenName } from "../../ducks/actions";

import * as styles from "./ScreenName.scss";
import { selectPlayer } from "../../ducks/selectors";
import { Player } from "../../ducks/state";
import { Divider, DividerTheme } from "../divider/Divider";

export interface ScreenNameState {
    name: string;
}
export interface ScreenNameDispatchProps {
    setScreenName: typeof setScreenName;
}
export interface ScreenNameStateProps {
    player: Player;
}
export type ScreenNameProps = ScreenNameDispatchProps & ScreenNameStateProps;

export class ScreenName extends React.PureComponent<ScreenNameProps, ScreenNameState> {
    public state: ScreenNameState = {
        name: "",
    };

    public render() {
        /**
         * We ask to enter name only if there is none set when player joins
         */
        if (this.props.player && this.props.player.name) {
            return null;
        }

        return (
            <div className={styles.content}>
                <div className={styles.contentHeader}>
                    Enter your name, please!
                    <Divider theme={DividerTheme.Small} />
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={this.state.name}
                        onChange={this.onChange}
                        className={styles.input}
                    />
                </div>
                <button
                    onClick={this.setScreenName}
                    className={`${styles.submit} ${styles.button}`}
                >
                    Submit
                </button>
            </div>
        );
    }
    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: e.currentTarget.value,
        });
    }
    private setScreenName = () => {
        if (this.state.name.length < 2) {
            return;
        }

        this.props.setScreenName(this.state.name);
    }
}

const mapStateToProps = (state: any): ScreenNameStateProps => ({
    player: selectPlayer(state),
});

const mapDispatchToProps: ScreenNameDispatchProps = {
    setScreenName,
};

export const ScreenNameConnected = connect<ScreenNameStateProps, ScreenNameDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(ScreenName);
