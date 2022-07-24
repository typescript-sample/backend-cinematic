import { Manager, Search } from './core';
import {
  InfoRepository, Rate, RateComment, RateCommentFilter, RateCommentRepository, RateCommentService, RateFilter, RateId,
  RateReactionRepository, RateRepository, RateService
} from './rate';
export * from './rate';

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
        return 0;
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
        return 0;
      } else {
        comment.updatedAt = new Date();
        return this.rateCommentRepository.update(comment);
      }
    });
  }
  updateRate(rate: Rate): Promise<number> {
    return this.repository.getRate(rate.id, rate.author).then(exist => {
      if (exist) {
        rate.time ? rate.time = rate.time : rate.time = new Date();
        return this.repository.update(rate);
      } else {
        return 0;
      }
    });
  }
}
// tslint:disable-next-line:max-classes-per-file
export class RateCommentManager extends Manager<RateComment, string, RateCommentFilter> implements RateCommentService {
  constructor(search: Search<RateComment, RateCommentFilter>,
    protected replyRepository: RateCommentRepository) {
    super(search, replyRepository);
  }
}
