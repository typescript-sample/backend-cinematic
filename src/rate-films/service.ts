import { Manager, Search } from '../rate/core';
import {
    RateComment, RateCommentRepository, RateId, RateReactionRepository,
    RateRepository, RateService, ShortComment, ShortRate
} from '../rate/rate';
import { Rate, RateFilmInfoRepository, RateFilter } from './ratefilms';

export * from '../rate/rate';

export class RateFilmManager extends Manager<Rate, RateId, RateFilter> implements RateService {
    constructor(search: Search<Rate, RateFilter>, public repository: RateRepository,
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
        rate.time = new Date();
        let info = await this.infoRepository.load(rate.id);
        if (!info) {
            const res = await this.repository.add(rate, true);
            return res;
        }
        const exist = await this.repository.getRate(rate.id, rate.author);
        if (!exist) {
            const res = await this.repository.add(rate);
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
        const res = await this.repository.edit(rate, exist.rate);
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