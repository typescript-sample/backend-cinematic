import { attr, Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { buildCountQuery, buildToInsert, buildToInsertBatch, DB, postgres, Repository, SearchBuilder, Service, Statement } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Rate, RateFilter, RateId, rateModel, RateRepository, RateService, Info, infoModel, InfoRepository, UsefulRateRepository, UsefulRate, usefulRateModel, UsefulRateFilter, UsefulRateId, UsefulRateService } from './rate';
import { RateController } from './rate-controller';
import { SqlRateRepository } from './sql-rate-repository';
import { SqlInfoRepository } from './sql-info-repository';
import { buildToSave } from 'pg-extension';
import { SqlUsefulRateRepository } from './sql-useful-repository';

export * from './rate-controller';
export * from './rate';
export { RateController };

export class RateManager extends Manager<Rate, RateId, RateFilter> implements RateService {
    constructor(search: Search<Rate, RateFilter>,
        public repository: RateRepository,
        private infoRepository: InfoRepository,
        private usefulRepository: UsefulRateRepository) {
        super(search, repository);
        this.rate = this.rate.bind(this);
        this.update = this.update.bind(this);
        this.save = this.save.bind(this);
    }
    getRate(id: string, userId: string): Promise<Rate | null> {
        return this.repository.getRate(id, userId);
    }
    setUseful(id: string, userId: string, author: string): Promise<number> {
        return this.usefulRepository.getUseful(id, userId, author).then(exist => {
            if (exist) {
                return 0;
            } else {
                const useful: UsefulRate = { id, userId, author, reviewTime: new Date() };
                console.log({useful});
                
                return this.usefulRepository.save(useful).then(res => {
                    if (res > 0) {
                        return this.repository.increaseUsefulCount(id, userId);                       
                    } else {
                        return 0;
                    }
                })
            }
        });
    }
    removeUseful(id: string, userId: string, author: string): Promise<number> {
        return this.usefulRepository.getUseful(id, userId, author).then(exist => {
            if (exist) {
                return this.usefulRepository.removeUseful(id, userId, author).then(res => {
                    if (res > 0) {
                        return this.repository.decreaseUsefulCount(id, userId);
                    } else {
                        return 0;
                    }
                })
            } else {
                return 0;
            }
        });
    }
    async rate(rate: Rate): Promise<boolean> {
        if (rate.usefulCount) {
            rate.usefulCount = 0;
        }
        console.log(rate);
        let info = await this.infoRepository.load(rate.id);
        if (!info) {
            info = {
                'id': rate.id,
                'rate': 0,
                'rate1': 0,
                'rate2': 0,
                'rate3': 0,
                'rate4': 0,
                'rate5': 0,
                'viewCount': 0,
            };
        }
        const exist = await this.repository.getRate(rate.id, rate.userId);
        const r = (exist ? exist.rate : 0);
        (info as any)['rate' + rate.rate?.toString()] += 1;
        const sumRate = info.rate1 +
            info.rate2 * 2 +
            info.rate3 * 3 +
            info.rate4 * 4 +
            info.rate5 * 5 - r;

        const count = info.rate1 +
            info.rate2 +
            info.rate3 +
            info.rate4 +
            info.rate5 + (exist ? 0 : 1);

        info.rate = sumRate / count;
        info.viewCount = count;
        await this.infoRepository.save(info);
        await this.repository.save(rate);
        return true;
    }
}

export function useRateService(db: DB, mapper?: TemplateMap): RateService {
    const query = useQuery('rates', mapper, rateModel, true);
    const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates', rateModel, db.driver, query);
    const repository = new SqlRateRepository(db, 'rates', buildToSave);
    const infoRepository = new SqlInfoRepository(db, 'info', buildToSave);
    const usefulRateRepository = new SqlUsefulRateRepository(db, 'usefulrates', usefulRateModel  , buildToSave);
    return new RateManager(builder.search, repository, infoRepository, usefulRateRepository);
}

export function useRateController(log: Log, db: DB, mapper?: TemplateMap): RateController {
    return new RateController(log, useRateService(db, mapper));
}

  