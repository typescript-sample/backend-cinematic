import { Controller, handleError, Log, getStatusCode } from "express-ext";
import {
    replyModel, Reply, ReplyFilter, ReplyId, ReplyRepository, ReplyService
} from './appreciation';
import { Request, Response } from 'express';
import { Search, Validator } from 'onecore';
import { createValidator } from 'xvalidators';

export class AppreciationReplyController extends Controller<Reply, ReplyId, ReplyFilter>{
    constructor(log: Log, protected replyService: ReplyService) {
        super(log, replyService);
    }
}