import { Manager, Search } from '../rate/core';
import {
    RateComment, RateCommentRepository, RateId, RateReactionRepository,
    RateRepository, RateService, ShortComment, ShortRate
} from '../rate/rate';
import { Rate, RateFilmInfo, RateFilter } from './ratefilms'
import { RateFilmInfoRepository } from './ratefilms';

export * from '../rate/rate';

export class RateFilmManager extends Manager<Rate, RateId, RateFilter> implements RateService {
    constructor(search: Search<Rate, RateFilter>, public repository: RateRepository<RateFilmInfo>,
        private infoRepository: RateFilmInfoRepository,
        private rateCommentRepository: RateCommentRepository,
        private rateReactionRepository: RateReactionRepository) {
        super(search, repository);
        this.rate = this.rate.bind(this);
        this.comment = this.comment.bind(this);
        this.removeComment = this.removeComment.bind(this);
        this.updateComment = this.updateComment.bind(this);
    }

    async rate(rate: Rate): Promise<number> {
        console.log({ rate });

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
                'rate6': 0,
                'rate7': 0,
                'rate8': 0,
                'rate9': 0,
                'rate10': 0,
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
        console.log(r);

        (info as any)['rate' + rate.rate?.toString()] += 1;
        const sumRate = info.rate1 +
            info.rate2 * 2 +
            info.rate3 * 3 +
            info.rate4 * 4 +
            info.rate5 * 5 +
            info.rate6 * 6 +
            info.rate7 * 7 +
            info.rate8 * 8 +
            info.rate9 * 9 +
            info.rate10 * 10 - r;

        const count = info.rate1 +
            info.rate2 +
            info.rate3 +
            info.rate4 +
            info.rate5 +
            info.rate6 +
            info.rate7 +
            info.rate8 +
            info.rate9 +
            info.rate10 + (exist ? 0 : 1);

        info.rate = sumRate / count;
        info.viewCount = count;
        rate.usefulCount = 0;
        const res = await this.repository.save(rate, info);
        return res;
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
                const res = this.rateCommentRepository.update(exist);
                return res;
            }
        });
    }
}