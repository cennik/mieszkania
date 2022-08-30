import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { Set } from 'json-set-map'
import { Mieszkanie, EmptyMieszkanie, MieszkanieState, ShopId } from '../types';
import { shopSrapper } from '../shopI';

export class Olxpl extends shopSrapper {
    static url = 'https://www.olx.pl/d/nieruchomosci/mieszkania/warszawa/q-';
    static urlParams = 'search%5Bfilter_float_price:to%5D=4200&search%5Bfilter_enum_rooms%5D%5B0%5D=three';
    scrapSite(keyword: string): Promise<Array<Mieszkanie>> {
        return new Promise((resolve, reject) => {
            fetch(`${Olxpl.url}${keyword.replace(/ /g, '-')}/?page=${this.site}&${Olxpl.urlParams}`).then(res => res.text()).then((html) => {
                const $ = cheerio.load(html);
                let empty = $('p:contains("Nie znaleźliśmy ogłoszeń dla tego zapytania")');
                let empty2 = $('h1.c41.lheight24:contains("Brak wyników")');
                let empty3 = $('span.current').toArray();

                if (empty.length > 0 || empty2.length > 0 || (empty3.length && parseInt(cheerio.default.text(empty3)) != this.site)) {
                    return resolve([]);//Not found any offer
                }

                let els = $('a').toArray().filter((element) => element.attribs.href &&
                    (element.attribs.href.startsWith('/d/oferta/') || element.attribs.href.startsWith('https://www.otodom.pl/pl/oferta/')));
                let res: Array<Mieszkanie> = els.map(el => {
                    let url = el.attribs.href;
                    if (url[0] == '/') url = 'https://www.olx.pl' + url;
                    if (url.indexOf('#') != -1)
                        url = url.substring(0, url.indexOf('#'));
                    let name = $('h6', el).text();
                    let price = parseInt($('p', el).text().replace(' ', ''));
                    return { url, name, price, keywords: new Set([keyword]), state: MieszkanieState.waiting, shopId: ShopId.Olxpl };
                });
                resolve(res);
            }).catch(function (err) {
                reject(err);
            });
        });
    }
}