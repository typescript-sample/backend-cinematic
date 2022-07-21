import { DB, Repository } from 'query-core';
import { Film, filmModel, FilmRepository } from './film';

export class SqlFilmRepositoy extends Repository<Film, string> implements FilmRepository {
  constructor(db: DB) {
    super(db, 'films', filmModel);
  }
}
