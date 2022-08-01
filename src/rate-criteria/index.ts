import { Log } from "express-ext";
import { Manager, Search } from "onecore";
import { DB, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import { RateCriteria, RateCriteriaFilter, RateCriteriaId, rateCriteriaModel, RateCriteriaService, RateCriteriaRepository } from "./rate-criteria";
import { RateCriteriaController } from "./rate-criteria-controller";
import { SqlRateCriteriaRepository } from "./rate-criteria-repository";

export class RateCriteriaManager extends Manager<RateCriteria, RateCriteriaId, RateCriteriaFilter> implements RateCriteriaService {
    constructor(search: Search<RateCriteria, RateCriteriaFilter>, repository: RateCriteriaRepository) {
        super(search, repository);
    }
}

export function useRateCriteriaService(db: DB, mapper?: TemplateMap): RateCriteriaService {
    const query = useQuery('rate_criteria', mapper, rateCriteriaModel, true);
    const builder = new SearchBuilder<RateCriteria, RateCriteriaFilter>(db.query, 'rate_criteria', rateCriteriaModel, db.driver, query);
    const repository = new SqlRateCriteriaRepository(db);
    return new RateCriteriaManager(builder.search, repository);
}
export function useRateCriteriaController(log: Log, db: DB, mapper?: TemplateMap): RateCriteriaController {
    return new RateCriteriaController(log, useRateCriteriaService(db, mapper));
}
