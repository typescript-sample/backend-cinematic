import { Attributes, Filter, Search, Service } from 'onecore';
import { Repository, SearchResult } from 'query-core';

export interface AppreciationId {
    id: string;
    author: string;
}

export interface Appreciation {
    id: string;
    author: string;
    title: string;
    description: string;
    createAt: Date;
    replyCount: number;
}

export interface AppreciationFilter extends Filter {
    id?: string;
    author?: string;
    title?: string;
    description?: string;
    createAt?: Date;
    replyCount?: number;
}

export interface AppreciationRepository extends Repository<Appreciation, AppreciationId> {
    getAppreciation(id: string, author: string): Promise<Appreciation | null>;
    increaseReplyCount(id: string, author: string, ctx?: any): Promise<number>;
    decreaseReplyCount(id: string, author: string, ctx?: any): Promise<number>;
}

export interface AppreciationService extends Service<Appreciation, AppreciationId, AppreciationFilter> {
    reply(reply: Reply): Promise<boolean>;
    removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number>;
    updateReply(reply: Reply): Promise<number>;
    setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
}

export interface ReplyRepository extends Repository<Reply, AppreciationId> {
    getReply(id: string, author: string, userId: string): Promise<Reply | null>;
    save(obj: Reply, ctx?: any): Promise<number>;
    removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number>;
    increaseUsefulCount(id: string, author: string, userId: string, ctx?: any): Promise<number>;
    decreaseUsefulCount(id: string, author: string, userId: string, ctx?: any): Promise<number>;
}

export interface ReplyService extends Service<Reply, ReplyId, ReplyFilter> { }

export interface UsefulService extends Service<Useful, UsefulId, UsefulFilter> {
}

export interface UsefulRepository {
    getUseful(id: string, author: string, userId: string): Promise<Useful | null>;
    removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
    save(obj: Useful, ctx?: any): Promise<number>;
};

export const appreciationModel: Attributes = {
    id: {
        key: true,
        required: true,
        match: 'equal'
    },
    author: {
        key: true,
        required: true,
        match: 'equal'
    },
    title: {},
    description: {},
    createAt: {
        type: 'datetime'
    },
    replyCount: {
        type: 'integer',
        min: 0
    }
}

export interface ReplyId {
    id: string;
    author: string;
    userId: string;
}

export interface Reply {
    id: string;
    author: string;
    userId: string;
    description: string;
    createAt: Date;
    updateAt: Date;
    usefulCount: number;
    replyCount: number;
}

export interface ReplyFilter extends Filter {
    id?: string;
    author?: string;
    userId?: string;
    description?: string;
    createAt?: Date;
    updateAt?: Date;
    usefulCount?: number;
    replyCount?: number;
}

export const replyModel: Attributes = {
    id: {
        key: true,
        required: true,
        match: 'equal'
    },
    author: {
        key: true,
        required: true,
        match: 'equal'
    },
    userId: {
        key: true,
        required: true,
        match: 'equal'
    },
    description: {},
    createAt: {
        type: 'datetime'
    },
    updateAt: {
        type: 'datetime'
    },
    usefulCount: {
        type: 'integer',
        min: 0
    },
    replyCount: {
        type: 'integer',
        min: 0
    }
}

export interface Useful {
    id: string;
    author: string;
    userId: string;
    reviewTime: Date;
}

export interface UsefulFilter extends Filter {
    id?: string;
    userId?: string;
    author?: string;
    reviewTime?: Date;
}

export interface UsefulId {
    id: string;
    author: string;
    userId: string;
}


export const usefulModel: Attributes = {
    id: {
        key: true,
        required: true
    },
    userId: {
        key: true,
        required: true
    },
    author: {
        key: true,
        required: true
    },
    reviewTime: {
        type: 'datetime',
    },
}
