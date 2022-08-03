import { Log } from "express-ext";
import { ErrorMessage, Manager, Search } from "onecore";
import { buildToSave } from "pg-extension";
import { Attributes, DB, SearchBuilder, SearchResult } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import { RateCriteria, RateCriteriaFilter, RateCriteriaId, rateCriteriaModel, RateCriteriaService, RateCriteriaRepository, ShortRate, RateFullInfo } from "./rate-criteria";
import { RateCriteriaController } from "./rate-criteria-controller";
import { SqlRateCriteriaRepository } from "./rate-criteria-repository";
import { CommentValidator, Info, infoModel, RateValidator } from 'rate-core';
import { check } from 'xvalidators';
import shortid from 'shortid';
import { InfoRepository, SqlInfoRepository } from "rate-query";

export interface URL {
    id: string;
    url: string;
}
export class RateCriteriaManager implements RateCriteriaService {
    constructor(
        protected find: Search<RateCriteria, RateCriteriaFilter>,
        public repository: RateCriteriaRepository<RateCriteria>,
        public infoRepository: InfoRepository<RateFullInfo>,
        private queryURL?: (ids: string[]) => Promise<URL[]>) {
        this.search = this.search.bind(this);
        this.getRate = this.getRate.bind(this);
    }

    search(s: RateCriteria, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<RateCriteria>> {
        return this.find(s, limit, offset, fields).then(res => {
            if (!this.queryURL) {
                return res;
            } else {
                if (res.list && res.list.length > 0) {
                    const ids: string[] = [];
                    for (const rate of res.list) {
                        ids.push(rate.author);
                    }
                    return this.queryURL(ids).then(urls => {
                        for (const rate of res.list) {
                            const i = binarySearch(urls, rate.author);
                            if (i >= 0) {
                                rate.authorURL = urls[i].url;
                            }
                        }
                        return res;
                    });
                } else {
                    return res;
                }
            }
        });
    }

    async getRate(id: string, author: string): Promise<RateCriteria | null> {
        return await this.repository.getRate(id, author);
    }

    async rate(rate: RateCriteria): Promise<number> {
        const info = await this.infoRepository.load(rate.id);
        const newRate = { ...rate, time: new Date() };
        
        if (!info) {
            const r0 = await this.repository.insert(newRate, true);         
            return r0;
        }
        const exist = await this.repository.getRate(rate.id, rate.author);
        if (!exist) {
            const r1 = await this.repository.insert(newRate);
            return r1;
        }
    
        const sr: ShortRate = { review: exist.review, rates: exist.rates, time: exist.time };
        if (exist.histories && exist.histories.length > 0) {
            const history = exist.histories;
            history.push(sr);
            rate.histories = history;
        } else {
            rate.histories = [sr];
        }
        const res = await this.repository.update(newRate, exist.rate);
        return res
    }
}

export function useRateCriteriaService(db: DB, mapper?: TemplateMap): RateCriteriaService {
    const query = useQuery('rate_criteria', mapper, rateCriteriaModel, true);
    const builder = new SearchBuilder<RateCriteria, RateCriteriaFilter>(db.query, 'rate_criteria', rateCriteriaModel, db.driver, query);
    const repository = new SqlRateCriteriaRepository<RateCriteria>(db, 'rate_criteria', 'rate_full_info',['rate_info01', 'rate_info02', 'rate_info03', 'rate_info04', 'rate_info05'], 
                                            rateCriteriaModel, buildToSave, 5,'rate' ,'count', 'score', 'author', 'id','id', 'id', 'rate', 'rate1', 'rate2','rate3','rate4', 'rate5');
    const infoRepository = new SqlInfoRepository<Info>(db, 'rate_full_info', infoModel, buildToSave);
    return new RateCriteriaManager(builder.search, repository, infoRepository);
}
export function useRateCriteriaController(log: Log, db: DB, mapper?: TemplateMap): RateCriteriaController<RateCriteria, RateCriteriaFilter> {
    const rateValidator = new RateCriteriaValidator(rateCriteriaModel, check, 10);
    return new RateCriteriaController(log, useRateCriteriaService(db, mapper), rateValidator, ['dates'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'], generate,
                                     'commentId', 'userId', 'author', 'id');
}
function binarySearch(ar: URL[], el: string): number {
    let m = 0;
    let n = ar.length - 1;
    while (m <= n) {
        // tslint:disable-next-line:no-bitwise
        const k = (n + m) >> 1;
        const cmp = compare(el, ar[k].id);
        if (cmp > 0) {
            m = k + 1;
        } else if (cmp < 0) {
            n = k - 1;
        } else {
            return k;
        }
    }
    return -m - 1;
}
function compare(s1: string, s2: string): number {
    return s1.localeCompare(s2);
}
export class RateCriteriaValidator {
    constructor(protected attributes: Attributes, protected check: (obj: any, attributes: Attributes) => ErrorMessage[], protected max: number) {
        this.validate = this.validate.bind(this);
    }
    validate(rateCriteria: RateCriteria): Promise<ErrorMessage[]> {
        const errs = this.check(rateCriteria, this.attributes);
        for (let i in rateCriteria.rates) {
            if (rateCriteria.rates[i] > this.max) {
                const err = createError('rate', 'max', this.max);
                if (errs) {
                    errs.push(err);
                    return Promise.resolve(errs);
                } else {
                    return Promise.resolve([err]);
                }
            }
        }
        return Promise.resolve(errs);
    }
}
function createError(field: string, code?: string, param?: string | number | Date): ErrorMessage {
    if (!code) {
        code = 'string';
    }
    const error: ErrorMessage = { field, code };
    if (param) {
        error.param = param;
    }
    return error;
}
export function generate(): string {
    return shortid.generate();
}