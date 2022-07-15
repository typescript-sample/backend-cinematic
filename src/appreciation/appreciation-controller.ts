import { Controller, handleError, Log, getStatusCode } from "express-ext";
import {
    Appreciation, AppreciationFilter, AppreciationId, AppreciationRepository, AppreciationService, appreciationModel,
    replyModel, Reply, ReplyFilter, ReplyId, ReplyRepository, ReplyService
} from './appreciation';
import { Request, Response } from 'express';
import { Search, Validator } from 'onecore';
import { createValidator } from 'xvalidators';

export class AppreciationController extends Controller<Appreciation, AppreciationId, AppreciationFilter>{
    validator: Validator<Appreciation>;

    constructor(log: Log, protected appreciationService: AppreciationService) {
        super(log, appreciationService);
        this.validator = createValidator<Appreciation>(appreciationModel);
        this.load = this.load.bind(this);
        this.update = this.update.bind(this);
        this.reply = this.reply.bind(this);
        this.removeReply = this.removeReply.bind(this);
        this.updateReply = this.updateReply.bind(this);
        this.setUseful = this.setUseful.bind(this);
    }

    load(req: Request, res: Response) {
        const id = req.params.id;
        const author = req.params.author;
        const appreciationId: AppreciationId = { id, author };
        this.appreciationService.load(appreciationId).then(appreciation => {
            if (appreciation) {
                return res.status(200).json(appreciation).end();
            } else {
                return res.status(200).json({}).end();
            }
        }).catch(err => handleError(err, res, this.log));
    }

    reply(req: Request, res: Response) {
        const id = req.params.id;
        const author = req.params.author;
        const userId = req.params.userid;
        const reply: Reply = {id, author, userId, ...req.body };
        this.appreciationService.reply(reply).then(reply => {
            return res.status(200).json(reply).end();
        }).catch(err => handleError(err, res, this.log))
    }

    removeReply(req: Request, res: Response) {
        const id = req.params.id;
        const author = req.params.author;
        const userId = req.params.userid;
        this.appreciationService.removeReply(id, author, userId).then(reply => {
            return res.status(200).json(reply).end();
        }).catch(err => handleError(err, res, this.log))
    }

    updateReply(req: Request, res: Response) {
        const id = req.params.id;
        const author = req.params.author;
        const userId = req.params.userid;
        const reply: Reply = {id, author, userId, ...req.body };
        this.appreciationService.updateReply(reply).then(reply => {
            return res.status(200).json(reply).end();
        }).catch(err => handleError(err, res, this.log))
    }

    setUseful(req: Request, res: Response) {
        console.log("useful");
        console.log(req.params);
        
        const id = req.params.id;
        const author = req.params.author;
        const userId = req.params.userid;
        this.appreciationService.setUseful(id, author, userId).then(rs => {
            return res.status(200).json(rs).end();
        }).catch(err => handleError(err, res, this.log));

    }
}

