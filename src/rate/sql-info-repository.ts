import { Attributes, Statement } from "pg-extension";
import { DB, Repository } from "query-core";
import { Info, infoModel, InfoRepository } from "./rate";   

export class SqlInfoRepository extends Repository<Info, string> implements InfoRepository{
    constructor(db: DB, table: string, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement|undefined){
        super(db, table, infoModel);
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