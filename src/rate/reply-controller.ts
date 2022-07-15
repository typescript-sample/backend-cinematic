import { Controller, handleError, Log, getStatusCode } from "express-ext";
import {
    replyModel, Reply, ReplyFilter, ReplyId, ReplyRepository, ReplyService
} from './rate';
import { Request, Response } from 'express';
import { Search, Validator } from 'onecore';
import { createValidator } from 'xvalidators';

export class ReplyController extends Controller<Reply, ReplyId, ReplyFilter>{
    constructor(log: Log, protected replyService: ReplyService) {
        super(log, replyService);
    }
}