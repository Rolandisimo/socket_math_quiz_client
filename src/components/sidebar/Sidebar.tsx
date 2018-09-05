import * as React from "react";
import { connect } from "react-redux";
import { Player, Players } from "@ducks/state";
import { selectPlayers, selectPlayer } from "@ducks/selectors";
import { Divider, DividerTheme } from "../divider/Divider";
import { PlayerEntry } from "./Player";

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
        return (
            <PlayerEntry
                key={i}
                isCurrentPlayer={player.id === this.props.player.id}
                player={player}
            />
        );
    }

    private parsePlayers = () => {
        const newPlayers: Player[] = [];
        for (const player in this.props.players) {
            if (this.props.players[player].name) {
                newPlayers.push(this.props.players[player]);
            }
        }
        return newPlayers
            .sort((a, b) => b.score - a.score)
            .map(this.renderPlayer);
    }
}

const mapStateToProps = (state: any): SidebarStateProps => ({
    players: selectPlayers(state),
    player: selectPlayer(state),
});
export const SidebarConnected = connect<SidebarStateProps>(
    mapStateToProps,
)(Sidebar);
