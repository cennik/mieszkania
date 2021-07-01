import { Set } from 'json-set-map'

export enum ShopId {
    other = -1,
    Szybkopl = 0,
};
export enum MieszkanieState {
    waiting = 0,
    good = 1,
    bin = -1,
}

export interface Mieszkanie {
    name: string,
    url: string,
    keywords: Set<string>,
    shopId: ShopId,
    state: MieszkanieState,
    price?: number,
    bedrooms?: number,
    livingroom?: boolean,
    eatplace?: boolean,
    furnished?: boolean,
    balcony?: boolean,
    basement?: boolean,
    PWdist?: number,
    MiMdist?: number,
    PWtime?: number,
    MIMtime?: number,
    rating?: {
        kuba?: number,
        tymek?: number,
        szymon?: number,
    },
    comment?: string,
}

export const EmptyMieszkanie: Mieszkanie = {
    name: '',
    url: '',
    keywords: new Set([]),
    shopId: ShopId.other,
    state: -1,
}