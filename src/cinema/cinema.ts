import { Attributes, DateRange, Filter, Repository, Service } from 'onecore';

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
}
export interface Cinema {
  cinemaId: string;
  cinemaName: string;
  latitude?: string;
  longitude?: string;
  status?: string;
  parentCinema?: string;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
}
export interface CinemaRepository extends Repository<Cinema, string> {
}
export interface CinemaService extends Service<Cinema, string, CinemaFilter> {
}

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
  address:{
    length: 255,
  },
  parent:{
    length: 40
  },
  status: {
    length: 1
  },
  createdBy: {},
  createdAt: {
    column: 'createdat',
    type: 'datetime'
  },
  updatedBy: {},
  updatedAt: {
    column: 'createdat',
    type: 'datetime'
  }
};