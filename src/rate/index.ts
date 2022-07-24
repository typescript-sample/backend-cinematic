import { Log } from 'express-ext';
import { buildToSave } from 'pg-extension';
import { DB, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { RateCommentController } from './comment-controller';
import { infoModel, Rate, RateComment, RateCommentFilter, rateCommentModel, RateCommentService, RateFilter, rateModel, RateService } from './rate';
import { RateController } from './rate-controller';
import { RateCommentManager, RateManager } from './service';
import { rateReactionModel, SqlInfoRepository, SqlRateCommentRepository, SqlRateReactionRepository, SqlRateRepository } from './sql-rate-repository';

export * from './rate-controller';
export * from './rate';
export { RateController };
export { RateCommentController };

export function useRateService(db: DB, mapper?: TemplateMap): RateService {
  const query = useQuery('rates', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates', rateModel, db.driver, query);
  const repository = new SqlRateRepository(db, 'rates', rateModel, buildToSave);
  const infoRepository = new SqlInfoRepository(db, 'info', infoModel, buildToSave);
  const rateReactionRepository = new SqlRateReactionRepository(db, 'ratereaction', rateReactionModel, buildToSave);

  const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments', rateCommentModel, buildToSave);
  return new RateManager(builder.search, repository, infoRepository, rateCommentRepository, rateReactionRepository);
}

export function useRateController(log: Log, db: DB, mapper?: TemplateMap): RateController {
  return new RateController(log, useRateService(db, mapper));
}

export function useRateCommentService(db: DB, mapper?: TemplateMap): RateCommentService {
  const query = useQuery('ratecomment', mapper, rateCommentModel, true);
  const builder = new SearchBuilder<RateComment, RateCommentFilter>(db.query, 'rate_comments', rateCommentModel, db.driver, query);
  const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments', rateCommentModel, buildToSave);
  return new RateCommentManager(builder.search, rateCommentRepository);
}

export function useRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController {
  return new RateCommentController(log, useRateCommentService(db, mapper));
}
