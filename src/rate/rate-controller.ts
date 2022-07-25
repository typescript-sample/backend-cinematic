import { Request, Response } from 'express';
import { Controller, getStatusCode, handleError, Log } from 'express-ext';
import { Validator } from 'onecore';
import { createValidator } from 'xvalidators';
import { Rate, RateComment, rateCommentModel, RateFilter, RateId, rateModel, RateService } from './rate';

export class RateController extends Controller<Rate, RateId, RateFilter> {
  validator: Validator<Rate>;
  rateCommentValidator: Validator<RateComment>;

  constructor(log: Log, protected rateService: RateService) {
    super(log, rateService);
    this.load = this.load.bind(this);
    this.update = this.update.bind(this);
    this.rate = this.rate.bind(this);
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.comment = this.comment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.updateRate = this.updateRate.bind(this);
    this.search = this.search.bind(this);
    this.validator = createValidator<Rate>(rateModel);
    this.rateCommentValidator = createValidator<RateComment>(rateCommentModel);
  }

  load(req: Request, res: Response) {
    const id = req.params.id;
    const author = req.params.author;
    const rateId: RateId = { id, author };
    this.rateService.load(rateId).then(rates => {
      if (rates) {
        return res.status(200).json(rates).end();
      } else {
        return res.status(200).json({}).end();
      }
    }).catch(err => handleError(err, res, this.log));
  }

  rate(req: Request, res: Response) {
    const rate: Rate = req.body;
    rate.time = new Date();
    this.validator.validate(rate).then(errors => {
      if (errors && errors.length > 0) {
        res.status(getStatusCode(errors)).json(errors).end();
      } else {
        this.rateService.rate(rate).then(rs => {
          return res.status(200).json(rs).end();
        }).catch(err => handleError(err, res, this.log));
      }
    }).catch(err => handleError(err, res, this.log));
  }

  setUseful(req: Request, res: Response) {
    const id = req.params.id;
    const author = req.params.author;
    const userId = req.params.userid;
    console.log(req.params);
    
    
    this.rateService.setUseful(id, author, userId).then(rs => {
      return res.status(200).json(rs).end();
    }).catch(err => handleError(err, res, this.log));
  }

  removeUseful(req: Request, res: Response) {
    const id = req.params.id;
    const author = req.params.author;
    const userId = req.params.userid;
    this.rateService.removeUseful(id, author, userId).then(rs => {
      return res.status(200).json(rs).end();
    }).catch(err => handleError(err, res, this.log));
  }

  comment(req: Request, res: Response) {
    const id = req.params.id;
    const author = req.params.author;
    const userId = req.params.userid;
    const comment: RateComment = { id, author, userId, ...req.body };
    this.rateCommentValidator.validate(comment).then(errors => {
      if (errors && errors.length > 0) {
        res.status(getStatusCode(errors)).json(errors).end();
      } else {
        this.rateService.comment(comment).then(rep => {
          return res.status(200).json(rep).end();
        }).catch(err => handleError(err, res, this.log));
      }
    }).catch(err => handleError(err, res, this.log));
  }

  removeComment(req: Request, res: Response) {
    const commentId = req.params.commentid;
    const author = req.params.author;
    this.rateService.removeComment(commentId, author).then(reply => {
      return res.status(200).json(reply).end();
    }).catch(err => handleError(err, res, this.log));
  }

  updateComment(req: Request, res: Response) {
    const commentId = req.params.commentid;
    const id = req.params.id;
    const author = req.params.author;
    const userId = req.params.userid;
    const comment: RateComment = {commentId, id, author, userId, ...req.body };
    this.rateCommentValidator.validate(comment).then(errors => {
      if (errors && errors.length > 0) {
        res.status(getStatusCode(errors)).json(errors).end();
      } else {
        this.rateService.updateComment(comment).then(rep => {
          return res.status(200).json(rep).end();
        }).catch(err => handleError(err, res, this.log));
      }
    }).catch(err => handleError(err, res, this.log));
  }

  updateRate(req: Request, res: Response) {
    const id = req.params.id;
    const author = req.params.author;
    const rate: Rate = { id, author, ...req.body };
    this.validator.validate(rate).then(errors => {
      if (errors && errors.length > 0) {
        res.status(getStatusCode(errors)).json(errors).end();
      } else {
        this.rateService.updateRate(rate).then(reply => {
          return res.status(200).json(reply).end();
        }).catch(err => handleError(err, res, this.log));
      }
    }).catch(err => handleError(err, res, this.log));
  }
}
