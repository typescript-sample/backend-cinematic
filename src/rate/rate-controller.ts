import { Controller, handleError, Log, getStatusCode } from "express-ext";
import { Rate, RateFilter, RateId, rateModel, RateRepository, RateService } from './rate';
import { Request, Response } from 'express';
import { Search, Validator } from 'onecore';
import { createValidator } from 'xvalidators';

export class RateController extends Controller<Rate, RateId, RateFilter>{

    validator: Validator<Rate>;

    constructor(log: Log, public rateService: RateService) {
        super(log, rateService);
        this.all = this.all.bind(this);
        this.load = this.load.bind(this);
        this.update = this.update.bind(this);
        this.rate = this.rate.bind(this);
        this.validator = createValidator<Rate>(rateModel);
        //console.log(JSON.stringify(this.keys))
    }

    all(req: Request, res: Response) {
        if (this.rateService.all) {
            this.rateService.all()
                .then(rates => res.status(200).json(rates))
                .catch(err => handleError(err, res, this.log));
        }
    }

    load(req: Request, res: Response) {
        console.log(req.params);

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

    update(req: Request, res: Response) {
        const rate: Rate = req.body;
        console.log(req.body);

        rate.id = req.params.id;
        rate.userId = req.params.userId;

        this.rateService.update(rate).then(row => {
            console.log(row);
            return res.status(200).json(row).end();
        }).catch(err => handleError(err, res, this.log));

    }

    rate(req: Request, res: Response) {
        const rate: Rate = req.body;
        rate.rateTime = new Date();
        console.log(rate);
        
        this.rateService.rate(rate).then(rs => {
            return res.json(rs).end();
        }).catch(err => handleError(err, res, this.log));
    }
}