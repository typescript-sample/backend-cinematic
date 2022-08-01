import { Request, Response } from 'express';
import { Controller, handleError, Log } from 'express-ext';
import { RateCriteria, RateCriteriaFilter, RateCriteriaId, RateCriteriaService } from './rate-criteria';

export class RateCriteriaController extends Controller<RateCriteria, RateCriteriaId, RateCriteriaFilter> {
    constructor(log: Log, rateCriteriaService: RateCriteriaService) {
        super(log, rateCriteriaService);
    }
}
