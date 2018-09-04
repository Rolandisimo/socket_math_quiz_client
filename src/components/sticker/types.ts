export enum StickerType {
    Win = "win",
    Lose = "lose",
    Late = "late",
}

/**
 * Used when adding sticker
 */
export interface StickerDataRaw {
    posX: number;
    posY: number;
    type: StickerType;
}
export interface StickerData {
    /**
     * For removing stickers
     */
    id: number;
    /**
     * % value
     */
    posX: string;
    posY: string;
    type: StickerType;
}
