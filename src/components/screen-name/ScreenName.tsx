import * as React from "react";
import { connect } from "react-redux";

import { setScreenName } from "@ducks/actions";
import { selectPlayer, selectPlayers } from "@ducks/selectors";
import { Player, Players } from "@ducks/state";
import { getPressedKey, isEnterKey } from "@utils/keyboardEvents";
import { checkIfNameExists } from "@utils/functions";

import { Divider, DividerTheme } from "../divider/Divider";
import { ErrorType, getErrorText } from "./utils";

import * as styles from "./ScreenName.scss";

export interface ScreenNameState {
    name: string;
    errorType: ErrorType | undefined;
}
export interface ScreenNameDispatchProps {
    setScreenName: typeof setScreenName;
}
export interface ScreenNameStateProps {
    player: Player;
    players: Players;
}
export type ScreenNameProps = ScreenNameDispatchProps & ScreenNameStateProps;

export class ScreenName extends React.PureComponent<ScreenNameProps, ScreenNameState> {
    public state: ScreenNameState = {
        name: "",
        errorType: undefined,
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
                        onKeyUp={this.onEnterKey}
                        maxLength={20}
                    />
                </div>
                <button
                    onClick={this.setScreenName}
                    className={`${styles.submit} ${styles.button}`}
                >
                    Submit
                </button>
                {this.state.errorType !== undefined && (
                    <div className={styles.error}>
                        {getErrorText(this.state.errorType)}
                    </div>
                )}
            </div>
        );
    }
    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            errorType: undefined,
            name: e.currentTarget.value,
        });
    }
    private setScreenName = () => {
        /**
         * Notify player if name is too short
         */
        if (this.state.name.length < 2) {
            this.setState({
                errorType: ErrorType.NameTooShort,
            });
            return;
        }

        /**
         * Notify player if name already exists
         */
        if (checkIfNameExists(this.state.name, this.props.players)) {
            this.setState({
                errorType: ErrorType.DuplicateName,
            });

            return;
        }

        this.props.setScreenName(this.state.name);
    }
    private onEnterKey = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const keyPressed = getPressedKey(event);
       /**
        * If more key presses have to be handled
        * then create universal keyHandler or use a lib
        */
       if (keyPressed && isEnterKey(keyPressed) && this.state.name) {
            this.setScreenName();
       }
   }
}

const mapStateToProps = (state: any): ScreenNameStateProps => ({
    player: selectPlayer(state),
    players: selectPlayers(state),
});

const mapDispatchToProps: ScreenNameDispatchProps = {
    setScreenName,
};

export const ScreenNameConnected = connect<ScreenNameStateProps, ScreenNameDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(ScreenName);
