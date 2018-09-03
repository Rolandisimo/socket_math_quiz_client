import * as React from "react";
import { connect } from "react-redux";
import { Player, Players } from "../../ducks/state";
import { selectPlayers, selectPlayer } from "../../ducks/selectors";
import { Divider, DividerTheme } from "../divider/Divider";

import * as styles from "./Sidebar.scss";

export interface SidebarStateProps {
    players: Players;
    player: Player;
}
export type SidebarProps = SidebarStateProps;

export class Sidebar extends React.PureComponent<SidebarProps> {
    public render() {

        const players = this.parsePlayers();

        return (
            <div className={styles.container}>
                <h3 className={styles.header}>
                    <span className={styles.playerCount}>{players.length}</span>
                    <span>Players Joined</span>
                </h3>
                <Divider theme={DividerTheme.SmallBigMargin} />
                <div>
                    {players}
                </div>
            </div>
        );
    }

    private renderPlayer = (player: Player, i: number) => {
        const currentPlayer = player.id === this.props.player.id;

        return (
            <div className={styles.playerEntry} key={i}>
                <span className={`${styles.playerName} ${currentPlayer && styles.currentPlayer}`}>{player.name}</span>
                <span
                    className={`${styles.playerScore} ${player.score && styles.hasScored}`}
                >
                    {player.score}
                </span>
            </div>
        );
    }

    private parsePlayers = () => {

        const newPlayers: Player[] = [];
        for (const player in this.props.players) {
            if (this.props.players[player].name) {
                newPlayers.push(this.props.players[player]);
            }
        }
        return newPlayers.sort((a, b) => b.score - a.score).map(this.renderPlayer);
    }
}

const mapStateToProps = (state: any): SidebarStateProps => ({
    players: selectPlayers(state),
    player: selectPlayer(state),
});
export const SidebarConnected = connect<SidebarStateProps>(
    mapStateToProps,
)(Sidebar);
