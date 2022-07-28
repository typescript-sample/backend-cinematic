import { DB, Repository } from 'query-core';
import { Attributes, Statement } from 'pg-extension';
import { RateFilmInfo, rateFilmInfoModel, RateFilmInfoRepository } from './ratefilms';

export class SqlRateFilmInfoRepository extends Repository<RateFilmInfo, string> implements RateFilmInfoRepository {
  constructor(db: DB, table: string, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined) {
    super(db, table, rateFilmInfoModel);
    //this.save = this.save.bind(this);
  }
  // async save(obj: RateFilmInfo, ctx?: any): Promise<number> {
  //   const stmt = await this.buildToSave(obj, this.table, this.attributes);
  //   if (stmt) {
  //     return this.exec(stmt.query, stmt.params, ctx);
  //   } else {
  //     return Promise.resolve(0);
  //   }
  // }
}
