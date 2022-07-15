import { attr, Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { buildCountQuery, buildToInsert, buildToInsertBatch, DB, postgres, Repository, SearchBuilder, Service, Statement } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
    Rate, RateFilter, RateId, rateModel, RateRepository, RateService, Info, infoModel, InfoRepository, 
    ReplyRepository, Reply, ReplyFilter, ReplyId, ReplyService, replyModel, rateReactionModel, RateReactionRepository,
    RateReaction, RateReactionId, RateReactionFilter, RateReactionService
} from './rate';
import { RateController } from './rate-controller';
import { SqlRateRepository } from './sql-rate-repository';
import { SqlInfoRepository } from './sql-info-repository';
import { buildToSave } from 'pg-extension';
import { SqlReplyRepository } from './sql-reply-repository';
import { SqlRateReactionRepository } from './sql-ratereaction-repository';
import { buildQuery } from './query';
import { ReplyController } from './reply-controller';
export * from './rate-controller';
export * from './rate';
export { RateController };
export { ReplyController };

export class RateManager extends Manager<Rate, RateId, RateFilter> implements RateService {
    constructor(search: Search<Rate, RateFilter>,
        public repository: RateRepository,
        private infoRepository: InfoRepository,
        private replyRepository: ReplyRepository,
        private rateReactionRepository: RateReactionRepository) {
        super(search, repository);
        this.rate = this.rate.bind(this);
        this.update = this.update.bind(this);
        this.save = this.save.bind(this);
        this.reply = this.reply.bind(this);
        this.load = this.load.bind(this);
        this.removeReply = this.removeReply.bind(this);
        this.updateReply = this.updateReply.bind(this);
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
                })
            }
        });
    }

    removeUseful(id: string, author: string, userId: string,): Promise<number> {
        return this.rateReactionRepository.getUseful(id, author, userId).then(exist => {
            if (exist) {
                return this.rateReactionRepository.removeUseful(id, author, userId).then(res => {
                    if (res > 0) {
                        return this.repository.decreaseUsefulCount(id, author);
                    } else {
                        return 0;
                    }
                })
            } else {
                return 0;
            }
        });
    }

    async rate(rate: Rate): Promise<boolean> {
        console.log(rate);
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
        console.log(exist);

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

    async reply(reply: Reply): Promise<boolean> {
        const checkReply = await this.replyRepository.getReply(reply.id, reply.author, reply.userId);
        const checkRate = await this.repository.getRate(reply.id, reply.author);
        if (!checkRate) {
            return false;
        } else {
            if (checkReply) {
                return false;
            } else {
                reply.time ? reply.time = reply.time : reply.time = new Date();
                const wait = await this.replyRepository.save(reply);
                await this.repository.increaseReplyCount(reply.id, reply.author);
                return true;
            }
        }
    }

    removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number> {
        return this.replyRepository.getReply(id, author, userId).then(exist => {
            if (exist) {
                return this.replyRepository.removeReply(id, author, userId).then(res => {
                    if (res > 0) {
                        return this.repository.decreaseReplyCount(id, author);
                    } else {
                        return 0;
                    }
                })
            } else {
                return 0;
            }
        })
    }

    updateReply(reply: Reply): Promise<number> {
        return this.replyRepository.getReply(reply.id, reply.author, reply.userId).then(exist => {
            if (!exist) {
                return 0
            } else {
                return this.replyRepository.update(reply);
            }
        })
    }

    updateRate(rate: Rate): Promise<number> {
        return this.repository.getRate(rate.id, rate.author).then(exist => {
            if (exist) {
                rate.time ? rate.time = rate.time : rate.time = new Date();
                return this.repository.save(rate);
            } else {
                return 0;
            }
        })
    }
}

export function useRateService(db: DB, mapper?: TemplateMap): RateService {
    const query = useQuery('rates', mapper, rateModel, true);
    const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates', rateModel, db.driver, query);
    const repository = new SqlRateRepository(db, 'rates', buildToSave);
    const infoRepository = new SqlInfoRepository(db, 'info', buildToSave);
    const rateReactionRepository = new SqlRateReactionRepository(db, 'ratereaction', rateReactionModel, buildToSave);
    const replyRepository = new SqlReplyRepository(db, 'reply', buildToSave);
    return new RateManager(builder.search, repository, infoRepository, replyRepository, rateReactionRepository);
}

export function useRateController(log: Log, db: DB, mapper?: TemplateMap): RateController {
    return new RateController(log, useRateService(db, mapper));
}

export class ReplyManager extends Manager<Reply, ReplyId, ReplyFilter> implements ReplyService {
    constructor(search: Search<Reply, ReplyFilter>,
        protected replyRepository: ReplyRepository) {
        super(search, replyRepository);
    }
}

export function useReplyService(db: DB, mapper?: TemplateMap): ReplyService {
    const query = useQuery('reply', mapper, replyModel, true);
    const builder = new SearchBuilder<Reply, ReplyFilter>(db.query, 'reply', replyModel, db.driver, query);
    const replyRepository = new SqlReplyRepository(db, 'reply', buildToSave);
    return new ReplyManager(builder.search, replyRepository);
}


export function useReplyController(log: Log, db: DB, mapper?: TemplateMap): ReplyController {
    return new ReplyController(log, useReplyService(db, mapper));
}

