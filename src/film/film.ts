import { Attributes, Filter, Search, Service } from 'onecore';
import { Repository } from 'query-core';

export interface FilmFilter extends Filter {
  id?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  status?: string;
}

export interface Film {
  filmId: string;
  title: string;
  status: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  categories?: string[];
  info?: FilmInfo
}

export interface FilmInfo {
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
export interface FilmRate {
  id?: string;
  // filmId: string;
  userId: string;
  rate: number;
  rateTime?: Date;
  review?: string;
  usefulCount?: number;
}

export interface FilmRateFilter extends Filter {
  id?: string;
  review?: string;
  userId?: string;
  rateTime?: Date;
  usefulCount?: number;
}

export interface FilmRepository extends Repository<Film, string> {
}
export interface FilmService extends Service<Film, string, FilmFilter> {
  rate(rate: FilmRate): Promise<boolean>;
}

export interface FilmInfoRepository extends Repository<FilmInfo, string> {
}

export interface FilmRateRepository extends Repository<FilmRate, string> {
  deleteFilmRate(id: string, author: string, ctx?: any): Promise<boolean>
  searchFilmRate(obj: FilmRate): Promise<FilmRate | null>
}
export interface FilmRateService extends Service<FilmRate, string, FilmRateFilter> {
  usefulFilm(obj:UsefulFilmFilter): Promise<number>;
  usefulSearch(obj:UsefulFilmFilter): Promise<number>;
}

export const filmModel: Attributes = {
  filmId: {
    key: true,
    length: 40
  },
  title: {
    required: true,
    length: 300,
    q: true

  },
  description: {
    length: 300,
  },
  imageUrl: {
    length: 300
  },
  trailerUrl: {
    length: 300
  },
  categories: {
    type: 'primitives',
  },
  status: {
    match: "equal",
    length: 1
  },
  createdBy: {},
  createdAt: {
    type: 'datetime'
  },
  updatedBy: {},
  updatedAt: {
    type: 'datetime'
  },

};

export const filmInfoModel: Attributes = {
  id: {
    key: true,
  },
  viewCount: {
    type: 'number',
  },
  rate: {
    type: 'number',
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
};

export const filmRateModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  // filmId: {
  //   required: true
  // },
  userId: {
    key: true,
    required: true
  },
  rate: {
    type: 'integer',
    min: 1,
    max: 10
  },
  usefulCount:{
    type: 'integer',
    min: 0
  },
  rateTime: {
    type: 'datetime',
  },
  review: {
    q: true,
  },
};

//---------------------

export interface UsefulFilmFilter extends Filter {
  id: string;
  author: string;
  createdat?: Date;
  updatedat?: Date;
}
export interface UsefulFilm {
  id: string;
  author: string;
  createdat?: Date;
  updatedat?: Date;
}
export interface UsefulFilmRepository extends Repository<UsefulFilm, string> {
  deleteUseful(id: string, author: string, ctx?: any): Promise<boolean>
  searchUseful(obj: UsefulFilm): Promise<UsefulFilm | null>
}

export const UsefulFilmModel: Attributes = {
  id: {
    required: true,
    length: 255,
  },
  author: {
    required: true,
    length: 255,
  },
  createdAt: {
    type: 'datetime'
  },
  updatedAt: {
    type: 'datetime'
  },
};

