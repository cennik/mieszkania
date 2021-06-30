import fs from 'fs';
import { Map, Set } from 'json-set-map'

import { Mieszkanie } from './types';

import { shopSrapper } from './shopI';
import { Szybkopl } from './shops/szybkopl';
import Logger from './logger';
import WebApi from './webapi';

const logger = new Logger('SCRAPPER'.bgMagenta, 'GENERAL');
const keywords = (JSON.parse(fs.readFileSync('ulice.json').toString()) as Array<string>)
    .map((keyword=>keyword.replace(/ /g, '+')));
const DATA:Map<string, Mieszkanie> = new Map(JSON.parse(fs.readFileSync('data.json').toString()))
DATA.forEach((v, key)=>{
	v.keywords = new Set(v.keywords);
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
                if(!!tmp)
                    for(let kw of mieszkanie.keywords){
                        tmp.keywords.add(kw);
                        webApi.updateEntry(tmp);
                    }
                else{
                    DATA.set(mieszkanie.url, mieszkanie);
                    webApi.addEntry(mieszkanie);
                }
            });
            logger.info(`${DATA.size.toString()} data positions`);
        }, ()=>{
            logger.info('Starting scrapping from beginning for '+scrapper.constructor.name);
            scrap([scrapper]);
        });
    });
}
function scrapAll(){
    scrap([new Szybkopl]);
}

scrapAll();

setInterval(()=>{
    fs.writeFileSync('data.json', JSON.stringify(DATA));
    logger.info('SAVING DATA')
}, 10000)



const webApi = new WebApi(DATA);