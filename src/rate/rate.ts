import { Attributes, Filter, Repository, Service } from './core';

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

export interface RateRepository extends Repository<Rate, RateId> {
  save(obj: Rate, ctx?: any): Promise<number>;
  getRate(id: string, author: string): Promise<Rate | null>;
  increaseUsefulCount(id: string, author: string, ctx?: any): Promise<number>;
  decreaseUsefulCount(id: string, author: string, ctx?: any): Promise<number>;
  increaseReplyCount(id: string, author: string, ctx?: any): Promise<number>;
  decreaseReplyCount(id: string, author: string, ctx?: any): Promise<number>;
}

export interface RateService extends Service<Rate, RateId, RateFilter> {
  getRate(id: string, author: string): Promise<Rate | null>;
  updateRate(rate: Rate): Promise<number>;
  rate(rate: Rate): Promise<boolean>;
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  comment(comment: RateComment): Promise<boolean>;
  removeComment(id: string, author: string, ctx?: any): Promise<number>;
  updateComment(comment: RateComment): Promise<number>;
}

export interface RateReactionRepository {
  getUseful(id: string, author: string, userId: string): Promise<RateReaction | null>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  save(obj: RateReaction, ctx?: any): Promise<number>;
}

export interface RateReactionService extends Service<RateReaction, RateReactionId, RateReactionFilter> {
}

export interface RateCommentRepository extends Repository<RateComment, string> {
  save(obj: RateComment, ctx?: any): Promise<number>;
}

export interface RateCommentService extends Service<RateComment, string, RateCommentFilter> {
}

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
    max: 5
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
  }
};

export interface RateReactionId {
  id: string;
  author: string;
  userId: string;
}

export interface RateReaction {
  id: string;
  author: string;
  userId: string;
  time: Date;
  reaction: number;
}

export interface RateReactionFilter extends Filter {
  id?: string;
  author?: string;
  userId?: string;
  time?: Date;
  reaction?: number;
}

export const rateReactionModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  author: {
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  time: {
    type: 'datetime',
  },
  reaction: {
    type: 'integer',
  }
};

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

export interface InfoRepository extends Repository<Info, string> {
  save(obj: Info, ctx?: any): Promise<number>;
}

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

export interface RateCommentId {
  id: string;
  author: string;
  userId: string;
}

export interface RateComment {
  commentId: string;
  id: string;
  author: string;
  userId: string;
  comment: string;
  time: Date;
}

export interface RateCommentFilter extends Filter {
  commentId?: string;
  id?: string;
  author?: string;
  userId?: string;
  comment?: string;
  time?: Date;
}

export const rateCommentModel: Attributes = {
  commentId: {
    key: true
  },
  id: {
    required: true,
    match: 'equal'
  },
  author: {
    required: true,
    match: 'equal'
  },
  userId: {
    required: true,
    match: 'equal'
  },
  comment: {},
  time: {
    type: 'datetime'
  }
};

