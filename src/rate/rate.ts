import { Attributes, Filter, Search, Service } from 'onecore';
import { Repository } from 'query-core';

export interface RateId {
  id: string;
  userId: string;
}
export interface Rate {
  id: string;
  userId: string;
  rate: number;
  rateTime: Date;
  review: string;
  usefulCount: number;
}

export interface UsefulRateId {
  id: string;
  userId: string;
  author: string;
}

export interface UsefulRate {
  id: string;
  userId: string;
  author: string;
  reviewTime: Date;
}

export interface UsefulRateFilter extends Filter {
  id?: string;
  userId?: string;
  author?: string;
  reviewTime?: Date;
}

export interface RateFilter extends Filter {
  id?: string;
  userId?: string;
  rate: number;
  rateTime?: Date;
  review?: string;
  usefulCount?: number;
}

export interface RateRepository extends Repository<Rate, RateId> {
  save(obj: Rate, ctx?: any): Promise<number>;
  getRate(id: string, userId: string): Promise<Rate | null>;
  increaseUsefulCount(id: string, userId: string, ctx?: any): Promise<number>;
  decreaseUsefulCount(id: string, userId: string, ctx?: any): Promise<number>;
};

export interface RateService extends Service<Rate, RateId, RateFilter> {
  getRate(id: string, userId: string): Promise<Rate | null>;
  rate(rate: Rate): Promise<boolean>;
  setUseful(id: string, userId: string, author: string, ctx?: any): Promise<number>;
  removeUseful(id: string, userId: string, author: string, ctx?: any): Promise<number>;
}

export interface UsefulRateService extends Service<UsefulRate, UsefulRateId, UsefulRateFilter> {
  setUseful(id: string, userId: string, author: string): Promise<number>;
}

export const rateModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  rate: {
    type: 'integer',
    min: 1,
    max: 5
  },
  rateTime: {
    type: 'datetime',
  },
  review: {
    q: true,
  },
  usefulCount: {
    type: 'integer'
  }
}

export const usefulRateModel: Attributes = {
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

export interface Info {
  id: string;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  viewCount: number;
}

export interface UsefulRateRepository {
  getUseful(id: string, userId: string, author: string): Promise<UsefulRate | null>;
  removeUseful(id: string, userId: string, author: string, ctx?: any): Promise<number>;
  save(obj: UsefulRate, ctx?: any): Promise<number>;
};

export interface InfoRepository extends Repository<Info, string> {
  save(obj: Info, ctx?: any): Promise<number>;
};

export const infoModel: Attributes = {
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
}
