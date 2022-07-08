import { DB, metadata, Repository } from 'query-core';
import { UsefulRate, UsefulRateId, usefulRateModel, UsefulRateRepository } from './rate';
import { Attribute, Attributes, Statement, StringMap } from "pg-extension";

export class SqlUsefulRateRepository implements UsefulRateRepository {
    constructor(protected db: DB, protected table: string, protected attributes: Attributes,
            protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement|undefined ) {
        this.save = this.save.bind(this);
        const meta = metadata(attributes);
        this.map = meta.map;
    }
    map?: StringMap;
    getUseful(id: string, userId: string, author: string, ctx?: any): Promise<UsefulRate | null> {
        return this.db.query<UsefulRate>(`select * from ${this.table} where id = ${this.db.param(1)} and userId = ${this.db.param(2)} and author = ${this.db.param(3)}`, [id, userId, author], this.map, undefined, ctx).then(rates => {
            return rates && rates.length > 0 ? rates[0] : null;
        })
    }
    removeUseful(id: string, userId: string, author: string, ctx?: any): Promise<number> {
        return this.db.exec(`delete from ${this.table} where id = ${this.db.param(1)} and userId = ${this.db.param(2)} and author = ${this.db.param(3)}`, [id, userId, author], ctx);
    }
    async save(obj: UsefulRate, ctx?: any): Promise<number> {
        const stmt = await this.buildToSave(obj, this.table, this.attributes);
        if (stmt) {
            console.log(stmt.query);
            return this.db.exec(stmt.query, stmt.params, ctx);
        } else {
            return Promise.resolve(0);
        }
    }
}