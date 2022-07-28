import { Attributes, Manager, Search, SearchResult } from './core';
import {
  InfoRepository, Rate, RateComment, RateCommentFilter, RateCommentRepository, RateCommentService, RateFilter, RateReactionRepository,
  RateRepository, RateService, ShortComment, ShortRate
} from './rate';

export * from './rate';

export interface URL {
  id: string;
  url: string;
}
export class RateManager implements RateService {
  constructor(protected find: Search<Rate, RateFilter>,
    public repository: RateRepository,
    private infoRepository: InfoRepository,
    private rateCommentRepository: RateCommentRepository,
    private rateReactionRepository: RateReactionRepository,
    private queryURL?: (ids: string[]) => Promise<URL[]>) {
    this.rate = this.rate.bind(this);
    this.comment = this.comment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.search = this.search.bind(this);
  }
  async rate(rate: Rate): Promise<number> {
    rate.time = new Date();
    let info = await this.infoRepository.load(rate.id);
    if (!info) {
      const res = await this.repository.insert(rate, true);
      return res;
    }
    const exist = await this.repository.getRate(rate.id, rate.author);
    if (!exist) {
      const res = await this.repository.insert(rate);
      return res;
    }
    const sr: ShortRate = { review: exist.review, rate: exist.rate, time: exist.time };
    if (exist.histories && exist.histories.length > 0) {
      const history = exist.histories;
      history.push(sr);
      rate.histories = history;
    } else {
      rate.histories = [sr];
    }
    const res = await this.repository.update(rate, exist.rate);
    return res;
  }
  search(s: RateFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<Rate>> {
    return this.find(s, limit, offset, fields).then(res => {
      if (!this.queryURL) {
        return res;
      } else {
        if (res.list && res.list.length > 0) {
          const ids: string[] = [];
          for (const rate of res.list) {
            ids.push(rate.author);
          }
          return this.queryURL(ids).then(urls => {
            for (const rate of res.list) {
              const i = binarySearch(urls, rate.author);
              if (i >= 0) {
                rate.authorURL = urls[i].url;
              }
            }
            return res;
          })
        } else {
          return res;
        }
      }
    });
  }
  getRate(id: string, author: string): Promise<Rate | null> {
    return this.repository.getRate(id, author);
  }

  setUseful(id: string, author: string, userId: string): Promise<number> {
    return this.rateReactionRepository.save(id, author, userId, 1);
  }
  removeUseful(id: string, author: string, userId: string): Promise<number> {
    return this.rateReactionRepository.remove(id, author, userId);
  }
  comment(comment: RateComment): Promise<number> {
    return this.repository.getRate(comment.id, comment.author).then(checkRate => {
      if (!checkRate) {
        return -1;
      } else {
        comment.time ? comment.time = comment.time : comment.time = new Date();
        return this.rateCommentRepository.insert(comment);
      }
    });
  }
  removeComment(commentId: string, userId: string): Promise<number> {
    return this.rateCommentRepository.load(commentId).then(comment => {
      if (comment) {
        if (userId === comment.author || userId === comment.userId) {
          return this.rateCommentRepository.remove(commentId, comment.id, comment.author);
        } else {
          return -2;
        }
      } else {
        return -1;
      }
    });
  }
  updateComment(comment: RateComment): Promise<number> {
    return this.rateCommentRepository.load(comment.commentId).then(exist => {
      if (!exist) {
        return -1;
      } else {
        if (exist.userId !== comment.userId) {
          return -2;
        }
        exist.updatedAt = new Date();
        const c: ShortComment = { comment: exist.comment, time: exist.time };
        if (exist.histories && exist.histories.length > 0) {
          exist.histories.push(c);
        } else {
          exist.histories = [c];
        }
        exist.comment = comment.comment;
        const res =  this.rateCommentRepository.update(exist);
        return res;
      }
    });
  }
}
// tslint:disable-next-line:max-classes-per-file
export class RateCommentManager extends Manager<RateComment, string, RateCommentFilter> implements RateCommentService {
  constructor(search:Search<RateComment, RateCommentFilter> ,
    protected replyRepository: RateCommentRepository) {
    super(search, replyRepository);
  }
}

function binarySearch(ar: URL[], el: string): number {
  var m = 0;
  var n = ar.length - 1;
  while (m <= n) {
      var k = (n + m) >> 1;
      var cmp = compare(el, ar[k].id);
      if (cmp > 0) {
          m = k + 1;
      } else if(cmp < 0) {
          n = k - 1;
      } else {
          return k;
      }
  }
  return -m - 1;
}
function compare(s1: string, s2: string): number {
  return s1.localeCompare(s2);
}
interface ErrorMessage {
  field: string;
  code: string;
  param?: string|number|Date;
  message?: string;
}
export class CommentValidator {
  constructor(protected attributes: Attributes, protected check: (obj: any, attributes: Attributes) => ErrorMessage[]) {
    this.validate = this.validate.bind(this);
  }
  validate(comment: RateComment): Promise<ErrorMessage[]> {
    const errs = this.check(comment, this.attributes)
    return Promise.resolve(errs);
  }
}
export class RateValidator {
  constructor(protected attributes: Attributes, protected check: (obj: any, attributes: Attributes) => ErrorMessage[], protected max: number) {
    this.validate = this.validate.bind(this);
  }
  validate(rate: Rate): Promise<ErrorMessage[]> {
    const errs = this.check(rate, this.attributes)
    if (rate.rate > this.max) {
      const err = createError('rate', 'max', this.max);
      if (errs) {
        errs.push(err);
        return Promise.resolve(errs);
      } else {
        return Promise.resolve([err]);
      }
    } else {
      return Promise.resolve(errs);
    }
  }
}
function createError(field: string, code?: string, param?: string | number | Date): ErrorMessage {
  if (!code) {
    code = 'string';
  }
  const error: ErrorMessage = { field, code };
  if (param) {
    error.param = param;
  }
  return error;
}
