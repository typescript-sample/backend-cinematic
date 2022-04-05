import { Attributes, DateRange, Filter, Repository, Service } from 'onecore';

export interface CinemaParentFilter extends Filter {
  id?: string;
  name?: string;
  aliases?: string;
  status?: string;
  createdby?: string;
  createdat?: Date | DateRange;
  updatedby?: string;
  updatedat?: Date | DateRange;
}
export interface CinemaParent {
  id: string;
  name: string;
  logo?: string;
  aliases?: string;
  status?: string;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
}
export interface CinemaParentRepository extends Repository<CinemaParent, string> {
}
export interface CinemaParentService extends Service<CinemaParent, string, CinemaParentFilter> {
}

export const CinemaParentModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  name: {
    required: true,
    length: 255,
  },
  aliases: {
    length: 120,
  },
  status: {
    length: 1
  },
  logo: {
    length: 255
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