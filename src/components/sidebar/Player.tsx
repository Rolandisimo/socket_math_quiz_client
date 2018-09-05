import * as React from "react";
import { Player } from "@ducks/state";

import * as styles from "./Player.scss";

export interface PlayerProps {
    isCurrentPlayer: boolean;
    player: Player;
}

export class PlayerEntry extends React.PureComponent<PlayerProps> {
    public render() {

        const {
            isCurrentPlayer,
            player,
        } = this.props;

        return (
            <div className={styles.playerEntry}>
                <span className={`${styles.playerName} ${isCurrentPlayer && styles.currentPlayer}`}>
                    {player.name}
                </span>
                <span
                    className={`${styles.playerScore} ${player.score && styles.hasScored}`}
                >
                    {player.score}
                </span>
            </div>
        );
    }
}
