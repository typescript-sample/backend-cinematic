import { Request, Response } from 'express';
import { Controller, getStatusCode, handleError, Log } from 'express-ext';
import { Validator } from 'onecore';
import { createValidator } from 'xvalidators';
import { RateFilmId, RateFilms } from './ratefilms';

// export class RateFilmController extends Controller<RateFilms, RateFilmId>{

// }