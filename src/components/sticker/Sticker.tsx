import * as React from "react";
import { connect } from "react-redux";
import { removeStickerAction } from "@ducks/actions";
import { selectStickers } from "@ducks/selectors";
import { StickerData } from "./types";

import * as styles from "./Sticker.scss";

/**
 * Used in timeouts for removing sticker
 * from state
 */
const STICKER_LIFETIME = 5000;

export interface StickerState {
    isAnimating: boolean;
}
export interface StickerStateProps {
    sticker: StickerData | undefined;
}
export interface StickerDispatchProps {
    removeSticker: typeof removeStickerAction;
}

export type StickerProps = StickerStateProps & StickerDispatchProps;

export class Sticker extends React.PureComponent<StickerProps, StickerState> {
    public state: StickerState = {
        isAnimating: false,
    };

    private removeStickerTimeout: number | null = null;

    public componentDidMount() {
        this.setState({
            isAnimating: true,
        });

        this.removeStickerTimeout = window.setTimeout(() => {
            this.setState({
                isAnimating: false,
            }, () => {
                this.props.removeSticker();
            });
        }, STICKER_LIFETIME);
    }

    public componentDidUpdate(prevProps: StickerProps) {
        if ((prevProps.sticker && prevProps.sticker.id) !== (this.props.sticker && this.props.sticker.id)) {
            this.setState({
                isAnimating: true,
            });

            this.removeStickerTimeout = window.setTimeout(() => {
                this.setState({
                    isAnimating: false,
                }, () => {
                    this.props.removeSticker();
                });
            }, STICKER_LIFETIME);
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

         return (
            <div
                style={{
                    top: sticker && sticker.posY,
                    left: sticker && sticker.posX,
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
    };
};
const mapDispatchToProps: StickerDispatchProps = {
    removeSticker: removeStickerAction,
};
export const StickerConnected = connect<StickerStateProps, StickerDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Sticker);
