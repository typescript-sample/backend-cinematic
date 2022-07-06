import { Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { buildCountQuery, buildToInsert, buildToInsertBatch, DB, postgres, Repository, SearchBuilder, Service, Statement } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Rate, RateFilter, RateId, rateModel, RateRepository, RateService, Info, infoModel, InfoRepository } from './rate';
import { RateController } from './rate-controller';
import { SqlRateRepository } from './sql-rate-repository';
import { SqlInfoRepository } from './sql-info-repository';
import { buildToSave } from 'pg-extension';

export * from './rate-controller';
export * from './rate';
export { RateController };



export class RateManager extends Manager<Rate, RateId, RateFilter> implements RateService {
    constructor(search: Search<Rate, RateFilter>,
        repository: RateRepository,
        private infoRepository: InfoRepository) {
        super(search, repository);
        this.rate = this.rate.bind(this);
        this.update = this.update.bind(this);
    }

    async rate(rate: Rate): Promise<boolean> {
        console.log(rate);
        let info = await this.infoRepository.load(rate.id);
        let exist = true;
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
            exist = false;
            // info = await this.infoRepository.load(rate.id);
        }
        const res = await this.repository.insert(rate);
        (info as any)['rate' + rate.rate?.toString()] += 1;
        const sumRate = info.rate1 +
            info.rate2 * 2 +
            info.rate3 * 3 +
            info.rate4 * 4 +
            info.rate5 * 5;

        const count = info.rate1 +
            info.rate2 +
            info.rate3 +
            info.rate4 +
            info.rate5;

        info.rate = sumRate / count;
        info.viewCount = count;
        if (exist) {
            console.log("update: " + exist);

            await this.infoRepository.save(info);
            await this.repository.update(rate);
        } else {
            await this.infoRepository.insert(info);
        }
        return true;
    }

    async update(rate: Rate): Promise<number> {
        let info = await this.infoRepository.load(rate.id);
        if (!info) {
            return 0;
        } else {
            const res = await this.repository.update(rate);
            if (res < 1) {
                return 0;
            }
            (info as any)['rate' + rate.rate?.toString()] += 1;
            const sumRate = info.rate1 +
                info.rate2 * 2 +
                info.rate3 * 3 +
                info.rate4 * 4 +
                info.rate5 * 5;

            const count = info.rate1 +
                info.rate2 +
                info.rate3 +
                info.rate4 +
                info.rate5;

            info.rate = sumRate / count;
            info.viewCount = count;
            this.infoRepository.update(info);
            return 1;
        }
    }
}

export function useRateService(db: DB, mapper?: TemplateMap): RateService {
    const query = useQuery('rates', mapper, rateModel, true);
    const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates', rateModel, db.driver, query);
    const repository = new SqlRateRepository(db, 'rates');
    const infoRepository = new SqlInfoRepository(db, 'info', buildToSave);
    return new RateManager(builder.search, repository, infoRepository);
}

export function useRateController(log: Log, db: DB, mapper?: TemplateMap): RateController {
    return new RateController(log, useRateService(db, mapper),);
}
