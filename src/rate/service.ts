import { Manager, Search, SearchResult } from './core';
import {
  Info,
  InfoRepository, Rate, RateComment, RateCommentFilter, RateCommentRepository, RateCommentService, RateFilter, RateId, RateReactionRepository,
  RateRepository, RateService, ShortComment, ShortRate
} from './rate';

export * from './rate';

export interface URL {
  id: string;
  url: string;
}
export class RateManager extends Manager<Rate, RateId, RateFilter> implements RateService {
  constructor(search: Search<Rate, RateFilter>,
    public repository: RateRepository<Info>,
    private infoRepository: InfoRepository,
    private rateCommentRepository: RateCommentRepository,
    private rateReactionRepository: RateReactionRepository,
    private queryURL?: (ids: string[]) => Promise<URL[]>) {
    super(search, repository);
    this.rate = this.rate.bind(this);
    this.update = this.update.bind(this);
    this.save = this.save.bind(this);
    this.comment = this.comment.bind(this);
    this.load = this.load.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.search = this.search.bind(this);
  }
  async rate(rate: Rate): Promise<number> {
    rate.time = new Date();
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
    let r = 0;
    if (exist) {
      r = exist.rate;
      const sr: ShortRate = { review: exist.review, rate: exist.rate, time: exist.time };
      if (exist.histories && exist.histories.length > 0) {
        const history = exist.histories;
        history.push(sr);
        rate.histories = history;
      } else {
        rate.histories = [sr];
      }
    }
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
    const res = await this.repository.save(rate, info);
    return res;
  }
  search(s: RateFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<Rate>> {
    console.log(s);

    return super.search(s, limit, offset, fields).then(res => {
      console.log("enter");
      
      if (!this.queryURL) {
        console.log("none url");
        //console.log(JSON.stringify(res));
        return res;
      } else {
        console.log(res);
        
        if (res.list && res.list.length > 0) {
          const ids: string[] = [];
          for (const rate of res.list) {
            ids.push(rate.author);
          }
          console.log(JSON.stringify(ids));
          return this.queryURL(ids).then(urls => {
            console.log(JSON.stringify(urls));
            for (const rate of res.list) {
              const i = binarySearch(urls, rate.author);
              if (i >= 0) {
                rate.authorURL = urls[i].url;
              }
              // rate.authorURL = getUrl(rate.author, urls);
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

function getUrl(id: string, urls: URL[]): string|undefined {
  for (const obj of urls) {
    if (obj.id === id) {
      return obj.url;
    }
  }
  return undefined;
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
