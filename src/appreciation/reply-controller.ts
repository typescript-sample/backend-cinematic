import { Controller, Log } from 'express-ext';
import { Reply, ReplyFilter, ReplyId, ReplyService } from './appreciation';

export class AppreciationReplyController extends Controller<Reply, ReplyId, ReplyFilter> {
  constructor(log: Log, protected replyService: ReplyService) {
    super(log, replyService);
  }
}
