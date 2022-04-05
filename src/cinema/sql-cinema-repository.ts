import { DB, Repository } from 'query-core';
import { Cinema, cinemaModel, CinemaRepository } from './cinema';

export class SqlCinemaRepository extends Repository<Cinema, string> implements CinemaRepository {
  constructor(db: DB) {
    super(db, 'cinema', cinemaModel);
  }
}
