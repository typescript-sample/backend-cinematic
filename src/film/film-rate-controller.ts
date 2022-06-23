import { Controller, Log } from "express-ext";
import { FilmRate, filmRateModel, FilmRateFilter, FilmRateService } from "./film";
import {  Validator } from 'onecore';
import { createValidator } from 'xvalidators';
export class FilmRateController extends Controller<FilmRate, string, FilmRateFilter>{
  // validator: Validator<FilmRate>;
  constructor(log: Log, filmRateService: FilmRateService) {
    super(log, filmRateService);
    // this.validator = createValidator<FilmRate>(filmRateModel);
  }

}
