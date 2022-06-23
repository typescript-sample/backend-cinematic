import { Controller, handleError, Log, queryParam, getStatusCode } from "express-ext";
import { Film, FilmFilter, FilmService, FilmRate, filmRateModel } from "./film";
import { Request, Response } from "express";
import { Search, Validator } from 'onecore';
import { createValidator } from 'xvalidators';
export class FilmController extends Controller<Film, string, FilmFilter>{
  validator: Validator<FilmRate>;
  constructor(log: Log, private filmService: FilmService) {
    super(log, filmService);
    this.array= ["status"];
    this.all = this.all.bind(this);
    this.rate= this.rate.bind(this);
    this.validator = createValidator<FilmRate>(filmRateModel);
  }
  all(req: Request, res: Response) {
    if (this.filmService.all) {
      this.filmService.all()
        .then(films => res.status(200).json(films)).catch(err => handleError(err, res, this.log));
    }
  }
  rate(req: Request, res: Response) {
    const rate: FilmRate = req.body;
    rate.rateTime = new Date();
    this.validator.validate(rate).then(errors => {
      if (errors && errors.length > 0) {
        res.status(getStatusCode(errors)).json(errors).end();
      } else {
        this.filmService.rate(rate).then(rs => {
          res.json(rs).end();
        }).catch(err => handleError(err, res, this.log));
      }
    }).catch(err => handleError(err, res, this.log));
  }
  
}
