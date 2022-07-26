import { Log } from 'express-ext';
import { buildToSave } from 'pg-extension';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Manager, Search } from './core';
import { RateFilmId, RateFilms, RateFilmsFilter, RateFilmsRepository, RateFilmsService } from './ratefilms';

export * from './ratefilms';

export class RateFilmManager extends Manager<RateFilms, RateFilmId, RateFilmsFilter> implements RateFilmsService {
    constructor(search: Search<RateFilms, RateFilmsFilter>,
        public repository: RateFilmsRepository) {
        super(search, repository);
    }
}