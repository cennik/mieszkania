import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { Set } from 'json-set-map'
import { Mieszkanie, EmptyMieszkanie, MieszkanieState, ShopId } from '../types';
import { shopSrapper } from '../shopI';

export class Szybkopl extends shopSrapper {
    static url = 'https://www.szybko.pl/l/na-wynajem/lokal-mieszkalny+mieszkanie/Warszawa';
    static urlParams = '&price_max_rent=4200&rooms_min=3&rooms_max=3'
    scrapSite(keyword: string): Promise<Array<Mieszkanie>> {
        return new Promise((resolve, reject) => {
            fetch(`${Szybkopl.url}${keyword.replace(/ /g, '+')}?strona=${this.site}&${Szybkopl.urlParams}`).then(res => res.text()).then((html) => {
                const $ = cheerio.load(html);
                let empty = $('span:contains("Niestety w tej chwili nie mamy ofert w podanej")');
                if (empty.length > 0)
                    return resolve([]);//Not found any offer

                let els = $('.listing-item').toArray();
                let res: Array<Mieszkanie> = els.map(el => {
                    let text = $('.listing-title-heading', el)[0];
                    let url = text.attribs.href;
                    if (url[0] == '/') url = 'https://www.szybko.pl' + url;
                    let name = cheerio.default.text([text]).split('\n')[1];
                    let price = parseInt($('.listing-price', el).text().replace(' ', ''));
                    return { url, name, price, keywords: new Set([keyword]), state: MieszkanieState.waiting, shopId: ShopId.Szybkopl };
                });
                resolve(res);
            }).catch(function (err) {
                reject(err);
            });
        });
    }
}