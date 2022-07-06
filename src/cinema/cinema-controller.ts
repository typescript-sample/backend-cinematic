import { Controller, Log, handleError, queryParam, getStatusCode } from 'express-ext';
import { Cinema, CinemaFilter, CinemaService, CinemaRate, cinemaRateModel } from './cinema';
import { Request, Response } from 'express';
import { Search, Validator } from 'onecore';
import { createValidator } from 'xvalidators';
import { Rate, RateFilter, RateService, RateController, RateRepository } from '../rate';

export class CinemaController extends Controller<Cinema, string, CinemaFilter> {

  validator: Validator<CinemaRate>;

  constructor(log: Log, private cinemaService: CinemaService) {
    super(log, cinemaService);
    this.array = ["status"];
    this.all = this.all.bind(this);
    //this.rate = this.rate.bind(this);
    this.validator = createValidator<CinemaRate>(cinemaRateModel);
  }

  all(req: Request, res: Response) {
    if (this.cinemaService.all) {
      this.cinemaService.all()
        .then(cinemas => res.status(200).json(cinemas))
        .catch(err => handleError(err, res, this.log));
    }
  }

  // rate(req: Request, res: Response) {
  //   const rate: CinemaRate = req.body;
  //   console.log("add rate req: ");
  //   console.log(rate);

  //   rate.rateTime = new Date();
  //   this.validator.validate(rate).then(errors => {
  //     if (errors && errors.length > 0) {
  //       res.status(getStatusCode(errors)).json(errors).end();
  //     } else {
  //       this.cinemaService.rate(rate).then(rs => {
  //         res.json(rs).end();
  //       }).catch(err => handleError(err, res, this.log));
  //     }
  //   }).catch(err => handleError(err, res, this.log))
  // }

  
}
