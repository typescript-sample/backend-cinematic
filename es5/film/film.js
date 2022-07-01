"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filmRateModel = exports.filmInfoModel = exports.filmModel = void 0;
exports.filmModel = {
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
exports.filmInfoModel = {
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
exports.filmRateModel = {
    id: {
        key: true,
    },
    filmId: {
        required: true
    },
    userId: {
    // required: true
    },
    rate: {
        type: 'integer',
        min: 1,
        max: 10
    },
    rateTime: {
        type: 'datetime',
    },
    review: {
        q: true,
    },
};
//# sourceMappingURL=film.js.map