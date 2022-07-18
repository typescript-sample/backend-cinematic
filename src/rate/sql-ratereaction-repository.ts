import { Attributes, Statement, StringMap } from 'pg-extension';
import { DB, metadata } from 'query-core';
import { RateReaction, RateReactionRepository } from './rate';

export class SqlRateReactionRepository implements RateReactionRepository {
  constructor(protected db: DB, protected table: string, protected attributes: Attributes,
    protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined) {
    this.save = this.save.bind(this);
    this.getUseful = this.getUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    const meta = metadata(attributes);
    this.map = meta.map;
  }
  map?: StringMap;
  getUseful(id: string, author: string, userId: string, ctx?: any): Promise<RateReaction | null> {
    return this.db.query<RateReaction>(`select * from ${this.table} where id = ${this.db.param(1)} and author = ${this.db.param(2)} and userId = ${this.db.param(3)}`, [id, author, userId], this.map, undefined, ctx).then(rates => {
      return rates && rates.length > 0 ? rates[0] : null;
    });
  }
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    return this.db.exec(`delete from ${this.table} where id = ${this.db.param(1)} and author = ${this.db.param(2)} and  userId= ${this.db.param(3)}`, [id, author, userId], ctx);
  }
  save(obj: RateReaction, ctx?: any): Promise<number> {
    const stmt = this.buildToSave(obj, this.table, this.attributes);
    if (stmt) {
      return this.db.exec(stmt.query, stmt.params, ctx);
    } else {
      return Promise.resolve(0);
    }
  }
}
