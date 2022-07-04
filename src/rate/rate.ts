import { Attributes, Filter, Search, Service } from 'onecore';
import { Repository } from 'query-core';

export interface RateId {
  id: string;
  userId: string;
}
export interface Rate {
  id: string;
  userId?: string;
  rate?: number;
  rateTime?: Date;
  review?: string;
}

export interface RateFilter extends Filter {
  id?: string;
  userId?: string;
  rate: number;
  rateTime?: Date;
  review?: string;
}

export interface RateRepository extends Repository<Rate, RateId> {
  // searchRate(rate: RateFilter): Promise<Rate | null>;
  // updateRate(rate: RateFilter): Promise<boolean>;
};

export interface RateService extends Service<Rate, RateId, RateFilter> {
  // searchRate(rate: RateFilter): Promise<Rate | null>;
  // updateRate(rate: RateFilter): Promise<boolean>;
  rate(rate: Rate): Promise<boolean>;
  update(rate: Rate): Promise<number>;
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
}