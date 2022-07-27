import { Request, Response } from 'express';
import { Controller, handleError, Log } from 'express-ext';
import { Cinema, CinemaFilter, CinemaService } from './cinema';

export class CinemaController extends Controller<Cinema, string, CinemaFilter> {
  constructor(log: Log, private cinemaService: CinemaService) {
    super(log, cinemaService);
    this.all = this.all.bind(this);
  } 

  all(req: Request, res: Response) {
    if (this.cinemaService.all) {
      this.cinemaService.all()
        .then(cinemas => res.status(200).json(cinemas))
        .catch(err => handleError(err, res, this.log));
    }
  }
}
