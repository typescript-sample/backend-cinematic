import { DB, Repository } from 'query-core';
import { Rate, rateModel, RateFilter, RateService, RateRepository, RateId, Info, infoModel, InfoRepository } from './rate'
import { Attributes, Statement } from "pg-extension";

export class SqlRateRepository extends Repository<Rate, RateId> implements RateRepository {
    constructor(db: DB, table: string, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined) {
        super(db, table, rateModel);
        this.save = this.save.bind(this);
        this.getRate = this.getRate.bind(this);
    }
    getRate(id: string, author: string, ctx?: any): Promise<Rate | null> {
        return this.query<Rate>(`select * from ${this.table} where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], this.map, undefined, ctx).then(rates => {
            return rates && rates.length > 0 ? rates[0] : null;
        })
    }
    save(obj: Rate, ctx?: any): Promise<number> {
        console.log({obj});
        
        const stmt = this.buildToSave(obj, this.table, this.attributes);
        if (stmt) {
            console.log(stmt.query);
            return this.exec(stmt.query, stmt.params, ctx);
        } else {
            return Promise.resolve(0);
        }
    } 
    increaseUsefulCount(id: string, author: string, ctx?: any): Promise<number> {
        return this.exec(`update ${this.table} set usefulCount = usefulCount + 1 where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], ctx);
    }
    decreaseUsefulCount(id: string, author: string, ctx?: any): Promise<number> {
        return this.exec(`update ${this.table} set usefulCount = usefulCount - 1 where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], ctx);
    }
   
}
