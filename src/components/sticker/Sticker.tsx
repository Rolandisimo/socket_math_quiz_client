import * as React from "react";
import { connect } from "react-redux";
import { removeStickerAction } from "@ducks/actions";
import { selectStickers, selectGamePhase } from "@ducks/selectors";
import { GamePhase } from "@api/types";
import { StickerData } from "./types";

import * as styles from "./Sticker.scss";

export interface StickerState {
    isAnimating: boolean;
}
export interface StickerStateProps {
    sticker: StickerData | undefined;
    gamePhase: GamePhase;
}
export interface StickerDispatchProps {
    removeSticker: typeof removeStickerAction;
}

export type StickerProps = StickerStateProps & StickerDispatchProps;

export class Sticker extends React.PureComponent<StickerProps, StickerState> {
    public state: StickerState = {
        isAnimating: false,
    };

    /**
     * Start from approximately the middle of the screen
     */
    private lastStickerPosX: string = "50%";
    private lastStickerPosY: string = "50%";
    private removeStickerTimeout: number | null = null;

    public componentDidUpdate(prevProps: StickerProps) {
        if ((prevProps.sticker && prevProps.sticker.id) !== (this.props.sticker && this.props.sticker.id)) {
            this.setState({
                isAnimating: true,
            });

        }

        /**
         * Hide sticker on end round
         */
        if (this.props.gamePhase === GamePhase.WaitingForNextGame) {
            this.setState({
                isAnimating: false,
            }, () => {
                this.props.removeSticker();
            });
        }
    }

    public componentWillUnmount() {
        clearTimeout(this.removeStickerTimeout);
    }
    public render() {
        const { sticker } = this.props;

        const className = sticker
            ? `${styles.container} ${styles[sticker.type]} ${this.state.isAnimating && styles.active}`
            : styles.container;

        /**
         * Until sticker container is implemented 
         */
        if (sticker) {
            this.lastStickerPosX = sticker.posX;
            this.lastStickerPosY = sticker.posY;
        }

         return (
            <div
                style={{
                    top: sticker ? sticker.posY : this.lastStickerPosY,
                    left: sticker ? sticker.posX : this.lastStickerPosX,
                }}
                className={className}
            />
        );
    }
}

const mapStateToProps = (state: any): StickerStateProps => {
    const stickers = selectStickers(state);
    return {
        sticker: stickers[stickers.length - 1],
        gamePhase: selectGamePhase(state),
    };
};
const mapDispatchToProps: StickerDispatchProps = {
    removeSticker: removeStickerAction,
};
export const StickerConnected = connect<StickerStateProps, StickerDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Sticker);
