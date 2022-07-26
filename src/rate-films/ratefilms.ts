import { Attributes, Filter, Repository, Service, ViewRepository } from './core';

export interface RateFilmInfoRepository extends ViewRepository<RateFilmInfo, string> {
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
    viewCount: number;
}

export const rateFilmInfoModel: Attributes = {
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