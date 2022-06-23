import { Log, Manager, Search } from 'onecore';
import { DB, SearchBuilder } from 'query-core';
import { Cinema, CinemaFilter, cinemaModel, CinemaRepository, CinemaService, Rate } from './cinema';
import { CinemaController } from './cinema-controller';
import { TemplateMap, useQuery } from 'query-mappers';
export * from './cinema-controller';
export { CinemaController };

import { SqlCinemaRepository } from './sql-cinema-repository';

export class CinemaManager extends Manager<Cinema, string, CinemaFilter> implements CinemaService {
  constructor(search: Search<Cinema, CinemaFilter>, repository: CinemaRepository) {
    super(search, repository);
  }
}

export function useCinemaService(db: DB, mapper?: TemplateMap): CinemaService {
  const query = useQuery('cinema', mapper, cinemaModel, true)
  const builder = new SearchBuilder<Cinema, CinemaFilter>(db.query, 'cinema', cinemaModel, db.driver, query);
  const repository = new SqlCinemaRepository(db);
  return new CinemaManager(builder.search, repository);
}
export function useCinemaController(log: Log, db: DB, mapper?: TemplateMap): CinemaController {
  return new CinemaController(log, useCinemaService(db, mapper));
}
