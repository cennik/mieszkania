import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { Set } from 'json-set-map'
import { Mieszkanie, EmptyMieszkanie } from '../types';
import { shopSrapper } from '../shopI';

export class Szybkopl extends shopSrapper {
    static url = 'https://www.szybko.pl/l/na-wynajem/lokal-mieszkalny/warszawa+';
    static urlParams = 'assetType=lokal-mieszkalny&localization_search_text=Warszawa%20Bruna&price_max_rent=3500&rooms_min=3'
    static opts = {headers: {cookie: 'szybko-search-params=%7B%22assetCategory%22%3A%22na-wynajem%22%2C%22assetType%22%3A%22lokal-mieszkalny%22%2C%22assetSubType%22%3A%22%22%2C%22rooms_min%22%3A%223%22%2C%22price_max_rent%22%3A%223500%22%7D'}}
    scrapSite(keyword: string): Promise<Array<Mieszkanie>> {
        return new Promise((resolve, reject) => {
            fetch(`${Szybkopl.url}${keyword.replace(' ', '+')}?strona=${this.site}`, Szybkopl.opts).then(res=>res.text()).then((html) => {
                const $ = cheerio.load(html);
                let empty = $('span:contains("Niestety w tej chwili nie mamy ofert w podanej")');
                if(empty.length > 0)
                    return resolve([]);//Not found any offer
                
                let els = $('.listing-title-heading.hide-overflow-text', '.listing-item:not(:contains("ARCHIWALNA"))').toArray();
                let res: Array<Mieszkanie> = els.map(el=>{
                    let url = el.attribs.href;
                    if(url[0]=='/') url = 'https://www.szybko.pl'+url;
                    let name = cheerio.default.text([el]).split('\n')[1];
                    return {url, name, keywords: new Set([keyword])};
                });
                resolve(res);
            }).catch(function (err) {
                reject(err);
            });
        });
    }
}