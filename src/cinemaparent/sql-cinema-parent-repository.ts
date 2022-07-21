import { DB, Repository } from 'query-core';
import { CinemaParent, CinemaParentModel, CinemaParentRepository } from './cinema-parent';

export class SqlCinemaParentRepository extends Repository<CinemaParent, string> implements CinemaParentRepository {
  constructor(db: DB) {
    super(db, 'CinemaParent', CinemaParentModel);
  }
}
