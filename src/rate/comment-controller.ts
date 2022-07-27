import { Controller, Log, SearchController, ViewController } from 'express-ext';
import { RateComment, RateCommentFilter, RateCommentService } from './rate';

export class RateCommentController extends ViewController<RateComment, string, RateCommentFilter> {
  constructor(log: Log, protected rateCommentService: RateCommentService) {
    super(log, rateCommentService);
  }
}

