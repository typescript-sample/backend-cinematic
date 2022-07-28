import shortid from 'shortid';
import { Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { buildToSave } from 'pg-extension';
import { DB, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { rateReactionModel, SqlInfoRepository, SqlRateCommentRepository, SqlRateReactionRepository, SqlRateRepository } from 'rate-query';
import { RateComment, RateCommentFilter, RateCommentManager, rateCommentModel, RateCommentService } from 'rate5';
import { rateModel, Rate, RateFilter, info10Model } from '../rate/rate'
import { RateFilmInfo, rateFilmInfoModel, RateFilmInfoRepository } from '../rate-films/ratefilms';
import { Film, FilmFilter, filmModel, FilmRepository, FilmService } from './film';
import { FilmController } from './film-controller';
import { SqlFilmRepositoy } from './sql-film-repository';
import { RateFilmController } from '../rate-films/ratefilms-controller';
import { RateFilmManager, RateService } from '../rate-films/service';
import { RateCommentController } from 'rate-express';
import { CommentValidator, RateValidator } from '../rate/service';
import { check } from 'xvalidators';

export class FilmManager extends Manager<Film, string, FilmFilter> implements FilmService {
  constructor(search: Search<Film, FilmFilter>,
    repository: FilmRepository,
    private infoRepository: RateFilmInfoRepository) {
    super(search, repository);
  }
  load(id: string): Promise<Film | null> {
    return this.repository.load(id).then(film => {
      if (!film) {
        return null;
      } else {
        return this.infoRepository.load(id).then(info => {
          if (info) {
            delete (info as any)['id'];
            film.info = info;
          }
          return film;
        });
      }
    });
  }
}
export function useFilmService(db: DB, mapper?: TemplateMap): FilmService {
  const query = useQuery('film', mapper, filmModel, true);
  const builder = new SearchBuilder<Film, FilmFilter>(db.query, 'films', filmModel, db.driver, query);
  const repository = new SqlFilmRepositoy(db);
  const infoRepository = new SqlInfoRepository<RateFilmInfo>(db, 'rates_film_info', rateFilmInfoModel, buildToSave);
  return new FilmManager(builder.search, repository, infoRepository);
}
export function useFilmController(log: Log, db: DB, mapper?: TemplateMap): FilmController {
  return new FilmController(log, useFilmService(db, mapper));
}

export function useRateFilmService(db: DB, mapper?: TemplateMap): RateService {
  const query = useQuery('rates_film', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates_film', rateModel, db.driver, query);
  const rateRepository = new SqlRateRepository(db, 'rates_film', rateModel, buildToSave, 10, 'rates_film_info', 'id', 'rate', 'count', 'score');
  const infoRepository = new SqlInfoRepository<RateFilmInfo>(db, 'rates_film_info', info10Model, buildToSave);
  const rateReactionRepository = new SqlRateReactionRepository(db, 'rates_film_reaction', rateReactionModel, 'rates_film', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlRateCommentRepository(db, 'rates_film_comments', rateCommentModel, 'rates_film', 'replyCount', 'author', 'id');
  return new RateFilmManager(builder.search, rateRepository, infoRepository, rateCommentRepository, rateReactionRepository);
}

export function useRateFilmController(log: Log, db: DB, mapper?: TemplateMap): RateFilmController {
  const rateValidator = new RateValidator(rateModel, check, 10);
  const commentValidator = new CommentValidator(rateCommentModel, check);
  return new RateFilmController(log, useRateFilmService(db, mapper),rateValidator,commentValidator, generate, 'commentId', 'userId', 'author', 'id');
}

export function useRateFilmCommentService(db: DB, mapper?: TemplateMap): RateCommentService {
  const query = useQuery('rates_film_comments', mapper, rateCommentModel, true);
  const builder = new SearchBuilder<RateComment, RateCommentFilter>(db.query, 'rates_film_comments', rateCommentModel, db.driver, query);
  const rateCommentRepository = new SqlRateCommentRepository(db, 'rates_film_comments', rateCommentModel, 'rates_film', 'replyCount', 'author', 'id');
  return new RateCommentManager(builder.search, rateCommentRepository);
}

export function useRateFilmCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController {
  return new RateCommentController(log, useRateFilmCommentService(db, mapper));
}

export function generate(): string {
  return shortid.generate();
}
