import { Request, Response } from 'express';
import { Controller, getStatusCode, handleError, Log } from 'express-ext';
import { Validator } from 'onecore';
import { createValidator } from 'xvalidators';
import { Film, FilmFilter, FilmService } from './film';

export class FilmController extends Controller<Film, string, FilmFilter> {
  constructor(log: Log, private filmService: FilmService) {
    super(log, filmService);
    this.array = ['status'];
    this.all = this.all.bind(this);
  }
  all(req: Request, res: Response) {
    if (this.filmService.all) {
      this.filmService.all()
        .then(films => res.status(200).json(films))
        .catch(err => handleError(err, res, this.log));
    }
  }
}
