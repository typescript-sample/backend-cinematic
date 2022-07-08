import { Controller, handleError, Log, getStatusCode } from "express-ext";
import { Rate, RateFilter, RateId, rateModel, RateRepository, RateService, UsefulRate, UsefulRateId } from './rate';
import { Request, Response } from 'express';
import { Search, Validator } from 'onecore';
import { createValidator } from 'xvalidators';

export class RateController extends Controller<Rate, RateId, RateFilter>{

    validator: Validator<Rate>;

    constructor(log: Log, protected rateService: RateService) {
        super(log, rateService);
        //this.all = this.all.bind(this);
        this.load = this.load.bind(this);
        this.update = this.update.bind(this);
        this.rate = this.rate.bind(this);
        this.setUseful = this.setUseful.bind(this);
        this.removeUseful = this.removeUseful.bind(this);
        this.validator = createValidator<Rate>(rateModel);
        //console.log(JSON.stringify(this.keys))
    }

    // all(req: Request, res: Response) {
    //     if (this.rateService.all) {
    //         this.rateService.all()
    //             .then(rates => res.status(200).json(rates))
    //             .catch(err => handleError(err, res, this.log));
    //     }
    // }

    load(req: Request, res: Response) {
        const id = req.params.id;
        const userId = req.params.userId;
        const rateId: RateId = { id, userId };
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
        rate.rateTime = new Date();
        this.rateService.rate(rate).then(rs => {
            return res.status(200).json(rs).end();
        }).catch(err => handleError(err, res, this.log));
    }

    setUseful(req: Request, res: Response) {
        const id = req.params.id;
        const userId = req.params.userid;
        const author = req.params.author;
        this.rateService.setUseful(id, userId, author).then(rs => {
            return res.status(200).json(rs).end();
        }).catch(err => handleError(err, res, this.log));
    }

    removeUseful(req: Request, res: Response) {
        const id = req.params.id;
        const userId = req.params.userid;
        const author = req.params.author;
        this.rateService.removeUseful(id, userId, author).then(rs => {
            return res.status(200).json(rs).end();
        }).catch(err => handleError(err, res, this.log));
    }
}