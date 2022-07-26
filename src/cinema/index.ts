import { Log, Manager, Search } from 'onecore';
import { DB, SearchBuilder } from 'query-core';
import { buildToSave } from 'pg-extension';
import { TemplateMap, useQuery } from 'query-mappers';
import { Info, infoModel, Rate, RateComment, RateCommentFilter, rateCommentModel, RateCommentService, RateFilter, RateCommentManager, RateManager, rateModel, RateRepository, RateService
} from 'rate5';
import { rateReactionModel, SqlInfoRepository as SqlRateInfoRepository, SqlRateCommentRepository, SqlRateReactionRepository, SqlRateRepository } from 'rate-query';

import { Cinema, CinemaFilter, cinemaModel, CinemaRate, CinemaRateFilter, cinemaRateModel, CinemaRateRepository, CinemaRateService, CinemaRepository, CinemaService, InfoRepository } from './cinema'; // rate
import { CinemaController } from './cinema-controller';
export * from './cinema-controller';
export { CinemaController };
import { SqlCinemaRepository } from './sql-cinema-repository';
import { SqlInfoRepository } from './sql-info-repository';
import { RateCommentController, RateController } from '../rate';

export class CinemaManager extends Manager<Cinema, string, CinemaFilter> implements CinemaService {
  constructor(search: Search<Cinema, CinemaFilter>,
    repository: CinemaRepository,
    private infoRepository: InfoRepository,
    private rateRepository: RateRepository) {
    super(search, repository);
    this.search = this.search.bind(this);
  }

  //add field
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
  const rateRepository = new SqlRateRepository(db, 'rates', rateModel, buildToSave);
  return new CinemaManager(builder.search, repository, infoRepository, rateRepository);
}

export function useCinemaController(log: Log, db: DB, mapper?: TemplateMap): CinemaController {
  return new CinemaController(log, useCinemaService(db, mapper));
}

export function useCinemaRateService(db: DB, mapper?: TemplateMap): RateService {
  const query = useQuery('rates', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates', rateModel, db.driver, query);
  const repository = new SqlRateRepository(db, 'rates', rateModel, buildToSave);
  const infoRepository = new SqlRateInfoRepository<Info>(db, 'info', infoModel, buildToSave);
  const rateReactionRepository = new SqlRateReactionRepository(db, 'ratereaction', rateReactionModel, 'rates', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments', rateCommentModel, 'rates', 'replyCount', 'author', 'id');
  return new RateManager(builder.search, repository, infoRepository, rateCommentRepository, rateReactionRepository);
}

export function useCinemaRateController(log: Log, db: DB, mapper?: TemplateMap): RateController {
  return new RateController(log, useCinemaRateService(db, mapper));
}

export function useCinemaRateCommentService(db: DB, mapper?: TemplateMap): RateCommentService {
  const query = useQuery('ratecomment', mapper, rateCommentModel, true);
  const builder = new SearchBuilder<RateComment, RateCommentFilter>(db.query, 'rate_comments', rateCommentModel, db.driver, query);
  const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments', rateCommentModel, 'rates', 'replyCount', 'author', 'id');
  return new RateCommentManager(builder.search, rateCommentRepository);
}

export function useRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController {
  return new RateCommentController(log, useCinemaRateCommentService(db, mapper));
}
