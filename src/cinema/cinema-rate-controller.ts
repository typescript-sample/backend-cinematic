import { Controller, Log } from 'express-ext';
import { CinemaRate, CinemaRateFilter, CinemaRateService } from './cinema';

export class CinemaRateController extends Controller<CinemaRate, string, CinemaRateFilter> {
  constructor(log: Log, cinemaRateService: CinemaRateService) {
    super(log, cinemaRateService);
  }
}
