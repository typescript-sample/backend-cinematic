import shortid from 'shortid';
import { Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { buildToSave } from 'pg-extension';
import { DB, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { InfoRepository, rateReactionModel, SqlInfoRepository, SqlCommentRepository, SqlRateReactionRepository, SqlRateRepository } from 'rate-query';
import { Info10, RateComment, Rater, RateCommentFilter, RateCommentManager, rateCommentModel, RateCommentQuery } from 'rate-core';
import { rateModel, Rate, RateFilter, info10Model } from 'rate-core'
import { Film, FilmFilter, filmModel, FilmRepository, FilmService } from './film';
import { FilmController } from './film-controller';
import { SqlFilmRepositoy } from './sql-film-repository';
import { RateController } from 'rate-express';
import { RateService } from 'rate-core';
import { RateCommentController } from 'rate-express';
import { CommentValidator, RateValidator } from 'rate-core';
import { check } from 'xvalidators';

export class FilmManager
  extends Manager<Film, string, FilmFilter>
  implements FilmService
{
  constructor(
    search: Search<Film, FilmFilter>,
    repository: FilmRepository,
    protected saveDirectors: (values: string[]) => Promise<number>,
    protected saveCast: (values: string[]) => Promise<number>,
    protected saveProductions: (values: string[]) => Promise<number>,
    protected saveCountries: (values: string[]) => Promise<number>,
    private infoRepository: InfoRepository<Info10>
    ){
    super(search, repository);
  }
  load(id: string): Promise<Film | null> {
    return this.repository.load(id).then((film) => {
      if (!film) {
        return null;
      } else {
        return this.infoRepository.load(id).then((info) => {
          if (info) {
            delete (info as any)["id"];
            film.info = info;
          }
          return film;
        });
      }
    });
  }

  insert(film: Film, ctx?: any): Promise<number> {
    if (film.directors && film.directors.length > 0) {
      this.saveDirectors(film.directors);
    }
    if (film.filmcast && film.filmcast.length > 0) {
      this.saveCast(film.filmcast);
    }
    if (film.productions && film.productions.length > 0) {
      this.saveProductions(film.productions);
    }
    if (film.countries && film.countries.length > 0) {
      this.saveCountries(film.countries);
    }
    return this.repository.insert(film, ctx);
  }
  update(film: Film, ctx?: any): Promise<number> {
    if (film.directors && film.directors.length > 0) {
      this.saveDirectors(film.directors);
    }
    if (film.filmcast && film.filmcast.length > 0) {
      this.saveCast(film.filmcast);
    }
    if (film.productions && film.productions.length > 0) {
      this.saveProductions(film.productions);
    }
    if (film.countries && film.countries.length > 0) {
      this.saveCountries(film.countries);
    }
    return this.repository.update(film, ctx);
  }
  patch(film: Film, ctx?: any): Promise<number> {
    if (film.directors && film.directors.length > 0) {
      this.saveDirectors(film.directors);
    }
    if (film.filmcast && film.filmcast.length > 0) {
      this.saveCast(film.filmcast);
    }
    if (film.productions && film.productions.length > 0) {
      this.saveProductions(film.productions);
    }
    if (film.countries && film.countries.length > 0) {
      this.saveCountries(film.countries);
    }
    return this.repository.patch
      ? this.repository.patch(film, ctx)
      : Promise.resolve(-1);
  }
}
export function useFilmService(
  db: DB,
  saveDirectors: (values: string[]) => Promise<number>,
  saveCast: (values: string[]) => Promise<number>,
  saveProductions: (values: string[]) => Promise<number>,
  saveCountries: (values: string[]) => Promise<number>,
  mapper?: TemplateMap
): FilmService {
  const query = useQuery("film", mapper, filmModel, true);
  const builder = new SearchBuilder<Film, FilmFilter>(
    db.query,
    "films",
    filmModel,
    db.driver,
    query
  );
  const repository = new SqlFilmRepositoy(db);
  const infoRepository = new SqlInfoRepository<Info10>(db, 'rates_film_info', info10Model, buildToSave);
  return new FilmManager(builder.search, repository, saveDirectors, saveCast, saveProductions, saveCountries, infoRepository);
}
export function useFilmController(
  log: Log,
  db: DB,
  saveDirectors: (values: string[]) => Promise<number>,
  saveCast: (values: string[]) => Promise<number>,
  saveProductions: (values: string[]) => Promise<number>,
  saveCountries: (values: string[]) => Promise<number>,
  mapper?: TemplateMap
): FilmController {
  return new FilmController(log, useFilmService(db, saveDirectors, saveCast, saveProductions, saveCountries, mapper));
}

export function useRateFilmService(db: DB, mapper?: TemplateMap): Rater {
  const query = useQuery('rates_film', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates_film', rateModel, db.driver, query);
  const rateRepository = new SqlRateRepository<Rate>(db, 'rates_film', rateModel, buildToSave, 10, 'rates_film_info', 'count', 'score', 'rate', 'rate', 'author', 'id', 'id', 'id');
  const infoRepository = new SqlInfoRepository<Info10>(db, 'rates_film_info', info10Model, buildToSave);
  const rateReactionRepository = new SqlRateReactionRepository(db, 'rates_film_reaction', rateReactionModel, 'rates_film', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlCommentRepository<RateComment>(db, 'rates_film_comments', rateCommentModel, 'rates_film', 'replyCount', 'author', 'id', 'author');
  return new RateService(builder.search, rateRepository, infoRepository, rateCommentRepository, rateReactionRepository);
}

export function useRateFilmController(log: Log, db: DB, mapper?: TemplateMap): RateController {
  const rateValidator = new RateValidator(rateModel, check, 10);
  const commentValidator = new CommentValidator(rateCommentModel, check);
  return new RateController(log, useRateFilmService(db, mapper),rateValidator,commentValidator, generate, 'commentId', 'userId', 'author', 'id');
}

export function useRateFilmCommentService(db: DB, mapper?: TemplateMap): RateCommentQuery {
  const query = useQuery('rates_film_comments', mapper, rateCommentModel, true);
  const builder = new SearchBuilder<RateComment, RateCommentFilter>(db.query, 'rates_film_comments', rateCommentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<RateComment>(db, 'rates_film_comments', rateCommentModel, 'rates_film', 'replyCount', 'author', 'id', 'author');
  return new RateCommentManager(builder.search, rateCommentRepository);
}

export function useRateFilmCommentController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateCommentController {
  return new RateCommentController(log, useRateFilmCommentService(db, mapper));
}

export function generate(): string {
  return shortid.generate();
}
