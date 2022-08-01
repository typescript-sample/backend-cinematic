import { Attributes, Filter, Service } from 'onecore';
import { Repository } from 'query-core';

export interface RateCriteria {
    id: string;
    author: string;
    review: string;
    rates: string[];
}

export interface RateCriteriaId {
    id: string;
    author: string;
}

export interface RateCriteriaFilter extends Filter {
    id?: string;
    author?: string;
    review?: string;
}

export interface RateCriteriaRepository<R> {
}

// export interface RateCriteriaRepository extends Repository<RateCriteria, RateCriteriaId> {
// }

export interface RateCriteriaService extends Service<RateCriteria, RateCriteriaId, RateCriteriaFilter> {
}

export const criteriaModel: Attributes = {
    criteria1: {
        type: 'integer'
    },
    criteria2: {
        type: 'integer'
    },
    criteria3: {
        type: 'integer'
    },
    criteria4: {
        type: 'integer'
    },
    criteria5: {
        type: 'integer'
    },
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
    review: {},
    rates: {
        column: 'rates',
        type: 'array',
        typeof: criteriaModel
    }
}