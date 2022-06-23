import { LoadSearchHandler, Log } from 'express-ext';
import { Search, Validator } from 'onecore';
import { createValidator } from 'xvalidators';
import { Rate, RateFilter, rateModel, RateService} from './cinema';

export class CinemaRateController extends LoadSearchHandler<Rate, string, RateFilter>{
    validator: Validator<Rate>;
    constructor(log: Log, find: Search<Rate, RateFilter>, public service: RateService) {
    super(log, find, service);
    this.validator = createValidator<Rate>(rateModel);
  }
}

