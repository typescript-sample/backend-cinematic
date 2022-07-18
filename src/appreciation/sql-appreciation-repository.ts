import { Attributes, Statement } from 'pg-extension';
import { DB, Repository } from 'query-core';
import { Appreciation, AppreciationId, appreciationModel, AppreciationRepository } from './appreciation';

export class SqlAppreciationRepository extends Repository<Appreciation, AppreciationId> implements AppreciationRepository {
  constructor(db: DB, table: string, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined) {
    super(db, table, appreciationModel);
    this.save = this.save.bind(this);
    this.getAppreciation = this.getAppreciation.bind(this);
    this.increaseReplyCount = this.increaseReplyCount.bind(this);
    this.decreaseReplyCount = this.decreaseReplyCount.bind(this);
  }

  save(obj: Appreciation, ctx?: any): Promise<number> {
    console.log({ obj });
    const stmt = this.buildToSave(obj, this.table, this.attributes);
    if (stmt) {
      console.log(stmt.query);
      return this.exec(stmt.query, stmt.params, ctx);
    } else {
      return Promise.resolve(0);
    }
  }

  getAppreciation(id: string, author: string, ctx?: any): Promise<Appreciation | null> {
    return this.query<Appreciation>(`select * from ${this.table} where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], this.map, undefined, ctx).then(appreciation => {
      return appreciation && appreciation.length > 0 ? appreciation[0] : null;
    });
  }
  increaseReplyCount(id: string, author: string, ctx?: any): Promise<number> {
    return this.exec(`update ${this.table} set replyCount = replyCount + 1 where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], ctx);
  }
  decreaseReplyCount(id: string, author: string, ctx?: any): Promise<number> {
    return this.exec(`update ${this.table} set replyCount = replyCount - 1 where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], ctx);
  }
}
