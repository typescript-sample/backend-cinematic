import { Log, Manager, Search } from 'onecore';
import { DB, SearchBuilder } from 'query-core';
import { buildToSave, useUrlQuery } from 'pg-extension';
import shortid from 'shortid';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Info, infoModel, InfoRepository, Rate, RateComment, RateCommentFilter, rateCommentModel, RateCommentService, RateFilter,
  RateCommentManager, rateModel, RateRepository
} from 'rate5';
import {RateManager, RateService} from '../rate/service';
import { rateReactionModel, SqlInfoRepository, SqlRateCommentRepository, SqlRateReactionRepository, SqlRateRepository } from '../rate/repo';
import { Cinema, CinemaFilter, cinemaModel, CinemaRepository, CinemaService } from './cinema';
import { CinemaController } from './cinema-controller';
export * from './cinema-controller';
export { CinemaController };
import { SqlCinemaRepository } from './sql-cinema-repository';
import { RateCommentController, RateController } from '../rate';

export class CinemaManager extends Manager<Cinema, string, CinemaFilter> implements CinemaService {
  constructor(search: Search<Cinema, CinemaFilter>,
    repository: CinemaRepository,
    private infoRepository: InfoRepository,
    private rateRepository: RateRepository) {
    super(search, repository);
  }

  load(id: string): Promise<Cinema | null> {
    return this.repository.load(id).then(cinema => {
      if (!cinema) {
        return null;
      } else {
        return this.infoRepository.load(id).then(info => {
          if (info) {
            delete (info as any)['id'];
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
  const infoRepository = new SqlInfoRepository<Info>(db, 'info', infoModel, buildToSave);
  const rateRepository = new SqlRateRepository<Info>(db, 'rates', rateModel, buildToSave, 'info', infoModel);
  return new CinemaManager(builder.search, repository, infoRepository, rateRepository);
}

export function useCinemaController(log: Log, db: DB, mapper?: TemplateMap): CinemaController {
  return new CinemaController(log, useCinemaService(db, mapper));
}

export function useCinemaRateService(db: DB, mapper?: TemplateMap): RateService {
  const query = useQuery('rates', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates', rateModel, db.driver, query);
  const repository = new SqlRateRepository<Info>(db, 'rates', rateModel, buildToSave, 'info', infoModel);
  const infoRepository = new SqlInfoRepository<Info>(db, 'info', infoModel, buildToSave);
  const rateReactionRepository = new SqlRateReactionRepository(db, 'ratereaction', rateReactionModel, 'rates', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments', rateCommentModel, 'rates', 'replyCount', 'author', 'id');
  // select id, imageurl as url from users;
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
  return new RateManager(builder.search, repository, infoRepository, rateCommentRepository, rateReactionRepository, queryUrl);
}

export function useCinemaRateController(log: Log, db: DB, mapper?: TemplateMap): RateController {
  return new RateController(log, useCinemaRateService(db, mapper), generate, 'commentId', 'userId', 'author', 'id');
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
export function generate(): string {
  return shortid.generate();
}
