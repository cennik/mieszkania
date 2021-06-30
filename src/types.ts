import { Set } from 'json-set-map'

export enum ShopId {
    other = -1,
    Szybkopl = 0,
 };

export interface Mieszkanie {
    name: string,
    url: string,
    keywords: Set<string>,
}

export const EmptyMieszkanie:Mieszkanie = {
    name: '',
    url: '',
    keywords: new Set([])
}