import { Controller, Log } from 'express-ext';
import { RateComment, RateCommentFilter, RateCommentService } from './rate';

export class RateCommentController extends Controller<RateComment, string, RateCommentFilter> {
  constructor(log: Log, protected rateCommentService: RateCommentService) {
    super(log, rateCommentService);
  }
}

