import { Log } from 'express-ext';
import { buildToSave } from 'pg-extension';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Manager, Search } from './core';
import { Info, infoModel, Rate, RateComment, RateCommentFilter, rateCommentModel, RateCommentService, RateFilter, RateCommentManager, RateManager, rateModel, RateService } from 'rate5';
import { RateRepository } from 'rate-query';
import { rateReactionModel, SqlInfoRepository, SqlRateCommentRepository, SqlRateReactionRepository, SqlRateRepository } from 'rate-query';
import { RateCommentController } from '../rate/comment-controller';
import { RateController } from '../rate/rate-controller';
import { RateFilmInfo, rateFilmInfoModel } from './ratefilms';

export * from './ratefilms';

export function useRateService(db: DB, mapper?: TemplateMap): RateService {
    const query = useQuery('rates', mapper, rateModel, true);
    const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates', rateModel, db.driver, query);
    const repository = new SqlRateRepository(db, 'rates', rateModel, buildToSave);
    const infoRepository = new SqlInfoRepository<RateFilmInfo>(db, 'info', rateFilmInfoModel, buildToSave);
    const rateReactionRepository = new SqlRateReactionRepository(db, 'ratereaction', rateReactionModel, 'rates', 'usefulCount', 'author', 'id');
    const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments', rateCommentModel, 'rates', 'replyCount', 'author', 'id');
    return new RateManager(builder.search, repository, infoRepository, rateCommentRepository, rateReactionRepository);
  }
  
  export function useRateController(log: Log, db: DB, mapper?: TemplateMap): RateController {
    return new RateController(log, useRateService(db, mapper));
  }
  
  export function useRateCommentService(db: DB, mapper?: TemplateMap): RateCommentService {
    const query = useQuery('ratecomment', mapper, rateCommentModel, true);
    const builder = new SearchBuilder<RateComment, RateCommentFilter>(db.query, 'rate_comments', rateCommentModel, db.driver, query);
    const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments', rateCommentModel, 'rates', 'replyCount', 'author', 'id');
    return new RateCommentManager(builder.search, rateCommentRepository);
  }
  
  export function useRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController {
    return new RateCommentController(log, useRateCommentService(db, mapper));
  }