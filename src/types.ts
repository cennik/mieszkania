import { Set } from 'json-set-map'

export enum ShopId {
    other = -1,
    Szybkopl = 0,
    Olxpl = 1,
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
    MiMtime?: number,
    rating?: {
        kuba?: number,
        tymek?: number,
        szymon?: number,
    },
    comment?: string,
}
export function mieszkanieFormat(m: Mieszkanie) {
    m.name = String(m.name);
    m.url = String(m.url);
    m.keywords = new Set(m.keywords);
    m.shopId = Number(m.shopId);
    m.state = Number(m.state);
    if (m.price) m.price = Number(m.price);
    if (m.bedrooms) m.bedrooms = Number(m.bedrooms);
    if (m.livingroom) m.livingroom = Boolean(m.livingroom);
    if (m.eatplace) m.eatplace = Boolean(m.eatplace);
    if (m.furnished) m.furnished = Boolean(m.furnished);
    if (m.balcony) m.balcony = Boolean(m.balcony);
    if (m.basement) m.basement = Boolean(m.basement);
    if (m.PWdist) m.PWdist = Number(m.PWdist);
    if (m.MiMdist) m.MiMdist = Number(m.MiMdist);
    if (m.PWtime) m.PWtime = Number(m.PWtime);
    if (m.MiMtime) m.MiMtime = Number(m.MiMtime);
    if (m.rating) {
        if (m.rating.kuba) m.rating.kuba = Number(m.rating.kuba);
        if (m.rating.tymek) m.rating.tymek = Number(m.rating.tymek);
        if (m.rating.szymon) m.rating.szymon = Number(m.rating.szymon);
    }
    if (m.comment) m.comment = String(m.comment);
}

export const EmptyMieszkanie: Mieszkanie = {
    name: '',
    url: '',
    keywords: new Set([]),
    shopId: ShopId.other,
    state: -1,
}