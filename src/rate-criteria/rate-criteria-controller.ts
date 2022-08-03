import { Request, Response } from 'express';
import { RateCriteria, RateCriteriaFilter, RateCriteriaId, RateCriteriaService } from './rate-criteria';
import { buildArray, format, fromRequest, getInteger, getParameters, getStatusCode, handleError, jsonResult, Log, ViewController } from 'express-ext';

interface ErrorMessage {
    field: string;
    code: string;
    param?: string | number | Date;
    message?: string;
}

export interface Validator<T> {
    validate(model: T, ctx?: any): Promise<ErrorMessage[]>;
}

export class RateCriteriaController<R, F> {
    constructor(protected log: Log, protected rateCriteriaService: RateCriteriaService, public validator: Validator<R>, dates: string[], numbers: string[], public generate: () => string, commentId?: string, userId?: string, author?: string, id?: string) {
        this.search = this.search.bind(this);
        this.getRate = this.getRate.bind(this);
        this.rate = this.rate.bind(this);
        this.dates = dates ? dates : ['time'];
        this.numbers = numbers ? numbers : ['rate', 'usefulCount', 'replyCount', 'count', 'score'];
        this.id = (id && id.length > 0 ? id : 'id');
        this.author = (author && author.length > 0 ? author : 'author');
        this.userId = (userId && userId.length > 0 ? userId : 'userId');
        this.commentId = (commentId && commentId.length > 0 ? commentId : 'commentId');
    }

    protected dates: string[];
    protected numbers: string[];
    protected id: string;
    protected author: string;
    protected userId: string;
    protected commentId: string;

    search(req: Request, res: Response) {
        const s = fromRequest<R>(req, buildArray(undefined, 'fields'));
        const l = getParameters(s);
        const s2: any = format(s, this.dates, this.numbers);
        const id = req.params[this.id];
        const author = req.params[this.author];
        s2[this.id] = id;
        s2[this.author] = author;
        this.rateCriteriaService.search(s2, l.limit, l.skipOrRefId, l.fields)
            .then(result => jsonResult(res, result, false, l.fields))
            .catch(err => handleError(err, res, this.log));
    }

    getRate(req: Request, res: Response) {
        const id = req.params[this.id];
        const author = req.params[this.author];
        this.rateCriteriaService.getRate(id, author)
            .then(cinemas => res.status(200).json(cinemas))
            .catch(err => handleError(err, res, this.log));
    }

    rate(req: Request, res: Response) {
        const id = req.params[this.id];
        const author = req.params[this.author];
        const rate: any = { [this.id]: id, [this.author]: author, ...req.body};
        this.validator.validate(rate).then(errors => {
            if (errors && errors.length > 0) {
              res.status(getStatusCode(errors)).json(errors).end();
            } else {
              this.rateCriteriaService.rate(rate).then(rs => {
                return res.status(200).json(rs).end();
              }).catch(err => handleError(err, res, this.log));
            }
          }).catch(err => handleError(err, res, this.log));
    }
}
