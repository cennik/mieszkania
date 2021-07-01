import fs from 'fs';
import { Map, Set } from 'json-set-map'

import { Mieszkanie, mieszkanieFormat } from './types';

import { shopSrapper } from './shopI';
import { Szybkopl } from './shops/szybkopl';
import Logger from './logger';
import WebApi from './webapi';
import { Olxpl } from './shops/olxpl';

const logger = new Logger('SCRAPPER'.bgMagenta, 'GENERAL');
const keywords: Array<string> = JSON.parse(fs.readFileSync('ulice.json').toString());
const DATA: Map<string, Mieszkanie> = new Map(JSON.parse(fs.readFileSync('data.json').toString()))

DATA.forEach((v, key) => {
    mieszkanieFormat(v);
});


function validateElement(e: Mieszkanie): boolean {
    return !!e.name && !!e.url;
}

async function scrap(scrappers: Array<shopSrapper>): Promise<void> {
    scrappers.forEach((scrapper) => {
        scrapper.scrapAll(keywords, async (res) => {
            res = res.filter(validateElement);
            res.forEach(mieszkanie => {
                let tmp = DATA.get(mieszkanie.url);
                if (!!tmp)
                    for (let kw of mieszkanie.keywords) {
                        tmp.keywords.add(kw);
                        webApi.updateEntry(tmp);
                    }
                else
                    webApi.addEntry(mieszkanie);
            });
            logger.info(`${DATA.size.toString()} data positions`);
        }, () => {
            logger.info('Starting scrapping from beginning for ' + scrapper.constructor.name);
            scrap([scrapper]);
        });
    });
}
function scrapAll() {
    scrap([new Szybkopl, new Olxpl]);
}

scrapAll();

setInterval(() => {
    fs.writeFileSync('data.json', JSON.stringify(DATA));
    logger.info('SAVING DATA')
}, 10000)



const webApi = new WebApi(DATA);