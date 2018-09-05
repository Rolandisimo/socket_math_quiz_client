import * as React from "react";
import { connect } from "react-redux";
import { debounce } from "lodash";
import { removeStickerAction } from "@ducks/actions";
import { selectStickers, selectGamePhase } from "@ducks/selectors";
import { GamePhase } from "@api/types";
import { StickerData } from "./types";

import * as styles from "./Sticker.scss";

const DEBOUNCE_WAIT = 100;
const EMPTY_STYLES: React.CSSProperties = {};

export enum AnimationState {
    Start = "animationStart",
    Hiding = "hiding",
    Finished = "animationEnd",
}

export interface StickerState {
    // isAnimating: boolean;
    animationState: AnimationState;
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
        animationState: AnimationState.Finished,
    };

    private stickerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private removeStickerTimeout: number | null = null;

    public componentDidUpdate(prevProps: StickerProps) {
        if ((prevProps.sticker && prevProps.sticker.id) !== (this.props.sticker && this.props.sticker.id)) {
            this.setState({
                animationState: AnimationState.Start,
            });
        }

        /**
         * Hide sticker on end round
         */
        if (
            this.state.animationState === AnimationState.Start
            && this.props.gamePhase === GamePhase.WaitingForNextGame
        ) {
            this.setState({
                animationState: AnimationState.Hiding,
            });
        }
    }

    public componentWillUnmount() {
        clearTimeout(this.removeStickerTimeout);
    }
    public render() {
        const { sticker } = this.props;

        const animationClassname = styles[this.state.animationState];
        const className = `${styles.container} ${sticker && styles[sticker.type]} ${animationClassname}`;

        /**
         * FIXME: Refactor to eliminate forced DOM reflow
         */
        const stickerStyles: React.CSSProperties = sticker && this.stickerRef.current ? {
            top: `calc(${sticker.posY} - ${this.stickerRef.current.clientHeight}px)`,
            left: `calc(${sticker.posX} - ${this.stickerRef.current.clientWidth / 2}px)`,
        } : EMPTY_STYLES;

         return (
            <div
                ref={this.stickerRef}
                style={stickerStyles}
                onTransitionEnd={this.onTransitionEnd}
                className={className}
            />
        );
    }

    /**
     * debounce used to ensure no additional state changes
     * on transition of various css rules
     */
    private onTransitionEnd = debounce(() => {
        if (
            this.props.gamePhase === GamePhase.WaitingForNextGame
            && this.state.animationState === AnimationState.Hiding
        ) {
            this.setState({
                animationState: AnimationState.Finished,
            });
            this.props.removeSticker();
        }
    }, DEBOUNCE_WAIT, { leading: true, trailing: false });
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
