import { Attributes, Filter, SearchResult } from 'onecore';

export interface RateCriteria {
    id: string;
    author: string;
    rate: number;
    rates: number[];
    time: Date;
    review: string;
    usefulCount: number;
    replyCount: number;
    histories?: ShortRate[];
    authorURL?: string;
}

export interface ShortRate {
    rates: number[];
    time: Date;
    review: string;
}

export interface RateCriteriaId {
    id: string;
    author: string;
}

export interface RateCriteriaFilter extends Filter {
    id?: string;
    author?: string;
    rates?: number[];
    time?: Date;
    review?: string;
    usefulCount?: number;
    replyCount?: number;
}

export interface RateCriteriaRepository<R> {
    getRate(id: string, author: string): Promise<R | null>;
    insert(rate: R, newInfo?: boolean): Promise<number>;
    update(rate: R, oldRate: number): Promise<number>;
}

export interface RateCriteriaService {
    search(s: RateCriteriaFilter, limit?: number, offset?: number | string, fields?: string[], ctx?: any): Promise<SearchResult<RateCriteria>>;
    getRate(id: string, author: string): Promise<RateCriteria | null>;
    rate(rate: RateCriteria): Promise<number>;
}

export interface RateFullInfo {
    id: string;
    rate: number;
    count: number;
    score: number;
}

export const rateFullInfoModel: Attributes = {
    id: {
        key: true
    },
    rate: {
        type: 'number',
    },
    count: {
        type: 'number',
    },
    score: {
        type: 'number',
    }
}

export const rateCriteriaModel: Attributes = {
    id: {
        key: true,
        match: 'equal'
    },
    author: {
        key: true,
        match: 'equal'
    },
    rate: { 
        type: 'number' 
    },
    rates: {
        type: 'integers'
    },
    time: {
        type: 'datetime'
    },
    review: {},
}