import { Repository } from 'query-core';
import { Attributes, DB, Statement } from './core';
import { RateComment, rateCommentModel, RateCommentRepository} from './rate';

export class SqlRateCommentRepository extends Repository<RateComment, string> implements RateCommentRepository {
  constructor(db: DB, table: string, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined) {
    super(db, table, rateCommentModel);
    this.save = this.save.bind(this);
  }
  save(obj: RateComment, ctx?: any): Promise<number> {
    const stmt = this.buildToSave(obj, this.table, this.attributes);
    if (stmt) {
      console.log(stmt.query);
      return this.exec(stmt.query, stmt.params, ctx);
    } else {
      return Promise.resolve(0);
    }
  }
}
