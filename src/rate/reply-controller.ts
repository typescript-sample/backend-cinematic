import { Controller, Log } from 'express-ext';
import { Reply, ReplyFilter, ReplyId, ReplyService } from './rate';

export class ReplyController extends Controller<Reply, ReplyId, ReplyFilter> {
  constructor(log: Log, protected replyService: ReplyService) {
    super(log, replyService);
  }
}
