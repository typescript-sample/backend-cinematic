import { Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { buildToSave } from 'pg-extension';
import { DB, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { RateCommentController } from './comment-controller';
import {
  infoModel, InfoRepository, Rate, RateComment, RateCommentFilter, rateCommentModel, RateCommentRepository, RateCommentService, RateFilter, RateId,
  rateModel, RateReaction, RateReactionRepository, RateRepository, RateService
} from './rate';
import { RateController } from './rate-controller';
import { rateReactionModel, SqlInfoRepository, SqlRateCommentRepository, SqlRateReactionRepository, SqlRateRepository } from './sql-rate-repository';
export * from './rate-controller';
export * from './rate';
export { RateController };
export { RateCommentController };

export class RateManager extends Manager<Rate, RateId, RateFilter> implements RateService {
  constructor(search: Search<Rate, RateFilter>, public rateCommentSearch: Search<RateComment, RateCommentFilter>,
    public repository: RateRepository,
    private infoRepository: InfoRepository,
    private rateCommentRepository: RateCommentRepository,
    private rateReactionRepository: RateReactionRepository) {
    super(search, repository);
    this.rate = this.rate.bind(this);
    this.update = this.update.bind(this);
    this.save = this.save.bind(this);
    this.comment = this.comment.bind(this);
    this.load = this.load.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.updateRate = this.updateRate.bind(this);
  }

  getRate(id: string, author: string): Promise<Rate | null> {
    return this.repository.getRate(id, author);
  }

  setUseful(id: string, author: string, userId: string): Promise<number> {
    return this.rateReactionRepository.getUseful(id, author, userId).then(exist => {
      if (exist) {
        return 0;
      } else {
        const useful: RateReaction = { id, userId, author, time: new Date(), reaction: 1 };
        return this.rateReactionRepository.save(useful).then(res => {
          if (res > 0) {
            return this.repository.increaseUsefulCount(id, author);
          } else {
            return 0;
          }
        });
      }
    });
  }

  removeUseful(id: string, author: string, userId: string): Promise<number> {
    return this.rateReactionRepository.getUseful(id, author, userId).then(exist => {
      if (exist) {
        return this.rateReactionRepository.removeUseful(id, author, userId).then(res => {
          if (res > 0) {
            return this.repository.decreaseUsefulCount(id, author);
          } else {
            return 0;
          }
        });
      } else {
        return 0;
      }
    });
  }

  async rate(rate: Rate): Promise<boolean> {
    let info = await this.infoRepository.load(rate.id);
    if (!info) {
      info = {
        'id': rate.id,
        'rate': 0,
        'rate1': 0,
        'rate2': 0,
        'rate3': 0,
        'rate4': 0,
        'rate5': 0,
        'viewCount': 0,
      };
    }
    const exist = await this.repository.getRate(rate.id, rate.author);
    const r = (exist ? exist.rate : 0);
    (info as any)['rate' + rate.rate?.toString()] += 1;
    const sumRate = info.rate1 +
      info.rate2 * 2 +
      info.rate3 * 3 +
      info.rate4 * 4 +
      info.rate5 * 5 - r;

    const count = info.rate1 +
      info.rate2 +
      info.rate3 +
      info.rate4 +
      info.rate5 + (exist ? 0 : 1);

    info.rate = sumRate / count;
    info.viewCount = count;
    rate.usefulCount = 0;
    await this.infoRepository.save(info);
    await this.repository.save(rate);
    return true;
  }

  async comment(comment: RateComment): Promise<boolean> {
    const checkRate = await this.repository.getRate(comment.id, comment.author);
    if (!checkRate) {
      return false;
    } else {
      comment.time ? comment.time = comment.time : comment.time = new Date();
      const wait = await this.rateCommentRepository.insert(comment);
      await this.repository.increaseReplyCount(comment.id, comment.author);
      return true;
    }
  }

  removeComment(commentId: string, author: string, ctx?: any): Promise<number> {
    return this.rateCommentRepository.load(commentId).then(exist => {
      if (exist) {
        return this.rateCommentRepository.delete(commentId).then(res => {
          if (res > 0) {
            return this.repository.decreaseReplyCount(exist.id, author);
          } else {
            return 0;
          }
        });
      } else {
        return 0;
      }
    });
  }

  updateComment(comment: RateComment): Promise<number> {
    return this.rateCommentRepository.load(comment.commentId).then(exist => {
      if (!exist) {
        return 0;
      } else {
        const commentId = exist.commentId;
        comment.commentId = commentId;
        comment.time ? comment.time = comment.time : comment.time = new Date();
        return this.rateCommentRepository.update(comment);
      }
    });
  }

  updateRate(rate: Rate): Promise<number> {
    return this.repository.getRate(rate.id, rate.author).then(exist => {
      if (exist) {
        rate.time ? rate.time = rate.time : rate.time = new Date();
        return this.repository.save(rate);
      } else {
        return 0;
      }
    });
  }
}

export function useRateService(db: DB, mapper?: TemplateMap): RateService {
  const query = useQuery('rates', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates', rateModel, db.driver, query);
  const repository = new SqlRateRepository(db, 'rates', rateModel, buildToSave);
  const infoRepository = new SqlInfoRepository(db, 'info', infoModel, buildToSave);
  const rateReactionRepository = new SqlRateReactionRepository(db, 'ratereaction', rateReactionModel, buildToSave);

  const queryRateComment = useQuery('ratecomment', mapper, rateCommentModel, true);
  const builderRateComment = new SearchBuilder<RateComment, RateCommentFilter>(db.query, 'rate_comments', rateCommentModel, db.driver, queryRateComment);
  const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments', rateCommentModel, buildToSave);
  return new RateManager(builder.search, builderRateComment.search, repository, infoRepository, rateCommentRepository, rateReactionRepository);
}

export function useRateController(log: Log, db: DB, mapper?: TemplateMap): RateController {
  return new RateController(log, useRateService(db, mapper));
}

// tslint:disable-next-line:max-classes-per-file
export class RateCommentManager extends Manager<RateComment, string, RateCommentFilter> implements RateCommentService {
  constructor(search: Search<RateComment, RateCommentFilter>,
    protected replyRepository: RateCommentRepository) {
    super(search, replyRepository);
  }
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


