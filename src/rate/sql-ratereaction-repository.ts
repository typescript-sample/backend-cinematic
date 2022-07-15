import { DB, metadata, Repository } from 'query-core';
import { RateReaction, RateReactionId, rateReactionModel, RateReactionRepository} from './rate';
import { Attribute, Attributes, Statement, StringMap } from "pg-extension";

export class SqlRateReactionRepository  implements RateReactionRepository {
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
        })
    }
    removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number> {
        return this.db.exec(`delete from ${this.table} where id = ${this.db.param(1)} and author = ${this.db.param(2)} and  userId= ${this.db.param(3)}`, [id, author, userId], ctx);
    }
    async save(obj: RateReaction, ctx?: any): Promise<number> {
        const stmt = await this.buildToSave(obj, this.table, this.attributes);
        if (stmt) {
            console.log(stmt.query);
            return this.db.exec(stmt.query, stmt.params, ctx);
        } else {
            return Promise.resolve(0);
        }
    }
}