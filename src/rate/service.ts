import { Attributes, Manager, Search, Statement, StringMap } from './core';
import {
  InfoRepository, Rate, RateComment, RateCommentFilter, RateCommentRepository, RateCommentService, RateFilter, RateId,
  RateReaction, RateReactionRepository, RateRepository, RateService
} from './rate';
export * from './rate';

export type LikeType = 'like' | 'ilike';
export type Query = <S>(filter: S, bparam: LikeType | ((i: number) => string), sn?: string, buildSort?: (sort?: string, map?: Attributes | StringMap) => string, attrs?: Attributes) => Statement | undefined;
export interface Parameter {
  name: string;
  type: string;
}
export interface StringFormat {
  texts: string[];
  parameters: Parameter[];
}
export interface Template {
  name?: string | null;
  text: string;
  templates: TemplateNode[];
}
export interface TemplateNode {
  type: string;
  text: string;
  property: string | null;
  encode?: string | null;
  value: string | null;
  format: StringFormat;
  array?: string | null;
  separator?: string | null;
  suffix?: string | null;
  prefix?: string | null;
}
export type TemplateMap = Map<string, Template>;
export class RateManager extends Manager<Rate, RateId, RateFilter> implements RateService {
  constructor(search: Search<Rate, RateFilter>,
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
/*
export function useRateService(db: DB, buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined, rateQuery: Query): RateService {
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates', rateModel, db.driver, rateQuery);
  const repository = new SqlRateRepository(db, 'rates', rateModel, buildToSave);
  const infoRepository = new SqlInfoRepository(db, 'info', infoModel, buildToSave);
  const rateReactionRepository = new SqlRateReactionRepository(db, 'ratereaction', rateReactionModel, buildToSave);
  const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments', rateCommentModel, buildToSave);
  return new RateManager(builder.search, repository, infoRepository, rateCommentRepository, rateReactionRepository);
}
*/
// tslint:disable-next-line:max-classes-per-file
export class RateCommentManager extends Manager<RateComment, string, RateCommentFilter> implements RateCommentService {
  constructor(search: Search<RateComment, RateCommentFilter>,
    protected replyRepository: RateCommentRepository) {
    super(search, replyRepository);
  }
}
/*
export function useRateCommentService(db: DB, buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined, commentQuery: Query): RateCommentService {
  const builder = new SearchBuilder<RateComment, RateCommentFilter>(db.query, 'rate_comments', rateCommentModel, db.driver, commentQuery);
  const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments', attrs, buildToSave);
  return new RateCommentManager(builder.search, rateCommentRepository);
}
*/
