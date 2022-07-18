import { Attributes, DateRange, Filter, Service } from 'onecore';
import { Repository } from 'query-core';

export interface CinemaFilter extends Filter {
  cinemaId?: string;
  cinemaName?: string;
  latitude?: string;
  longitude?: string;
  status?: string;
  createdby?: string;
  createdat?: Date | DateRange;
  parentCinema?: string;
  updatedby?: string;
  updatedat?: Date | DateRange;
  info?: Info;
}

export interface Cinema {
  cinemaId: string;
  cinemaName: string;
  imageURL?: string;
  coverURL?: string;
  latitude?: string;
  longitude?: string;
  status?: string;
  parentCinema?: string;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
  gallery?: string;
  info?: Info;
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

export interface CinemaRate {
  id: string;
  userId: string;
  rate: number;
  rateTime?: Date;
  review?: string;
}

export interface CinemaRateFilter extends Filter {
  id?: string;
  userId?: string;
  rate?: number;
  rateTime?: Date;
  review?: string;
}

export interface CinemaRepository extends Repository<Cinema, string> { }

export interface CinemaService extends Service<Cinema, string, CinemaFilter> {
  // rate(rate: CinemaRate): Promise<boolean>;
}

export interface InfoRepository extends Repository<Info, string> { }

export interface CinemaRateRepository extends Repository<CinemaRate, string> {
  // search(rate: CinemaRateFilter): Promise<CinemaRate | null>;
  // updateCinemaRate(rate: CinemaRateFilter): Promise<boolean>;
}

export interface CinemaRateService extends Service<CinemaRate, string, CinemaRateFilter> {

}

export const galleryModel: Attributes = {
  url: {
    required: true,
  },
  type: {
    required: true,
  },
};

export const cinemaModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  name: {
    required: true,
    length: 255,
  },
  latitude: {
    length: 255,
  },
  longitude: {
    length: 255,
  },
  address: {
    length: 255,
  },
  parent: {
    length: 40
  },
  status: {
    length: 1
  },
  imageURL: {},
  coverURL: {},
  createdBy: {},
  createdAt: {
    column: 'createdat',
    type: 'datetime'
  },
  updatedBy: {},
  updatedAt: {
    column: 'createdat',
    type: 'datetime'
  },
  gallery: {
    column: 'gallery',
    type: 'array',
    typeof: galleryModel,
  }
};

export const cinemaRateModel: Attributes = {
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
  }
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
};
