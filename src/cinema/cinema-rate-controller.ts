import { Controller, Log } from "express-ext";
import { Validator } from 'onecore';
import { createValidator } from 'xvalidators';
import { CinemaRate, cinemaRateModel, CinemaRateFilter, CinemaRateService } from './cinema';

export class CinemaRateController extends Controller<CinemaRate, string, CinemaRateFilter>{
    constructor(log: Log, cinemaRateService: CinemaRateService) {
        super(log, cinemaRateService);
    }
}