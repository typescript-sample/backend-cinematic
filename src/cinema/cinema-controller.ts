import { Request, Response } from 'express';
import { Controller, handleError, Log } from 'express-ext';
import { Validator } from 'onecore';
import { createValidator } from 'xvalidators';
import { Cinema, CinemaFilter, CinemaRate, cinemaRateModel, CinemaService } from './cinema';

export class CinemaController extends Controller<Cinema, string, CinemaFilter> {
  validator: Validator<CinemaRate>;
  constructor(log: Log, private cinemaService: CinemaService) {
    super(log, cinemaService);
    this.array = ['status'];
    this.all = this.all.bind(this);
    this.validator = createValidator<CinemaRate>(cinemaRateModel);
  }

  all(req: Request, res: Response) {
    if (this.cinemaService.all) {
      this.cinemaService.all()
        .then(cinemas => res.status(200).json(cinemas))
        .catch(err => handleError(err, res, this.log));
    }
  }

  
}
