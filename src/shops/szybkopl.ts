import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { Set } from 'json-set-map'
import { Mieszkanie, EmptyMieszkanie, MieszkanieState, ShopId } from '../types';
import { shopSrapper } from '../shopI';

export class Szybkopl extends shopSrapper {
    static url = 'https://www.szybko.pl/l/na-wynajem/pokoj/Warszawa/';
    static urlParams = '&price_max_rent=1400'
    scrapSite(keyword: string): Promise<Array<Mieszkanie>> {
        return new Promise((resolve, reject) => {
            fetch(`${Szybkopl.url}${keyword.replace(/ /g, '+')}?strona=${this.site}&${Szybkopl.urlParams}`).then(res => res.text()).then((html) => {
                const $ = cheerio.load(html);
                let empty = $('span:contains("Niestety w tej chwili nie mamy ofert w podanej")');
                if (empty.length > 0)
                    return resolve([]);//Not found any offer

                let els = $('.listing-title-heading.hide-overflow-text', '.listing-item:not(:contains("ARCHIWALNA"))').toArray();
                let res: Array<Mieszkanie> = els.map(el => {
                    let url = el.attribs.href;
                    if (url[0] == '/') url = 'https://www.szybko.pl' + url;
                    let name = cheerio.default.text([el]).split('\n')[1];
                    return { url, name, keywords: new Set([keyword]), state: MieszkanieState.waiting, shopId: ShopId.Szybkopl };
                });
                resolve(res);
            }).catch(function (err) {
                reject(err);
            });
        });
    }
}