import { DB, Repository } from 'query-core';
import { Rate, rateModel, RateFilter, RateService, RateRepository, RateId } from './rate'

export class SqlRateRepository extends Repository<Rate, RateId> implements RateRepository {
    constructor(db: DB, table: string) {
        super(db, table, rateModel);
    }
}
