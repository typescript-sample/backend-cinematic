
import { Log } from "express-ext";
import { Manager, Mapper, Search } from "onecore";
import { query } from "pg-extension";
import { buildCountQuery, buildToInsert, buildToInsertBatch, DB, postgres, Repository, SearchBuilder, Statement } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import { Film, FilmFilter, filmModel, FilmRepository, FilmService, FilmRate, FilmInfoRepository, FilmRateRepository, FilmInfo, FilmRateService, filmRateModel, FilmRateFilter, UsefulFilmFilter, UsefulFilm, UsefulFilmRepository, UsefulFilmModel } from "./film";
import { FilmController } from "./film-controller";
import { SqlFilmRepositoy } from "./sql-film-repository";
import { SqlFilmInfoRepositoy } from "./sql-film-info-repository";
import { SqlFilmRateRepositoy } from "./sql-film-rate-repository";
import { SqlFilmUsefulRepositoy } from "./sql-film-useful-repository";
import { v4 as uuidv4 } from 'uuid';
import { FilmRateController } from "./film-rate-controller";

export class FilmManager extends Manager<Film, string, FilmFilter> implements FilmService {
  constructor(search: Search<Film, FilmFilter>,
    repository: FilmRepository,
    private infoRepository: FilmInfoRepository,
    private rateRepository: FilmRateRepository) {
    super(search, repository);
  };

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

  async rate(rate: FilmRate): Promise<boolean> {

    if (rate.id) {

      let info = await this.infoRepository.load(rate.id);

      if (!info) {
        let dbInfo = {
          'id': rate.id,
          'rate': 0,
          'rate1': 0,
          'rate2': 0,
          'rate3': 0,
          'rate4': 0,
          'rate5': 0,
          'rate6': 0,
          'rate7': 0,
          'rate8': 0,
          'rate9': 0,
          'rate10': 0,
          'viewCount': 0,
        };
        await this.infoRepository.insert(dbInfo);
        info = await this.infoRepository.load(rate.id);
      }

      if (!info || typeof info[('rate' + rate.rate.toString()) as keyof FilmInfo] === 'undefined') {
        console.log('123');
        return false;
      }
      if (rate.id) {
        const dbRate = await this.rateRepository.searchFilmRate(rate);

        if (dbRate) {
          (info as any)['rate' + dbRate.rate.toString()] -= 1;
          dbRate.rate = rate.rate;
          dbRate.review = rate.review;
          const res = await this.rateRepository.update(dbRate);

          if (res < 1) {
            return false;
          }
        }
        else {
          const res = await this.rateRepository.insert(rate);
          if (res < 1) {
            return false;
          }
        }

      } else {
        return false;
      }
      (info as any)['rate' + rate.rate.toString()] += 1;
      const sumRate = info.rate1 +
        info.rate2 * 2 +
        info.rate3 * 3 +
        info.rate4 * 4 +
        info.rate5 * 5 +
        info.rate6 * 6 +
        info.rate7 * 7 +
        info.rate8 * 8 +
        info.rate9 * 9 +
        info.rate10 * 10;
      const count = info.rate1 +
        info.rate2 +
        info.rate3 +
        info.rate4 +
        info.rate5 +
        info.rate6 +
        info.rate7 +
        info.rate8 +
        info.rate9 +
        info.rate10;
      info.rate = sumRate / count;
      info.viewCount = count;
      this.infoRepository.update(info);
      return true;
    }

    return false;
  }
}
export function useFilmService(db: DB, mapper?: TemplateMap): FilmService {
  const query = useQuery('film', mapper, filmModel, true);
  const builder = new SearchBuilder<Film, FilmFilter>(db.query, 'films', filmModel, db.driver, query);
  const repository = new SqlFilmRepositoy(db);
  const infoRepository = new SqlFilmInfoRepositoy(db);
  const rateRepository = new SqlFilmRateRepositoy(db);
  return new FilmManager(builder.search, repository, infoRepository, rateRepository);
}
export function useFilmController(log: Log, db: DB, mapper?: TemplateMap): FilmController {
  return new FilmController(log, useFilmService(db, mapper));
}

export class FilmRateManager extends Manager<FilmRate, string, FilmRateFilter> implements FilmRateService {
  constructor(search: Search<FilmRate, FilmRateFilter>,
    repository: FilmRateRepository,
    public searchUseful: Search<UsefulFilm, UsefulFilmFilter>,
    public useful: UsefulFilmRepository) {
    super(search, repository);
  }

  async usefulFilm(obj: UsefulFilmFilter): Promise<number> {
    const data = await this.useful.searchUseful(obj);
    console.log({ data });

    let isInsert = false
    if (data?.id) {
      const rs = await this.useful.deleteUseful(data.id, data.author)
      if (!rs)
        return 0
    } else {
      // obj.createdat = new Date();
      // obj.updatedat = new Date();
      const newUseful = { ...obj }
      const rs = await this.useful.insert(newUseful)
      if (rs < 1)
        return rs
      isInsert = true;
    }
    const filmRate = await this.repository.load(obj.id)
    if (filmRate) {
      isInsert ? filmRate.usefulCount ? filmRate.usefulCount += 1 : filmRate.usefulCount = 1 : filmRate.usefulCount ? filmRate.usefulCount -= 1 : filmRate.usefulCount = 0;

      // if (isInsert) {
      //   if (filmRate.usefulCount) {
      //     filmRate.usefulCount += 1
      //   } else {
      //     filmRate.usefulCount = 1
      //   }
      // } else {
      //   if (filmRate.usefulCount) {
      //     filmRate.usefulCount -= 1
      //   } else {
      //     filmRate.usefulCount = 0
      //   }
      // }

      const rs = await this.repository.update(filmRate);
      if (rs === 1) {
        return isInsert ? 1 : 2;///1:insert
      }
    }
    return 0;
  }
  async usefulSearch(obj: UsefulFilmFilter): Promise<number> {
    const data = await this.useful.searchUseful(obj)
    if (data?.id) {
      return 1;
    }
    return 0;
  }
}

export function useFilmRateService(db: DB, mapper?: TemplateMap): FilmRateService {
  const query = useQuery('filmrate', mapper, filmRateModel, true);
  const builder = new SearchBuilder<FilmRate, FilmRateFilter>(db.query, 'filmrate', filmRateModel, db.driver, query);
  const queryUseful = useQuery('usefulfilm', mapper, UsefulFilmModel, true);
  const builderUseful = new SearchBuilder<UsefulFilm, UsefulFilmFilter>(db.query, 'usefulfilm', UsefulFilmModel, db.driver, queryUseful);
  const repository = new SqlFilmRateRepositoy(db);
  const repositoryUseful = new SqlFilmUsefulRepositoy(db);
  return new FilmRateManager(builder.search, repository, builderUseful.search, repositoryUseful);
}

export function useFilmRateController(log: Log, db: DB, mapper?: TemplateMap): FilmRateController {
  return new FilmRateController(log, useFilmRateService(db, mapper));
}
