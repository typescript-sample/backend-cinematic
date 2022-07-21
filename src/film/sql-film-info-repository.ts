import { DB, Repository } from 'query-core';
import { FilmInfo, filmInfoModel, FilmInfoRepository } from './film';

export class SqlFilmInfoRepositoy extends Repository<FilmInfo, string> implements FilmInfoRepository {
  constructor(db: DB) {
    super(db, 'filmInfo', filmInfoModel);
  }
}
