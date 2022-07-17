import { Attributes, Statement } from 'pg-extension';
import { DB, Repository } from 'query-core';
import { Reply, ReplyId, replyModel, ReplyRepository } from './appreciation';

export class SqlReplyRepository extends Repository<Reply, ReplyId> implements ReplyRepository {
  constructor(db: DB, table: string, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined) {
    super(db, table, replyModel);
    this.save = this.save.bind(this);
    this.getReply = this.getReply.bind(this);
    this.removeReply = this.removeReply.bind(this);
  }
  save(obj: Reply, ctx?: any): Promise<number> {
    console.log({ obj });

    const stmt = this.buildToSave(obj, this.table, this.attributes);
    if (stmt) {
      console.log(stmt.query);
      return this.exec(stmt.query, stmt.params, ctx);
    } else {
      return Promise.resolve(0);
    }
  }

  getReply(id: string, author: string, userId: string, ctx?: any): Promise<Reply | null> {
    return this.query<Reply>(`select * from ${this.table} where id = ${this.param(1)} and author = ${this.param(2)} and userId = ${this.param(3)}`, [id, author, userId], this.map, undefined, ctx).then(rep => {
      return rep && rep.length > 0 ? rep[0] : null;
    });
  }

  removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    return this.exec(`delete from ${this.table} where id = ${this.param(1)} and author = ${this.param(2)} and  userId= ${this.param(3)}`, [id, author, userId], ctx);
  }

  increaseUsefulCount(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    return this.exec(`update ${this.table} set usefulCount = usefulCount + 1 where id = ${this.param(1)} and author = ${this.param(2)} and userId = ${this.param(3)}`, [id, author, userId], ctx);
  }

  decreaseUsefulCount(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    return this.exec(`update ${this.table} set usefulCount = usefulCount - 1 where id = ${this.param(1)} and author = ${this.param(2)} and userId = ${this.param(3)}`, [id, author, userId], ctx);
  }
}
