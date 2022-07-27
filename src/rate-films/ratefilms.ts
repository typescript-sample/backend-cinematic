import { RateComment } from 'rate5';
import { Attributes, Filter, Repository, Service, ViewRepository } from '../rate/core';
export interface RateId {
    id: string;
    author: string;
}

export interface Rate {
    id: string;
    author: string;
    rate: number;
    time: Date;
    review: string;
    usefulCount: number;
    replyCount: number;
    histories?: ShortRate[];
}
export interface ShortRate {
    rate: number;
    time: Date;
    review: string;
}
export interface RateFilter extends Filter {
    id?: string;
    author?: string;
    rate: number;
    time?: Date;
    review?: string;
    usefulCount?: number;
    replyCount?: number;
}

export const rateHistoryModel: Attributes = {
    rate: {
        type: 'integer'
    },
    time: {
        type: 'datetime',
    },
    review: {
    },
};

export const rateModel: Attributes = {
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
    rate: {
        type: 'integer',
        min: 1,
        max: 10
    },
    time: {
        type: 'datetime',
    },
    review: {
        q: true,
    },
    usefulCount: {
        type: 'integer',
        min: 0
    },
    replyCount: {
        type: 'integer',
        min: 0
    },
    histories: {
        type: 'array',
        typeof: rateHistoryModel
    }
};
export interface RateFilmInfoRepository extends ViewRepository<RateFilmInfo, string> {
    save(obj: RateFilmInfo, ctx?: any): Promise<number>;
}

export interface RateFilmInfo {
    id: string;
    rate: number;
    rate1: number;
    rate2: number;
    rate3: number;
    rate4: number;
    rate5: number;
    rate6: number;
    rate7: number;
    rate8: number;
    rate9: number;
    rate10: number;
    count: number;
    score: number;
}

export const rateFilmInfoModel: Attributes = {
    id: {
        key: true,
    },
    rate: {
        type: 'number',
        min: 1,
        max: 10
    },
    rate1: {
        type: 'number',
    },
    rate2: {
        type: 'number',
    },
    rate3: {
        type: 'number',
    },
    rate4: {
        type: 'number',
    },
    rate5: {
        type: 'number',
    },
    rate6: {
        type: 'number',
    },
    rate7: {
        type: 'number',
    },
    rate8: {
        type: 'number',
    },
    rate9: {
        type: 'number',
    },
    rate10: {
        type: 'number',
    },
    count: {
      type: 'number',
    },
    score: {
      type: 'number',
    }
}