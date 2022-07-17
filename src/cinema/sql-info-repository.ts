import { DB, Repository } from 'query-core';
import { Info, infoModel, InfoRepository } from './cinema';

export class SqlInfoRepository extends Repository<Info, string> implements InfoRepository {
  constructor(db: DB) {
    super(db, 'info', infoModel);
  }
}
