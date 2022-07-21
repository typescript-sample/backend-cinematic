import { Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { buildToSave } from 'pg-extension';
import { DB, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Appreciation, AppreciationFilter, AppreciationId, appreciationModel, AppreciationRepository, AppreciationService, Reply, ReplyFilter, ReplyId, replyModel, ReplyRepository, ReplyService, Useful, usefulModel, UsefulRepository } from './appreciation';
import { AppreciationController } from './appreciation-controller';
import { AppreciationReplyController } from './reply-controller';
import { SqlAppreciationRepository } from './sql-appreciation-repository';
import { SqlReplyRepository } from './sql-reply-repository';
import { SqlUsefulRepository } from './sql-useful-repository';

export * from './appreciation-controller';
export * from './reply-controller';
export * from './appreciation';
export { AppreciationController };
export { AppreciationReplyController };

export class AppreciationManager extends Manager<Appreciation, AppreciationId, AppreciationFilter> implements AppreciationService {
  constructor(search: Search<Appreciation, AppreciationFilter>,
    public repository: AppreciationRepository, private replyRepository: ReplyRepository, private usefulRepository: UsefulRepository) {
    super(search, repository);
    this.reply = this.reply.bind(this);
    this.removeReply = this.removeReply.bind(this);
    this.updateReply = this.updateReply.bind(this);
    this.setUseful = this.setUseful.bind(this);
  }

  async reply(reply: Reply): Promise<boolean> {
    const checkReply = await this.replyRepository.getReply(reply.id, reply.author, reply.userId);
    const checkAppreciation = await this.repository.getAppreciation(reply.id, reply.author);

    if (!checkAppreciation) { // cmt not exist in db -> cant rep
      return false;
    } else {
      if (checkReply) {
        return false;
      } else {
        reply.createAt ? reply.createAt = reply.createAt : reply.createAt = new Date();
        reply.updateAt ? reply.updateAt = reply.updateAt : reply.updateAt = new Date();
        reply.usefulCount ? reply.usefulCount = reply.usefulCount : reply.usefulCount = 0;
        reply.replyCount ? reply.replyCount = reply.replyCount : reply.replyCount = 0;
        const wait = await this.replyRepository.insert(reply);
        console.log(reply);
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
        });
      } else {
        return 0;
      }
    });
  }

  async updateReply(reply: Reply): Promise<number> {
    const exist = await this.replyRepository.getReply(reply.id, reply.author, reply.userId);
    if (!exist) {
      return 0;
    } else {
      return await this.replyRepository.update(reply);
    }
  }

  async setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    const check = await this.usefulRepository.getUseful(id, author, userId);
    console.log(check);
    if (check) {
      return 0;
    } else {
      const useful: Useful = { id, author, userId, reviewTime: new Date };
      const rs = await this.usefulRepository.save(useful);
      console.log(rs);
      if (rs > 0) {
        const res = await this.replyRepository.increaseUsefulCount(id, author, userId);
        console.log(res);
        return 1;
      } else {
        return 0;
      }
    }
  }
}

export function useAppreciationService(db: DB, mapper?: TemplateMap): AppreciationService {
  const query = useQuery('appreciation', mapper, appreciationModel, true);
  const builder = new SearchBuilder<Appreciation, AppreciationFilter>(db.query, 'appreciation', appreciationModel, db.driver, query);
  const repository = new SqlAppreciationRepository(db, 'appreciation', buildToSave);
  const replyRepository = new SqlReplyRepository(db, 'reply', buildToSave);
  const usefulRepository = new SqlUsefulRepository(db, 'usefulrates', usefulModel, buildToSave);
  return new AppreciationManager(builder.search, repository, replyRepository, usefulRepository);
}

export function useAppreciationController(log: Log, db: DB, mapper?: TemplateMap): AppreciationController {
  return new AppreciationController(log, useAppreciationService(db, mapper));
}

export class ReplyManager extends Manager<Reply, ReplyId, ReplyFilter> implements ReplyService {
  constructor(search: Search<Reply, ReplyFilter>,
    protected replyRepository: ReplyRepository) {
    super(search, replyRepository);
  }
}

export function useReplyService(db: DB, mapper?: TemplateMap): ReplyService {
  const repQuery = useQuery('reply', mapper, replyModel, true);
  const builder = new SearchBuilder<Reply, ReplyFilter>(db.query, 'reply', replyModel, db.driver, repQuery);
  const replyRepository = new SqlReplyRepository(db, 'reply', buildToSave);
  return new ReplyManager(builder.search, replyRepository);
}

export function useAppreciationReplyController(log: Log, db: DB, mapper?: TemplateMap): AppreciationReplyController {
  return new AppreciationReplyController(log, useReplyService(db, mapper));
}
