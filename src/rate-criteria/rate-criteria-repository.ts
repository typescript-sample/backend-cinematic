import { Attributes, buildToInsert, buildToUpdate, DB, metadata, Statement, StringMap } from 'query-core';
import { RateCriteria, RateCriteriaRepository, RateFullInfo } from './rate-criteria';

export interface BaseRate {
    rate: number;
    rates: number[];
}
export function avg(n: number[]): number {
    let sum = 0;
    for (const s of n) {
        sum = sum + s;
    }
    return sum / n.length;
}
export class SqlRateCriteriaRepository<R extends BaseRate> implements RateCriteriaRepository<R> {
    constructor(public db: DB, public table: string, public fullTable: string, public tables: string[], public attributes: Attributes,
        protected buildToSave: <K>(obj: K, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined,
        public max: number, rateField?: string, count?: string, score?: string, authorCol?: string, id?: string, idField?: string, idCol?: string,
        rateCol?: string, rate1?: string, rate2?: string, rate3?: string, rate4?: string, rate5?: string) {
        const m = metadata(attributes);
        this.map = m.map;
        this.id = (id && id.length > 0 ? id : 'id');
        this.rate = (rateCol && rateCol.length > 0 ? rateCol : 'rate');
        this.count = (count && count.length > 0 ? count : 'count');
        this.score = (score && score.length > 0 ? score : 'score');
        this.idField = (idField && idField.length > 0 ? idField : 'id');
        this.rateField = (rateField && rateField.length > 0 ? rateField : 'rate');
        this.authorCol = (authorCol && authorCol.length > 0 ? authorCol : 'author');
        this.rate1 = (rate1 && rate1.length > 0 ? rate1 : 'rate1');
        this.rate2 = (rate2 && rate2.length > 0 ? rate2 : 'rate2');
        this.rate3 = (rate3 && rate3.length > 0 ? rate3 : 'rate3');
        this.rate4 = (rate4 && rate4.length > 0 ? rate4 : 'rate4');
        this.rate5 = (rate5 && rate5.length > 0 ? rate5 : 'rate5');
        if (idCol && idCol.length > 0) {
            this.idCol = idCol;
        } else {
            const c = attributes[this.idField];
            if (c) {
                this.idCol = (c.column && c.column.length > 0 ? c.column : this.idField);
            } else {
                this.idCol = this.idField;
            }
        }
        if (rateCol && rateCol.length > 0) {
            this.rate = rateCol;
        } else {
            const c = attributes[this.rateField];
            if (c) {
                this.rate = (c.column && c.column.length > 0 ? c.column : this.rateField);
            } else {
                this.rate = this.rateField;
            }
        }
        this.getRate = this.getRate.bind(this);
        this.insert = this.insert.bind(this);
    }
    map?: StringMap;
    count: string;
    score: string;
    id: string;
    rate: string;
    idField: string;
    rateField: string;
    idCol: string;
    authorCol: string;
    rate1?: string;
    rate2?: string;
    rate3?: string;
    rate4?: string;
    rate5?: string;

    getRate(id: string, author: string, ctx?: any): Promise<R | null> {
        return this.db.query<R>(`select * from ${this.table} where ${this.idCol} = ${this.db.param(1)} and ${this.authorCol} = ${this.db.param(2)}`, [id, author], this.map, undefined, ctx).then(rates => {
            return rates && rates.length > 0 ? rates[0] : null;
        });
    }

    insert(rate: R, newInfo?: boolean): Promise<number> {
        if (rate.rates.length != this.tables.length) {
            return Promise.reject('Invalid rates length');
        }
        const obj: any = rate;
        const id: string = obj[this.idField];
        const mainStmt = buildToInsert<R>(rate, this.table, this.attributes, this.db.param);
        if (!mainStmt) {
            return Promise.reject('cannot build to insert rate');
        }

        const stmts: Statement[] = [];
        if (newInfo) {
            const fullStmt: Statement = { query: this.insertFullInfo(rate.rate, this.fullTable), params: [id] };
            stmts.push(fullStmt);

            for (let i = 0; i < rate.rates.length; i++) {
                const sql = this.insertInfo(rate.rates[i], this.tables[i]);
                stmts.push({ query: sql, params: [id] });
            }
            stmts.push(mainStmt);
            return this.db.execBatch(stmts, true);
        } else {
            const fullStmt: Statement = { query: this.updateFullInfo(rate.rate, this.fullTable, this.tables), params: [id, id, id, id, id, id] };
            stmts.push(fullStmt);
            for (let i = 0; i < rate.rates.length; i++) {
                const sql = this.updateNewInfo(rate.rates[i], this.tables[i]);
                stmts.push({ query: sql, params: [id] });
            }
            stmts.push(mainStmt);
            return this.db.execBatch(stmts, true);
        }
    }
    protected insertInfo(r: number, table: string): string {
        const rateCols: string[] = [];
        const ps: string[] = [];
        for (let i = 1; i <= this.max; i++) {
            rateCols.push(`${this.rate}${i}`);
            if (i === r) {
                ps.push('' + 1);
            } else {
                ps.push('0');
            }
        }
        const query = `
          insert into ${table} (${this.id}, ${this.rate}, ${this.count}, ${this.score}, ${rateCols.join(',')})
          values (${this.db.param(1)}, ${r}, 1, ${r}, ${ps.join(',')})`;
        return query;
    }
    protected insertFullInfo(r: number, table: string): string {
        const query = `
                insert into ${table} (${this.id}, ${this.rate}, ${this.count}, ${this.score})
                values (${this.db.param(1)}, ${r}, 1, ${r})`;
        return query;
    }

    protected updateFullInfo(r: number, table: string, tables?: string[]): string {
        if (tables && tables.length > 0) {
            const s: string[] = [];
            for (let i = 1; i <= tables.length; i++) {
                s.push(`${this.rate}${i} = (select avg(${this.rate}) from ${tables[i - 1]} where ${this.id} = ${this.db.param(i)} group by ${this.id})`);
            }
            const query = `
              update ${table} set ${this.rate} = (${this.score} + ${r})/(${this.count} + 1), ${this.score} = ${this.score} + ${r},
                ${s.join(',')},
                ${this.count} = ${this.count} + 1
              where ${this.id} = ${this.db.param(6)}`;
            return query;    
        } else {
            const query = `
              update ${table} set ${this.rate} = (${this.score} + ${r})/(${this.count} + 1), ${this.score} = ${this.score} + ${r},
                ${this.count} = ${this.count} + 1
              where ${this.id} = ${this.db.param(6)}`;
            return query;
        }
    }
    protected updateNewInfo(r: number, table: string): string {
        const query = `
          update ${table} set ${this.rate} = (${this.score} + ${r})/(${this.count} + 1), ${this.count} = ${this.count} + 1, ${this.score} = ${this.score} + ${r}, ${this.rate}${r} = ${this.rate}${r} + 1
          where ${this.id} = ${this.db.param(1)}`;
        return query;
    }
    protected updateOldInfo(newRate: number, oldRate: number, table: string): string {
        const delta = newRate - oldRate;
        const query = `
          update ${table} set ${this.rate} = (${this.score} + ${delta})/${this.count}, ${this.score} = ${this.score} + ${delta}, ${this.count} = ${this.count}
          where ${this.id} = ${this.db.param(1)}`;
        return query;
    }
    update(rate: R, oldRate: number): Promise<number> {
        const rates = rate.rates;
        const r = rate.rate;

        const stmts: Statement[] = [];
        const stmt = buildToUpdate(rate, this.table, this.attributes, this.db.param);

        if (r && rates && rates.length > 0) {
            if (stmt) {
                const obj: any = rate;
                const id: string = obj[this.idField];
                const query: Statement = { query: this.updateOldInfo(rate.rate, oldRate, this.fullTable), params: [id] };
                stmts.push(query)
                for (let i = 0; i < rate.rates.length; i++) {
                    const sql = this.updateNewInfo(rate.rates[i], this.tables[i]);
                    stmts.push({ query: sql, params: [id] });
                }
                stmts.push(stmt);

                return this.db.execBatch(stmts, true);
            } else {
                return Promise.resolve(-1);
            }
        } else {
            if (!stmt) {
                return Promise.reject('cannot build to insert rate');
            } else {
                stmts.push(stmt);
                return this.db.execBatch(stmts, true);
            }
        }
    }
}