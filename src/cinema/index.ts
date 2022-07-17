import { Log, Manager, Search } from 'onecore';
import { DB, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Cinema, CinemaFilter, cinemaModel, CinemaRate, CinemaRateFilter, cinemaRateModel, CinemaRateRepository, CinemaRateService, CinemaRepository, CinemaService, InfoRepository } from './cinema'; // rate
import { CinemaController } from './cinema-controller';
export * from './cinema-controller';
export { CinemaController };
import { CinemaRateController } from './cinema-rate-controller';
import { SqlCinemaRateRepository } from './sql-cinema-rate-repository';
import { SqlCinemaRepository } from './sql-cinema-repository';
import { SqlInfoRepository } from './sql-info-repository';

export class CinemaManager extends Manager<Cinema, string, CinemaFilter> implements CinemaService {
  constructor(search: Search<Cinema, CinemaFilter>,
    repository: CinemaRepository,
    private infoRepository: InfoRepository,
    private rateRepository: CinemaRateRepository) {
    super(search, repository);
    this.search = this.search.bind(this);
  }

  load(id: string): Promise<Cinema | null> {
    return this.repository.load(id).then(cinema => {
      if (!cinema) {
        return null;
      } else {
        return this.infoRepository.load(id).then(info => {
          if (info) {
            delete (info as any)['id']; // not take info_id
            cinema.info = info;
          }
          return cinema;
        });
      }
    });
  }
}

export function useCinemaService(db: DB, mapper?: TemplateMap): CinemaService {
  const query = useQuery('cinema', mapper, cinemaModel, true);
  const builder = new SearchBuilder<Cinema, CinemaFilter>(db.query, 'cinema', cinemaModel, db.driver, query);
  const repository = new SqlCinemaRepository(db);
  const infoRepository = new SqlInfoRepository(db);
  const rateRepository = new SqlCinemaRateRepository(db);
  return new CinemaManager(builder.search, repository, infoRepository, rateRepository);
}

export function useCinemaController(log: Log, db: DB, mapper?: TemplateMap): CinemaController {
  return new CinemaController(log, useCinemaService(db, mapper));
}

export class CinemaRateManager extends Manager<CinemaRate, string, CinemaRateFilter> implements CinemaRateService {
  constructor(search: Search<CinemaRate, CinemaRateFilter>, repository: CinemaRateRepository) {
    super(search, repository);
  }
}

export function useCinemaRateService(db: DB, mapper?: TemplateMap): CinemaRateService {
  const query = useQuery('rates', mapper, cinemaRateModel, true);
  const builder = new SearchBuilder<CinemaRate, CinemaRateFilter>(db.query, 'rates', cinemaRateModel, db.driver, query);
  const repository = new SqlCinemaRateRepository(db);
  return new CinemaRateManager(builder.search, repository);
}

export function useCinemaRateController(log: Log, db: DB, mapper?: TemplateMap): CinemaRateController {
  return new CinemaRateController(log, useCinemaRateService(db, mapper));
}
