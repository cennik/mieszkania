import { Mieszkanie, EmptyMieszkanie } from "./types";
import Logger from "./logger";

export abstract class shopSrapper {
    scrappedNum = 0;
    site = 1;
    keywordInd = 0;
    first = EmptyMieszkanie;
    last = EmptyMieszkanie;
    logger = new Logger(`${this.constructor.name}:`.bgGreen, this.constructor.name);
    async scrapAll(keywords: Array<string>, scrapped: (res: Mieszkanie[]) => Promise<void>, finished: () => void): Promise<void> {
        this.scrappedNum = 0;
        this.site = 1;
        this.keywordInd = 0;
        this.first = EmptyMieszkanie;
        this.last = EmptyMieszkanie
        while (true) {
            try {
                let els = await this.scrapSite(keywords[this.keywordInd]);
                if (this.shouldEnd(els)) {
                    this.keywordInd++;
                    if (this.keywordInd == keywords.length) {
                        this.logger.log(`finished with ${this.scrappedNum} scrapped at all`);
                        return finished();//end of pages
                    }
                    this.site = 1;
                    this.first = EmptyMieszkanie;
                    this.last = EmptyMieszkanie;
                    this.logger.debug(`Keyword: ${keywords[this.keywordInd]}`)
                } else {
                    this.scrappedNum += els.length;
                    scrapped(els);
                    this.site++;
                    this.logger.debug(`scrapped ${els.length}, ${this.scrappedNum} at all`);
                }
            } catch (err) {
                this.logger.error(`error scrapping site ${this.site}, trying again...`, err);
            }
        }
    }
    shouldEnd(els: Array<Mieszkanie>) {
        if (els.length == 0) return true;
        let tmp = els[0].url == this.first.url;
        if (!this.first.url) this.first = els[0];

        let tmp2 = els.length == 0 || (this.scrappedNum > 0 && els[els.length - 1].url == this.last.url);
        this.last = els[els.length - 1];
        return tmp || tmp2;
    }
    abstract scrapSite(keyword: string): Promise<Array<Mieszkanie>>;
};