import { Attributes, Filter, Repository, Service, ViewRepository } from './core';

export interface RateFilmId {
    id: string;
    author: string;
}

export interface RateFilms {
    id: string;
    author: string;
    rate: number;
    time: Date;
    review: string;
    usefulCount: number;
    replyCount: number;
    histories?: RateFilmHistories[];
}

export interface RateFilmHistories {
    rate: number;
    time: Date;
    review: string;
}

export interface RateFilmsFilter extends Filter {
    id?: string;
    author?: string;
    rate?: number;
    time?: Date;
    review?: string;
    usefulCount?: number;
    replyCount?: number;
    histories?: RateFilmHistories[];
}

export interface RateFilmsRepository extends Repository<RateFilms, RateFilmId> {

}

export interface RateFilmsService extends Service<RateFilms, RateFilmId, RateFilmsFilter> {

}

export const rateFilmHistoriesModel: Attributes = {
    rate: {
        type: 'integer'
    },
    time: {
        type: 'datetime',
    },
    review: {
        q: true,
    },
}

export const rateFilmsModel: Attributes = {
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
        typeof: rateFilmHistoriesModel
    }
}

export interface Rate

export const rateInfoFilmsModel: Attributes = {
    id: {
        key: true,
    },
    viewCount: {
        type: 'number'
    },
    rate: {
        type: 'number'
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
}