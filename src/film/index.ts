
import { Log } from "express-ext";
import { Manager, Mapper, Search } from "onecore";
import { query } from "pg-extension";
import { buildCountQuery, buildToInsert, buildToInsertBatch, DB, postgres, Repository, SearchBuilder, Statement } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import { Film, FilmFilter, filmModel, FilmRepository, FilmService } from "./film";
import { FilmController } from "./film-controller";
import { SqlFilmRepositoy } from "./sql-film-repository";

export class FilmManager extends Manager<Film, string, FilmFilter> implements FilmService {
  constructor(search: Search<Film, FilmFilter>, repository: FilmRepository) {
    super(search,repository);
  };
}
export function useFilmService(db: DB, mapper?: TemplateMap): FilmService {
  const query = useQuery('film', mapper, filmModel, true);
  const builder = new SearchBuilder<Film, FilmFilter>(db.query, 'films', filmModel, db.driver, query);
  const repository = new SqlFilmRepositoy(db);
  return new FilmManager(builder.search, repository);
}
export function useFilmController(log: Log, db: DB, mapper?: TemplateMap): FilmController {
  return new FilmController(log, useFilmService(db, mapper));
}
