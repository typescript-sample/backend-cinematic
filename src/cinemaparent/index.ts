import { Log, Manager, Search } from 'onecore';
import { DB, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { CinemaParent, CinemaParentFilter, CinemaParentModel, CinemaParentRepository, CinemaParentService } from './cinema-parent';
import { CinemaParentController } from './cinema-parent-controller';
export * from './cinema-parent-controller';
export { CinemaParentController };

import { SqlCinemaParentRepository } from './sql-cinema-parent-repository';

export class CinemaParentManager extends Manager<CinemaParent, string, CinemaParentFilter> implements CinemaParentService {
  constructor(search: Search<CinemaParent, CinemaParentFilter>, repository: CinemaParentRepository) {
    super(search, repository);
  }
}
export function useCinemaParentService(db: DB, mapper?: TemplateMap): CinemaParentService {
  const query = useQuery('cinemaParent', mapper, CinemaParentModel, true);
  const builder = new SearchBuilder<CinemaParent, CinemaParentFilter>(db.query, 'CinemaParent', CinemaParentModel, db.driver, query);
  const repository = new SqlCinemaParentRepository(db);
  return new CinemaParentManager(builder.search, repository);
}
export function useCinemaParentController(log: Log, db: DB, mapper?: TemplateMap): CinemaParentController {
  return new CinemaParentController(log, useCinemaParentService(db, mapper));
}
