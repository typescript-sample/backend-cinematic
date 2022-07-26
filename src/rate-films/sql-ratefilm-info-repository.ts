import { DB, Repository } from 'query-core';
import { RateFilmInfo, rateFilmInfoModel, RateFilmInfoRepository } from './ratefilms';

export class SqlRateFilmInfoRepository extends Repository<RateFilmInfo, string> implements RateFilmInfoRepository {
  constructor(db: DB) {
    super(db, 'ratefilm_info', rateFilmInfoModel);
  }
}
