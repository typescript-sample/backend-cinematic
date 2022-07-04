"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cinemaInfoModel = exports.cinemaRateModel = exports.cinemaModel = exports.galleryModel = void 0;
;
;
;
exports.galleryModel = {
    url: {
        required: true,
    },
    type: {
        required: true,
    },
};
exports.cinemaModel = {
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
        typeof: exports.galleryModel,
    }
};
exports.cinemaRateModel = {
    id: {
        key: true,
        required: true
    },
    userid: {
        key: true,
        required: true
    },
    rate: {
        type: 'integer',
        min: 1,
        max: 5
    },
    ratetime: {
        type: 'datetime',
    },
    review: {
        q: true,
    },
};
exports.cinemaInfoModel = {
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
//# sourceMappingURL=cinema.js.map