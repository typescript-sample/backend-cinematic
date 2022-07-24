import { Attributes, buildToInsert, DB, metadata, Repository, Statement, StringMap } from 'query-core';
import { Info, InfoRepository, Rate, RateComment, RateCommentRepository, RateId, RateReaction, RateReactionRepository, RateRepository } from './core-query';

export * from './core-query';
export const rateReactionModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  author: {
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  time: {
    type: 'datetime',
  },
  reaction: {
    type: 'integer',
  }
};

export class SqlInfoRepository extends Repository<Info, string> implements InfoRepository {
  constructor(db: DB, table: string, attributes: Attributes, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined) {
    super(db, table, attributes);
    this.save = this.save.bind(this);
  }
  async save(obj: Info, ctx?: any): Promise<number> {
    const stmt = await this.buildToSave(obj, this.table, this.attributes);
    if (stmt) {
      return this.exec(stmt.query, stmt.params, ctx);
    } else {
      return Promise.resolve(0);
    }
  }
}
// tslint:disable-next-line:max-classes-per-file
export class SqlRateCommentRepository extends Repository<RateComment, string> implements RateCommentRepository {
  constructor(db: DB, table: string, attrs: Attributes, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined) {
    super(db, table, attrs);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class SqlRateReactionRepository implements RateReactionRepository {
  constructor(protected db: DB, protected table: string, protected attributes: Attributes,
    protected parent: string, protected id: string, protected author: string, protected col: string) {
    this.exist = this.exist.bind(this);
    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
  }
  protected exist(id: string, author: string, userId: string): Promise<boolean> {
    return this.db.query<RateReaction>(`select id from ${this.table} where id = ${this.db.param(1)} and author = ${this.db.param(2)} and userId = ${this.db.param(3)}`, [id, author, userId]).then(rates => {
      return rates && rates.length > 0 ? true : false;
    });
  }
  remove(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    const query1 = `delete from ${this.table} where id = ${this.db.param(1)} and author = ${this.db.param(2)} and userId= ${this.db.param(3)}`;
    const s1: Statement = {query: query1, params: [id, author, userId]};
    const query2 = `update ${this.parent} set ${this.col} = ${this.col} - 1 where ${this.id} = ${this.db.param(1)} and ${this.author} = ${this.db.param(2)}`;
    const s2: Statement = {query: query2, params: [id, author]};
    return this.db.execBatch([s1, s2], true);
  }
  save(id: string, author: string, userId: string, reaction: number): Promise<number> {
    const obj: RateReaction = { id, userId, author, time: new Date(), reaction};
    const stmt = buildToInsert(obj, this.table, this.attributes, this.db.param);
    if (stmt) {
      return this.exist(id, author, userId).then(ok => {
        if (ok) {
          const query = `update ${this.parent} set ${this.col} = ${this.col} + 1 where ${this.id} = ${this.db.param(1)} and ${this.author} = ${this.db.param(2)}`;
          const s2: Statement = {query, params: [id, author]};
          return this.db.execBatch([stmt, s2]);
        } else {
          return Promise.resolve(0);
        }
      });
    } else {
      return Promise.resolve(0);
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
export class SqlRateRepository extends Repository<Rate, RateId> implements RateRepository {
  constructor(db: DB, table: string, attributes: Attributes, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined) {
    super(db, table, attributes);
    this.save = this.save.bind(this);
    this.getRate = this.getRate.bind(this);
    this.increaseReplyCount = this.increaseReplyCount.bind(this);
    this.decreaseReplyCount = this.decreaseReplyCount.bind(this);
  }
  getRate(id: string, author: string, ctx?: any): Promise<Rate | null> {
    return this.query<Rate>(`select * from ${this.table} where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], this.map, undefined, ctx).then(rates => {
      return rates && rates.length > 0 ? rates[0] : null;
    });
  }
  save(obj: Rate, ctx?: any): Promise<number> {
    const stmt = this.buildToSave(obj, this.table, this.attributes);
    if (stmt) {
      return this.exec(stmt.query, stmt.params, ctx);
    } else {
      return Promise.resolve(0);
    }
  }
  increaseReplyCount(id: string, author: string, ctx?: any): Promise<number> {
    return this.exec(`update ${this.table} set replyCount = replyCount + 1 where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], ctx);
  }
  decreaseReplyCount(id: string, author: string, ctx?: any): Promise<number> {
    return this.exec(`update ${this.table} set replyCount = replyCount - 1 where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], ctx);
  }
}
