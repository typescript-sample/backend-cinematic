import { DB, Repository } from 'query-core';
import { RateCriteria, RateCriteriaId, rateCriteriaModel, RateCriteriaRepository } from './rate-criteria';

export class SqlRateCriteriaRepository extends Repository<RateCriteria, RateCriteriaId> implements RateCriteriaRepository {
  constructor(db: DB) {
    super(db, 'rate_criteria', rateCriteriaModel);
  }
}
