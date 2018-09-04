import * as React from "react";
import { connect } from "react-redux";
import { Players, Player } from "@ducks/state";
import { selectPlayers, selectPlayer } from "@ducks/selectors";
import { MAX_PLAYER_COUNT } from "@consts";

import { SidebarConnected } from "../sidebar/Sidebar";
import { Divider, DividerTheme } from "../divider/Divider";
import { ScreenNameConnected } from "../screen-name/ScreenName";
import { NoSlots } from "../no-slots/NoSlots";
import { QuizConnected } from "../quiz/Quiz";
import { RoundStatusConnected } from "../round-status/RoundStatus";
import { StickerConnected } from "../sticker/Sticker";

import * as styles from "./Main.scss";

export interface MainStateProps {
    players: Players;
    player: Player | undefined;
}
export type MainProps = MainStateProps;

export class Main extends React.Component<MainProps> {
    public render() {
        const { player } = this.props;

        const playerCount = Object.keys(this.props.players).length;
        const isPlaying = player && player.isPlaying;
        const canPlayerJoin = playerCount < MAX_PLAYER_COUNT;

        const bodyComponent = !isPlaying
            ? <>
                {canPlayerJoin
                    ?  <ScreenNameConnected />
                    : <NoSlots />
                }
            </>
            : <>
                <RoundStatusConnected />
                <QuizConnected />
                <StickerConnected />
            </>;

        return (
            <div className={styles.container}>
                <SidebarConnected />
                <div className={styles.content}>
                    <h1 className={styles.logo}>
                        Mathy
                    </h1>
                    <small>Do you have what it takes to become a first-grader?</small>
                    <Divider theme={DividerTheme.SmallBigMargin} />
                    {bodyComponent}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: any): MainStateProps => ({
    players: selectPlayers(state),
    player: selectPlayer(state),
});
export const MainConnected = connect<MainStateProps>(mapStateToProps)(Main);
